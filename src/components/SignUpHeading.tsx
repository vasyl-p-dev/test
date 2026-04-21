import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../theme';
import { Typography } from './Typography';

export const SignUpHeading: FC = () => (
  <View style={styles.wrap}>
    <Typography variant="h1" color="tertiary.color">
      Create account
    </Typography>
    <Typography variant="body" color="grey.dark">
      Complete the sign up to get started
    </Typography>
  </View>
);

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
});
