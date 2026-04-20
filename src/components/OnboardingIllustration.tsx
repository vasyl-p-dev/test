import { FC } from 'react';
import { Image, StyleSheet } from 'react-native';

// Single composite PNG exported from the "Illustrations" Figma frame (1:234).
// RN picks @2x / @3x variants automatically based on PixelRatio.
const ILLUSTRATION = require('../../assets/onboarding-illustration.png');

const WIDTH = 340;
const HEIGHT = 356;

export interface OnboardingIllustrationProps {}

export const OnboardingIllustration: FC<OnboardingIllustrationProps> = () => {
  return <Image source={ILLUSTRATION} style={styles.image} resizeMode="contain" />;
};

const styles = StyleSheet.create({
  image: {
    width: WIDTH,
    height: HEIGHT,
    alignSelf: 'center',
  },
});
