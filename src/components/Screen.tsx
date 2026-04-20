import { FC, ReactNode } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

type Edge = 'top' | 'bottom' | 'left' | 'right';

export interface ScreenProps {
  children: ReactNode;
  edges?: readonly Edge[];
  style?: ViewStyle;
}

export const Screen: FC<ScreenProps> = ({ children, edges = ['top', 'bottom'], style }) => {
  return (
    <SafeAreaView edges={edges} style={[styles.base, style]}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  base: { flex: 1, backgroundColor: colors.white.light },
});
