// Switching logic shared by every tab list that drives VariantPanels: the VariantTabs pills and the
// roadmap PhaseTimeline. A tab list is `[data-variant-tabs={group}]`, its tabs are `[role="tab"]`
// with a `data-value`, and the panels of the same group follow the selected tab.

function select(group: string, value: string) {
  for (const panel of document.querySelectorAll<HTMLElement>(`[data-variant-panel="${group}"]`)) {
    if (panel.dataset.value === value) panel.dataset.active = '';
    else delete panel.dataset.active;
  }
  for (const trigger of document.querySelectorAll<HTMLElement>(`[data-variant-tabs="${group}"] [role="tab"]`)) {
    const active = trigger.dataset.value === value;
    trigger.setAttribute('aria-selected', String(active));
    if (active) trigger.dataset.selected = '';
    else delete trigger.dataset.selected;
  }
}

// A link to a heading of another panel (the table of contents lists them all) switches to it.
function revealHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  const panel = id ? document.getElementById(id)?.closest<HTMLElement>('[data-variant-panel]') : null;
  if (!panel || panel.dataset.active !== undefined) return;
  select(panel.dataset.variantPanel!, panel.dataset.value!);
  document.getElementById(id)?.scrollIntoView();
}

document.addEventListener('click', (event) => {
  const trigger = (event.target as Element).closest<HTMLElement>('[data-variant-tabs] [role="tab"]');
  const group = trigger?.closest<HTMLElement>('[data-variant-tabs]')?.dataset.variantTabs;
  if (group && trigger?.dataset.value) select(group, trigger.dataset.value);
});

// Arrow keys move between the tabs of a list, Home / End jump to its ends.
document.addEventListener('keydown', (event) => {
  const trigger = (event.target as Element).closest<HTMLElement>('[data-variant-tabs] [role="tab"]');
  const list = trigger?.closest<HTMLElement>('[data-variant-tabs]');
  if (!trigger || !list) return;
  const tabs = [...list.querySelectorAll<HTMLElement>('[role="tab"]')];
  const index = tabs.indexOf(trigger);
  const target =
    event.key === 'ArrowRight' ? tabs[(index + 1) % tabs.length]
    : event.key === 'ArrowLeft' ? tabs[(index - 1 + tabs.length) % tabs.length]
    : event.key === 'Home' ? tabs[0]
    : event.key === 'End' ? tabs[tabs.length - 1]
    : undefined;
  if (!target?.dataset.value) return;
  event.preventDefault();
  select(list.dataset.variantTabs!, target.dataset.value);
  target.focus();
});

window.addEventListener('hashchange', revealHash);
revealHash();
document.addEventListener('astro:page-load', revealHash);
