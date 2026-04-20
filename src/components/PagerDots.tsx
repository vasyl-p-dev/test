import { FC, useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors } from '../theme';

const INACTIVE_SIZE = 6;
const ACTIVE_HEIGHT = 22;

export interface PagerDotsProps {
  count: number;
  index: number;
}

export const PagerDots: FC<PagerDotsProps> = ({ count, index }) => {
  const dots = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);
  return (
    <View style={styles.row}>
      {dots.map((i) => (
        <Dot key={i} active={i === index} />
      ))}
    </View>
  );
};

interface DotProps {
  active: boolean;
}

const Dot: FC<DotProps> = ({ active }) => {
  const progress = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: active ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [active, progress]);

  const height = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [INACTIVE_SIZE, ACTIVE_HEIGHT],
  });
  const bg = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.grey.extraLight, colors.tertiary.color],
  });

  return <Animated.View style={[styles.dot, { height, backgroundColor: bg }]} />;
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: ACTIVE_HEIGHT,
  },
  dot: { width: INACTIVE_SIZE, borderRadius: 56 },
});
