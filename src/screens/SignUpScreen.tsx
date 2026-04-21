import { zodResolver } from '@hookform/resolvers/zod';
import { useHeaderHeight } from '@react-navigation/elements';
import type { StaticScreenProps } from '@react-navigation/native';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ErrorBanner } from '../components/ErrorBanner';
import { Screen } from '../components/Screen';
import { SignUpForm } from '../components/SignUpForm';
import { SignUpFooter } from '../components/SignUpFooter';
import { SignUpHeading } from '../components/SignUpHeading';
import { SignUpTermsCheckbox } from '../components/SignUpTermsCheckbox';
import { useAuthorization } from '../providers/Authorization';
import { spacing } from '../theme';
import { signupSchema, type SignupFormValues } from '../utils/validation';

export interface SignUpScreenProps extends StaticScreenProps<undefined> {}

export const SignUpScreen: FC<SignUpScreenProps> = () => {
  const { state, signUp } = useAuthorization();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const topPadding = (headerHeight || insets.top) + spacing.xxl;
  const { control, handleSubmit, formState } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: { name: '', email: '', password: '', acceptTos: false },
  });

  const submit = handleSubmit((values) =>
    signUp({ name: values.name, email: values.email, password: values.password }),
  );

  const submitting = state.status === 'submitting';
  const disableSubmit = submitting || !formState.isValid;

  return (
    <Screen edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: topPadding }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <SignUpHeading />

          {state.error && <ErrorBanner message={state.error} onRetry={submit} />}

          <SignUpForm control={control} />

          <SignUpTermsCheckbox control={control} />
        </ScrollView>

        <SignUpFooter
          onSubmit={submit}
          submitting={submitting}
          disableSubmit={disableSubmit}
        />
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.xxl,
  },
});
