import { zodResolver } from '@hookform/resolvers/zod';
import type { StaticScreenProps } from '@react-navigation/native';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Button } from '../components/Button';
import { Checkbox } from '../components/Checkbox';
import { ErrorBanner } from '../components/ErrorBanner';
import { Screen } from '../components/Screen';
import { TextField } from '../components/TextField';
import { Typography } from '../components/Typography';
import { useAuthorization } from '../providers/Authorization';
import { useToast } from '../providers/Toast';
import { signupSchema, type SignupFormValues } from '../utils/validation';

export interface SignUpScreenProps extends StaticScreenProps<undefined> {}

const STUB_URL = 'https://example.com';

export const SignUpScreen: FC<SignUpScreenProps> = () => {
  const { state, signUp } = useAuthorization();
  const toast = useToast();
  const { control, handleSubmit, formState } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: { name: '', email: '', password: '', acceptTos: false },
  });

  const submit = handleSubmit(async (values) => {
    try {
      const response = await signUp({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      toast.success(response.message);
      // No imperative navigation — a successful signUp updates useAuthorization,
      // RootNavigator's `useShowMain` hook flips to true, and the Main group
      // becomes active with MyAccount.
    } catch {
      // error surfaced via useAuthorization state
    }
  });

  const submitting = state.status === 'submitting';
  const disableSubmit = submitting || !formState.isValid;

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        {/* No back button — SignUp is the sole screen in its navigation group,
            so there's nothing to go back to. */}
        <View style={styles.header} />

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heading}>
            <Typography variant="h1" color="tertiary.color">
              Create account
            </Typography>
            <Typography variant="body" color="grey.dark">
              Complete the sign up to get started
            </Typography>
          </View>

          {state.error ? <ErrorBanner message={state.error} onRetry={submit} /> : null}

          <View style={styles.fields}>
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

          <Controller
            control={control}
            name="acceptTos"
            render={({ field: { value, onChange }, fieldState }) => (
              <View style={styles.tosWrap}>
                <View style={styles.tosRow}>
                  <Checkbox
                    checked={!!value}
                    onChange={onChange}
                    accessibilityLabel="Accept terms of service"
                  />
                  <Typography variant="bodySmall" style={styles.tosText}>
                    By signing up, you agree to the{' '}
                    <Typography
                      variant="bodySmall"
                      color="tertiary.color"
                      onPress={() => Linking.openURL(STUB_URL)}
                      suppressHighlighting
                    >
                      Terms of Service and Privacy Policy
                    </Typography>
                  </Typography>
                </View>
                {fieldState.error ? (
                  <Typography variant="bodySmall" color="error.color" style={styles.tosError}>
                    {fieldState.error.message}
                  </Typography>
                ) : null}
              </View>
            )}
          />
        </ScrollView>

        <View style={styles.bottom}>
          <Pressable onPress={() => Linking.openURL(STUB_URL)} hitSlop={10}>
            <Typography variant="bodySmall" style={styles.signIn}>
              Already have an account?{' '}
              <Typography variant="bodySmall" color="tertiary.color">
                Sign in
              </Typography>
            </Typography>
          </Pressable>
          <Button
            label="Create account"
            onPress={submit}
            loading={submitting}
            disabled={disableSubmit}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 24,
    gap: 32,
  },
  heading: { gap: 8 },
  fields: { gap: 16 },
  tosWrap: { marginTop: -16 },
  tosRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  tosText: { flex: 1 },
  tosError: { marginTop: 4, marginLeft: 32 },
  bottom: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  signIn: {
    textAlign: 'center',
    paddingVertical: 16,
  },
});
