import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface CountdownTimerProps {
  endDate: Date;
  compact?: boolean;
}

export function CountdownTimer({ endDate, compact = false }: CountdownTimerProps) {
  const theme = useTheme();
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const diff = endDate.getTime() - Date.now();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  }

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (compact) {
    return (
      <Text style={{ fontSize: 13, fontWeight: '700', color: '#ef4444' }}>
        {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </Text>
    );
  }

  const TimeBox = ({ value, label }: { value: string; label: string }) => (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          backgroundColor: '#1f2937',
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 6,
          minWidth: 42,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>{value}</Text>
      </View>
      <Text style={{ fontSize: 10, color: theme.textTertiary, marginTop: 3 }}>{label}</Text>
    </View>
  );

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
      <TimeBox value={pad(timeLeft.hours)} label="h" />
      <Text style={{ fontSize: 18, fontWeight: '800', color: theme.text, marginTop: 6 }}>:</Text>
      <TimeBox value={pad(timeLeft.minutes)} label="m" />
      <Text style={{ fontSize: 18, fontWeight: '800', color: theme.text, marginTop: 6 }}>:</Text>
      <TimeBox value={pad(timeLeft.seconds)} label="s" />
    </View>
  );
}