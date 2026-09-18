#!/usr/bin/env node

// Dispatch the monorepo workflow without native-sim's automatic git add/commit/push.
import { randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));

function run(command, args, { optional = false } = {}) {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8' });
  if (result.status !== 0 && !optional) {
    throw new Error((result.stderr || result.stdout || `${command} failed`).trim());
  }
  return result.status === 0 ? result.stdout.trim() : '';
}

const gh = (...args) => run('gh', args);
const git = (...args) => run('git', args);
const sessionPath = resolve(root, git('rev-parse', '--git-path', 'native-sim-monorepo-session.json'));

function readSession() {
  if (!existsSync(sessionPath)) throw new Error('No local native-sim session found.');
  return JSON.parse(readFileSync(sessionPath, 'utf8'));
}

function saveSession(session) {
  writeFileSync(sessionPath, JSON.stringify(session, null, 2), { mode: 0o600 });
}

function workflowRun(session) {
  const runs = JSON.parse(gh('run', 'list', '--workflow', 'native-sim.yml', '--repo', session.repo,
    '--limit', '30', '--json', 'databaseId,displayTitle,url,status'));
  return runs.find((run) => run.displayTitle.includes(session.id));
}

function streamUrl(session) {
  const response = JSON.parse(gh('api', `repos/${session.repo}/commits/${session.sha}/status`));
  const status = response.statuses.find((item) => item.context === `native-sim/${session.id}`);
  return status?.state === 'success' && status.target_url
    ? `${status.target_url.replace(/\/$/, '')}/?k=${session.key}`
    : null;
}

async function up(args) {
  let minutes = 60;
  let agent = false;
  for (let index = 0; index < args.length; index++) {
    if (args[index] === '--agent') agent = true;
    else if (args[index] === '--minutes') minutes = Number(args[++index]);
    else throw new Error(`Unknown option: ${args[index]}`);
  }
  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 350) {
    throw new Error('--minutes must be an integer from 1 to 350.');
  }

  gh('auth', 'status');
  const repoInfo = JSON.parse(gh('repo', 'view', '--json', 'nameWithOwner,defaultBranchRef'));
  const repo = repoInfo.nameWithOwner;
  const branch = git('branch', '--show-current');
  if (branch !== repoInfo.defaultBranchRef.name) {
    throw new Error(`Run this command from the default branch (${repoInfo.defaultBranchRef.name}).`);
  }
  const sha = git('rev-parse', 'HEAD');
  const remoteSha = JSON.parse(gh('api', `repos/${repo}/git/ref/heads/${branch}`)).object.sha;
  if (sha !== remoteSha) throw new Error('Push the current branch before starting a session.');
  gh('api', `repos/${repo}/contents/.github/workflows/native-sim.yml?ref=${branch}`);

  const id = randomBytes(4).toString('hex');
  const key = randomBytes(24).toString('base64url');
  const localVersion = run('agent-device', ['--version'], { optional: true }).split(/\s+/).pop();
  if (agent && !/^\d+\.\d+\.\d+/.test(localVersion)) {
    throw new Error('Install agent-device locally before using --agent.');
  }
  const agentVersion = agent ? localVersion : '0.20.1';

  gh('workflow', 'run', 'native-sim.yml', '--repo', repo, '--ref', branch,
    '-f', `session=${id}`, '-f', `gate_token=${key}`, '-f', `minutes=${minutes}`,
    '-f', 'mode=build', '-f', `agent_device=${agent}`, '-f', `agent_device_version=${agentVersion}`);

  const session = { id, key, repo, sha, runId: null };
  saveSession(session);
  console.log(`Dispatched native-sim for ${repo} (${id}).`);

  for (let attempt = 0; attempt < 20; attempt++) {
    const current = workflowRun(session);
    if (current) {
      session.runId = current.databaseId;
      saveSession(session);
      console.log(`Build: ${current.url}`);
      break;
    }
    await sleep(3000);
  }
  if (!session.runId) throw new Error('GitHub did not queue the workflow.');

  for (let attempt = 0; attempt < 135; attempt++) {
    const url = streamUrl(session);
    if (url) {
      console.log(`Simulator: ${url}`);
      if (agent) console.log(`Agent: agent-device connect proxy --daemon-base-url ${url.split('/?k=')[0]}/agent-device --daemon-auth-token ${key}`);
      console.log('Stop: bun run sim:ios down');
      return;
    }
    const current = JSON.parse(gh('run', 'view', String(session.runId), '--repo', repo,
      '--json', 'status,conclusion,url'));
    if (current.status === 'completed') {
      throw new Error(`Workflow ended (${current.conclusion}). Inspect ${current.url}`);
    }
    if (attempt % 3 === 0) console.log('Waiting for the simulator URL...');
    await sleep(20_000);
  }
  throw new Error('Timed out waiting for the simulator URL. Run bun run sim:ios status.');
}

function status() {
  const session = readSession();
  const runId = session.runId || workflowRun(session)?.databaseId;
  if (!runId) throw new Error('Workflow run has not appeared yet.');
  const current = JSON.parse(gh('run', 'view', String(runId), '--repo', session.repo,
    '--json', 'status,conclusion,url'));
  console.log(`${current.status}${current.conclusion ? ` (${current.conclusion})` : ''}: ${current.url}`);
  if (current.status !== 'completed') {
    const url = streamUrl(session);
    if (url) console.log(`Simulator: ${url}`);
  }
}

function down() {
  const session = readSession();
  const runId = session.runId || workflowRun(session)?.databaseId;
  if (!runId) throw new Error('Workflow run has not appeared yet.');
  gh('run', 'cancel', String(runId), '--repo', session.repo);
  console.log(`Cancelled run ${runId}.`);
}

try {
  const [command = 'up', ...args] = process.argv.slice(2);
  if (command === 'up') await up(args);
  else if (command === 'status') status();
  else if (command === 'down') down();
  else throw new Error('Usage: bun run sim:ios <up [--agent] [--minutes N] | status | down>');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
