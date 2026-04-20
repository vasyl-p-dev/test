// Navigation param list is derived from the static navigator config in
// RootNavigator.tsx via `StaticParamList<typeof RootStack>`. This file re-exports
// the inferred type so screens can import it from one place.
export type { RootStackParamList } from './RootNavigator';
