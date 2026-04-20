import { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radii } from '../theme';
import { Typography } from './Typography';

export interface CheckboxProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  accessibilityLabel?: string;
}

export const Checkbox: FC<CheckboxProps> = ({ checked, onChange, accessibilityLabel }) => {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      hitSlop={10}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel}
      style={styles.wrap}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? (
          <Typography variant="caption" color="white.color">
            ✓
          </Typography>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrap: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  box: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.tertiary.light,
    backgroundColor: colors.white.color,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: colors.tertiary.color,
    borderColor: colors.tertiary.color,
    borderRadius: radii.input / 3,
  },
});
