import { FC } from 'react';
import { Image, StyleSheet } from 'react-native';

const ILLUSTRATION = require('../../assets/onboarding-illustration.png');

const WIDTH = 340;
const HEIGHT = 356;

export interface OnboardingIllustrationProps { }

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
