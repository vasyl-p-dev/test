import { BlurView } from 'expo-blur';
import { FC } from 'react';
import { Animated, StyleSheet } from 'react-native';

export interface HeaderBackdropProps {
  scrollY: Animated.Value;
}

export const HeaderBackdrop: FC<HeaderBackdropProps> = ({ scrollY }) => {
  const opacity = scrollY.interpolate({
    inputRange: [0, 24],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity }]} pointerEvents="none">
      <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
    </Animated.View>
  );
};
