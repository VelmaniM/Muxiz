/**
 * Theme Hook
 */

import { Colors } from '../constants/colors';
import { useColorScheme } from 'react-native';

export function useTheme() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return {
    isDark,
    colors: Colors,
  };
}
