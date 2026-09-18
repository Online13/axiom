import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { InputOTP } from '@/components/ui/input-otp';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { Title } from '@/components/ui/title';
import { useTheme } from '@/theme';

import { ExperienceScreen } from './shared';

const CODE = '482019';
const MAX_ATTEMPTS = 3;
const RESEND_DELAY = 15;

type Status = 'typing' | 'checking' | 'wrong' | 'locked' | 'done';

export default function OtpVerificationScreen() {
  const { tokens } = useTheme();
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<Status>('typing');
  const [attempts, setAttempts] = useState(0);
  const [countdown, setCountdown] = useState(RESEND_DELAY);

  // One ticking timer for the resend cooldown, whatever happens to the code.
  useEffect(() => {
    if (countdown === 0) return;
    const timer = setTimeout(() => setCountdown((left) => left - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const check = async (code: string) => {
    setStatus('checking');
    await new Promise((resolve) => setTimeout(resolve, 700));

    if (code === CODE) {
      setStatus('done');
      return;
    }

    const used = attempts + 1;
    setAttempts(used);
    setValue('');
    setStatus(used >= MAX_ATTEMPTS ? 'locked' : 'wrong');
  };

  const resend = () => {
    setCountdown(RESEND_DELAY);
    setAttempts(0);
    setValue('');
    setStatus('typing');
  };

  const locked = status === 'locked';

  return (
    <ExperienceScreen>
      <View style={{ padding: tokens.metrics.screenMargin, gap: tokens.spacing[6] }}>
        <View style={{ gap: tokens.spacing[2] }}>
          <Title variant="heading">Check your messages</Title>
          <Text color="muted">
            We sent a six-digit code to +33 6 12 34 56 78. The code for this demo is {CODE}.
          </Text>
        </View>

        <View style={{ alignItems: 'center', gap: tokens.spacing[3] }}>
          <InputOTP
            length={6}
            groups={[3, 3]}
            value={value}
            onChange={setValue}
            // The last digit submits: no button to reach for.
            onComplete={check}
            error={status === 'wrong' || locked}
            disabled={locked || status === 'checking'}
            autoFocus
          />
          {status === 'checking' ? <Spinner size="sm" label="Checking the code" /> : null}
          {status === 'wrong' ? (
            <Text variant="bodySm" color="error">
              Wrong code. {MAX_ATTEMPTS - attempts} attempt{MAX_ATTEMPTS - attempts > 1 ? 's' : ''} left.
            </Text>
          ) : null}
          {locked ? (
            <Text variant="bodySm" color="error" align="center">
              Too many attempts. Ask for a new code to try again.
            </Text>
          ) : null}
          {status === 'done' ? (
            <Text variant="bodySm" color="success">
              Code accepted.
            </Text>
          ) : null}
        </View>

        <View style={{ gap: tokens.spacing[2], alignItems: 'center' }}>
          <Button variant="ghost" disabled={countdown > 0} onPress={resend}>
            {countdown > 0 ? `Resend in ${countdown}s` : 'Send a new code'}
          </Button>
          <Text variant="footnote" color="muted" align="center">
            The cooldown keeps a frustrated user from hammering the server. Fifteen seconds here, thirty to sixty in
            a real app.
          </Text>
        </View>
      </View>
    </ExperienceScreen>
  );
}
