import { FC } from 'react';
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';
import { colors } from '../theme';

export interface SpinnerProps extends Omit<ActivityIndicatorProps, 'color'> {}

export const Spinner: FC<SpinnerProps> = (props) => (
  <ActivityIndicator color={colors.tertiary.color} {...props} />
);
