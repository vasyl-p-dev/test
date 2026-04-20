import type { StaticScreenProps } from '@react-navigation/native';
import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Spinner } from '../components/Spinner';

export interface LoadingScreenProps extends StaticScreenProps<undefined> {}

export const LoadingScreen: FC<LoadingScreenProps> = () => {
  return (
    <Screen>
      <View style={styles.center}>
        <Spinner />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
