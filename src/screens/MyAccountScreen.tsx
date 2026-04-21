import { useHeaderHeight } from '@react-navigation/elements';
import type { StaticScreenProps } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { FC, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AccountInfo } from '../components/AccountInfo';
import { AccountTransactions } from '../components/AccountTransactions';
import { Button } from '../components/Button';
import { ErrorBanner } from '../components/ErrorBanner';
import { HeaderBackdrop } from '../components/HeaderBackdrop';
import { ProfileHeader } from '../components/ProfileHeader';
import { Screen } from '../components/Screen';
import { Spinner } from '../components/Spinner';
import { Typography } from '../components/Typography';
import { useGetAccount } from '../hooks/useGetAccount';
import { useAuthorization } from '../providers/Authorization';
import { spacing } from '../theme';

export interface MyAccountScreenProps extends StaticScreenProps<undefined> { }

export const MyAccountScreen: FC<MyAccountScreenProps> = () => {
  const navigation = useNavigation();
  const { logout } = useAuthorization();
  const { data, loading, error, fetch } = useGetAccount();

  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetch();
  }, [fetch]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackground: () => <HeaderBackdrop scrollY={scrollY} />,
    });
  }, [navigation, scrollY]);

  const onLogout = useCallback(() => {
    logout();
  }, [logout]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Spinner />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Typography variant="bodySmall" color="grey.dark">
          No account data available
        </Typography>
      </View>
    );
  }

  return (
    <Screen edges={[]}>
      <Animated.ScrollView
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: headerHeight + spacing.base,
            paddingBottom: insets.bottom + spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      >
        {!data && error && <ErrorBanner message={error} onRetry={fetch} />}

        <ProfileHeader />
        <AccountInfo data={data} />
        <AccountTransactions
          transactions={data.transactions}
          currency={data.currency}
        />
        <View style={styles.logout}>
          <Button label="Log out" onPress={onLogout} />
        </View>
      </Animated.ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    gap: spacing.xl,
  },
  center: { paddingVertical: spacing.xxxl, alignItems: 'center' },
  logout: { marginTop: 'auto' },
});
