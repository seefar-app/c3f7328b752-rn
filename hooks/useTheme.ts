import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export function useTheme() {
  const colorScheme = useColorScheme();
  return Colors[colorScheme];
}