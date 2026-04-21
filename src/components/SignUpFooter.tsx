import { FC } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { spacing } from '../theme';
import { Button } from './Button';
import { Typography } from './Typography';

const SIGN_IN_URL = 'https://example.com';

interface SignUpFooterProps {
  onSubmit: () => void;
  submitting: boolean;
  disableSubmit: boolean;
}

export const SignUpFooter: FC<SignUpFooterProps> = ({ onSubmit, submitting, disableSubmit }) => (
  <View style={styles.wrap}>
    <Pressable onPress={() => Linking.openURL(SIGN_IN_URL)} hitSlop={10}>
      <Typography variant="bodySmall" style={styles.signIn}>
        Already have an account?{' '}
        <Typography variant="bodySmall" color="tertiary.color">
          Sign in
        </Typography>
      </Typography>
    </Pressable>
    <Button
      label="Create account"
      onPress={onSubmit}
      loading={submitting}
      disabled={disableSubmit}
    />
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.sm,
  },
  signIn: {
    textAlign: 'center',
    paddingVertical: spacing.base,
  },
});
