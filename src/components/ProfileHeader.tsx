import { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { spacing } from '../theme';
import { Typography } from './Typography';

const KUDA_LOGO = require('../../assets/kuda-bank-logo.png');

export const ProfileHeader: FC = () => (
  <View style={styles.wrap}>
    <Image source={KUDA_LOGO} style={styles.logo} resizeMode="contain" />
    <Typography variant="captionBig">Kuda Bank</Typography>
  </View>
);

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: spacing.base },
  logo: { width: 48, height: 48 },
});
