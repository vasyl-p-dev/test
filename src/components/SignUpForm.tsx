import { FC } from 'react';
import { Control, Controller } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../theme';
import type { SignupFormValues } from '../utils/validation';
import { TextField } from './TextField';

interface SignUpFormProps {
  control: Control<SignupFormValues>;
}

export const SignUpForm: FC<SignUpFormProps> = ({ control }) => (
  <View style={styles.wrap}>
    <Controller
      control={control}
      name="name"
      render={({ field: { value, onChange, onBlur }, fieldState }) => (
        <TextField
          label="Name"
          value={value ?? ''}
          onChangeText={onChange}
          onBlur={onBlur}
          error={fieldState.isTouched ? fieldState.error?.message : undefined}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
        />
      )}
    />
    <Controller
      control={control}
      name="email"
      render={({ field: { value, onChange, onBlur }, fieldState }) => (
        <TextField
          label="Email"
          value={value ?? ''}
          onChangeText={onChange}
          onBlur={onBlur}
          error={fieldState.isTouched ? fieldState.error?.message : undefined}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          returnKeyType="next"
        />
      )}
    />
    <Controller
      control={control}
      name="password"
      render={({ field: { value, onChange, onBlur }, fieldState }) => (
        <TextField
          label="Password"
          value={value ?? ''}
          onChangeText={onChange}
          onBlur={onBlur}
          error={fieldState.isTouched ? fieldState.error?.message : undefined}
          secure
          autoCapitalize="none"
          autoComplete="password-new"
          textContentType="newPassword"
          returnKeyType="done"
        />
      )}
    />
  </View>
);

const styles = StyleSheet.create({
  wrap: { gap: spacing.base },
});
