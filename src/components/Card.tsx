import { FC } from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { colors, radii, spacing } from '../theme';

type CardVariant = 'hero' | 'surface';

export interface CardProps extends ViewProps {
  variant?: CardVariant;
}

export const Card: FC<CardProps> = ({ children, variant = 'surface', style, ...rest }) => {
  return (
    <View {...rest} style={[getStyles(variant), style]}>
      {children}
    </View>
  );
};

function getStyles(variant: CardVariant): ViewStyle {
  switch (variant) {
    case 'hero':
      return {
        backgroundColor: colors.white.color,
        borderRadius: radii.hero,
        paddingHorizontal: spacing.xl,
        paddingVertical: 36,
        alignItems: 'center',
        ...shadow,
      };
    case 'surface':
      return {
        backgroundColor: colors.white.color,
        borderRadius: radii.card,
        padding: spacing.base,
      };
  }
}

const shadow: ViewStyle = {
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 24,
  shadowOffset: { width: 0, height: 16 },
  elevation: 6,
};
