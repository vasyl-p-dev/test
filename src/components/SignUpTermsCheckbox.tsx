import { FC } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Linking, StyleSheet, View } from 'react-native';
import { spacing } from '../theme';
import type { SignupFormValues } from '../utils/validation';
import { Checkbox } from './Checkbox';
import { Typography } from './Typography';

const TERMS_URL = 'https://example.com';

interface SignUpTermsCheckboxProps {
  control: Control<SignupFormValues>;
}

export const SignUpTermsCheckbox: FC<SignUpTermsCheckboxProps> = ({ control }) => (
  <Controller
    control={control}
    name="acceptTos"
    render={({ field: { value, onChange }, fieldState }) => (
      <View style={styles.wrap}>
        <View style={styles.row}>
          <Checkbox
            checked={!!value}
            onChange={onChange}
            accessibilityLabel="Accept terms of service"
          />
          <Typography variant="bodySmall" style={styles.text}>
            By signing up, you agree to the{' '}
            <Typography
              variant="bodySmall"
              color="tertiary.color"
              onPress={() => Linking.openURL(TERMS_URL)}
              suppressHighlighting
            >
              Terms of Service and Privacy Policy
            </Typography>
          </Typography>
        </View>
        {fieldState.error && (
          <Typography variant="bodySmall" color="error.color" style={styles.error}>
            {fieldState.error.message}
          </Typography>
        )}
      </View>
    )}
  />
);

const styles = StyleSheet.create({
  wrap: { marginTop: -spacing.base },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  text: { flex: 1 },
  error: { marginTop: spacing.xs, marginLeft: spacing.xxl },
});
