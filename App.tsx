import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { AuthorizationProvider } from './src/providers/Authorization';
import { OnboardingProvider } from './src/providers/Onboarding';
import { ToastProvider } from './src/providers/Toast';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* Toast must sit above the data providers so their error catches can call
            useToast() to surface failures. */}
        <ToastProvider>
          <AuthorizationProvider>
            <OnboardingProvider>
              <StatusBar style="dark" />
              <RootNavigator />
            </OnboardingProvider>
          </AuthorizationProvider>
        </ToastProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
