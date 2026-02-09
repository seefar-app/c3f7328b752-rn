import React from 'react';
import { View, Text } from 'react-native';
import { StatusColors } from '@/constants/Colors';

interface BadgeProps {
  status: string;
  label?: string;
  size?: 'sm' | 'md';
}

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  processing: 'En préparation',
  shipped: 'Expédié',
  out_for_delivery: 'En livraison',
  delivered: 'Livré',
  cancelled: 'Annulé',
  returned: 'Retourné',
};

export function Badge({ status, label, size = 'md' }: BadgeProps) {
  const colors = StatusColors[status] || StatusColors.pending;
  const displayLabel = label || statusLabels[status] || status;

  const isSmall = size === 'sm';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.bg,
        borderRadius: 20,
        paddingHorizontal: isSmall ? 8 : 12,
        paddingVertical: isSmall ? 3 : 5,
        alignSelf: 'flex-start',
        gap: 5,
      }}
    >
      <View
        style={{
          width: isSmall ? 5 : 6,
          height: isSmall ? 5 : 6,
          borderRadius: 3,
          backgroundColor: colors.dot,
        }}
      />
      <Text
        style={{
          fontSize: isSmall ? 10 : 12,
          fontWeight: '600',
          color: colors.text,
        }}
      >
        {displayLabel}
      </Text>
    </View>
  );
}