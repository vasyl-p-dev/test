import { createStaticNavigation, StaticParamList } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FC } from 'react';
import { Typography } from '../components/Typography';
import { useOnboarding } from '../providers/Onboarding';
import { LoadingScreen } from '../screens/LoadingScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { MyAccountScreen } from '../screens/MyAccountScreen';
import { useAuthorization } from '../providers/Authorization';
import { colors } from '../theme';

// ── Group-visibility hooks ──────────────────────────────────────────────────
// Each `if` hook gates one group. React Navigation re-evaluates on every
// context update, so flipping `isOnboardingFinished` or `auth.response` causes the
// active group to swap automatically — no imperative navigation needed.

function useShowLoading(): boolean {
  const { ready: onboardingReady } = useOnboarding();
  const { state: auth } = useAuthorization();
  return !onboardingReady || !auth.ready;
}

function useShowOnboarding(): boolean {
  const { ready: onboardingReady, isOnboardingFinished } = useOnboarding();
  const { state: auth } = useAuthorization();
  return onboardingReady && auth.ready && !isOnboardingFinished && !auth.response;
}

function useShowSignUp(): boolean {
  const { ready: onboardingReady, isOnboardingFinished } = useOnboarding();
  const { state: auth } = useAuthorization();
  return onboardingReady && auth.ready && isOnboardingFinished && !auth.response;
}

function useShowApp(): boolean {
  const { ready: onboardingReady } = useOnboarding();
  const { state: auth } = useAuthorization();
  return onboardingReady && auth.ready && Boolean(auth.response);
}

const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
    contentStyle: { backgroundColor: colors.white.light },
  },
  groups: {
    Loading: {
      if: useShowLoading,
      screens: {
        Loading: LoadingScreen,
      },
    },
    Onboarding: {
      if: useShowOnboarding,
      screens: {
        Onboarding: OnboardingScreen,
      },
    },
    Auth: {
      if: useShowSignUp,
      screens: {
        SignUp: SignUpScreen,
      },
    },
    App: {
      if: useShowApp,
      screens: {
        MyAccount: {
          screen: MyAccountScreen,
          options: {
            headerShown: true,
            headerTransparent: true,
            headerShadowVisible: false,
            headerStyle: { backgroundColor: 'transparent' },
            headerBackVisible: false,
            headerBackButtonDisplayMode: 'minimal',
            headerBackButtonMenuEnabled: false,
            headerTitleAlign: 'center',
            headerTitle: () => <Typography variant="h3">My Account</Typography>,
            gestureEnabled: false,
          },
        },
      },
    },
  },
});

export type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}

const Navigation = createStaticNavigation(RootStack);

export const RootNavigator: FC = () => <Navigation />;
