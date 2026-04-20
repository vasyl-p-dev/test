import { useHeaderHeight } from '@react-navigation/elements';
import type { StaticScreenProps } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { FC, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { AccountResponse } from '../api/account';
import { getMyAccount } from '../api/account';
import { BlockRenderer } from '../components/BlockRenderer';
import { ErrorBanner } from '../components/ErrorBanner';
import { Screen } from '../components/Screen';
import { Spinner } from '../components/Spinner';
import { ApiError } from '../services/httpClient';
import { useAuthorization } from '../providers/Authorization';
import { useToast } from '../providers/Toast';
import { toBlocks } from '../utils/accountBlocks';

export interface MyAccountScreenProps extends StaticScreenProps<undefined> {}

export const MyAccountScreen: FC<MyAccountScreenProps> = () => {
  const navigation = useNavigation();
  const { state, logout } = useAuthorization();
  const toast = useToast();
  const response = state.response;

  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const [data, setData] = useState<AccountResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scrollY = useRef(new Animated.Value(0)).current;

  const load = useCallback(async () => {
    if (!response) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getMyAccount(response);
      setData(res);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        // Invalid stored token → wipe the authorization data. The RootNavigator's
        // `if` hooks pick up the update and swap back to the Auth group.
        toast.error('Your session expired — please sign in again');
        await logout();
        return;
      }
      const message = err instanceof ApiError ? err.message : 'Could not load account.';
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [response, logout, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const onLogout = useCallback(() => {
    logout();
  }, [logout]);

  // Inject the animated blur backdrop into React Navigation's header. No back
  // button on My Account — the only way to leave the screen is the in-content
  // "Log out" button rendered by BlockRenderer.
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackground: () => <HeaderBackdrop scrollY={scrollY} />,
    });
  }, [navigation, scrollY]);

  // Guard: the RootNavigator only shows this group when state.response is set,
  // but we bail out defensively to keep TS + runtime safe.
  if (!response) return null;

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
        {error ? <ErrorBanner message={error} onRetry={load} /> : null}

        {loading && !data ? (
          <View style={styles.center}>
            <Spinner />
          </View>
        ) : data ? (
          <BlockRenderer blocks={toBlocks(data)} onLogout={onLogout} />
        ) : null}
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
