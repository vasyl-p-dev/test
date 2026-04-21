import { createStaticNavigation, StaticParamList } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FC } from 'react';
import { BackButton } from '../components/BackButton';
import { Typography } from '../components/Typography';
import { useOnboarding } from '../providers/Onboarding';
import { LoadingScreen } from '../screens/LoadingScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { MyAccountScreen } from '../screens/MyAccountScreen';
import { useAuthorization } from '../providers/Authorization';
import { colors } from '../theme';

type Stage = 'loading' | 'onboarding' | 'signUp' | 'app';

function useStage(): Stage {
  const { ready: onboardingReady, isFirstLaunch } = useOnboarding();
  const { state: auth } = useAuthorization();
  if (!onboardingReady || !auth.ready) return 'loading';
  if (auth.response) return 'app';
  if (isFirstLaunch) return 'onboarding';
  return 'signUp';
}

const useShowLoading = (): boolean => useStage() === 'loading';
const useShowOnboarding = (): boolean => useStage() === 'onboarding';
const useShowSignUp = (): boolean => useStage() === 'signUp';
const useShowApp = (): boolean => useStage() === 'app';

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
        OnboardingSignUp: {
          screen: SignUpScreen,
          options: ({ navigation }) => ({
            headerShown: true,
            headerTransparent: true,
            headerShadowVisible: false,
            headerStyle: { backgroundColor: 'transparent' },
            headerTitle: '',
            headerBackVisible: false,
            headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
          }),
        },
      },
    },
    SignUp: {
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
