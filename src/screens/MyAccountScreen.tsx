import { useHeaderHeight } from '@react-navigation/elements';
import type { StaticScreenProps } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { FC, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlockRenderer } from '../components/BlockRenderer';
import { ErrorBanner } from '../components/ErrorBanner';
import { Screen } from '../components/Screen';
import { Spinner } from '../components/Spinner';
import { useGetAccount } from '../hooks/useGetAccount';
import { useAuthorization } from '../providers/Authorization';
import { toBlocks } from '../utils/accountBlocks';

export interface MyAccountScreenProps extends StaticScreenProps<undefined> { }

export const MyAccountScreen: FC<MyAccountScreenProps> = () => {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const navigation = useNavigation();
  const { logout } = useAuthorization();
  const { data, loading, error, fetch } = useGetAccount();

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetch();
  }, [fetch]);

  const onLogout = useCallback(() => {
    logout();
  }, [logout]);

  // Inject the animated blur backdrop into React Navigation's header.
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackground: () => <HeaderBackdrop scrollY={scrollY} />,
    });
  }, [navigation, scrollY]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Spinner />
      </View>
    )
  }

  if (!data) return null;

  return (
    <Screen edges={[]}>
      <Animated.ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: headerHeight + 16, paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
      >
        {error && <ErrorBanner message={error} onRetry={fetch} />}
        <BlockRenderer blocks={toBlocks(data)} onLogout={onLogout} />
      </Animated.ScrollView>
    </Screen>
  );
};

interface HeaderBackdropProps {
  scrollY: Animated.Value;
}

const HeaderBackdrop: FC<HeaderBackdropProps> = ({ scrollY }) => {
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

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, gap: 32 },
  center: { paddingVertical: 40, alignItems: 'center' },
});
