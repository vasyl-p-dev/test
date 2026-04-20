import { FC, ReactNode } from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';
import { colors, typography } from '../theme';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'captionRegular'
  | 'captionBig'
  | 'input'
  | 'inputCaption'
  | 'button';

export type TypographyColor =
  | 'white.color'
  | 'white.light'
  | 'grey.extraLight'
  | 'grey.light'
  | 'grey.dark'
  | 'grey.extraDark'
  | 'tertiary.color'
  | 'tertiary.light'
  | 'success.color'
  | 'error.color'
  | 'error.light';

export interface TypographyProps extends Omit<TextProps, 'style'> {
  variant: TypographyVariant;
  color?: TypographyColor;
  children?: ReactNode;
  style?: StyleProp<TextStyle>;
}

export const Typography: FC<TypographyProps> = ({
  variant,
  color = 'grey.extraDark',
  children,
  style,
  ...rest
}) => {
  return (
    <Text style={[getVariantStyles(variant), getColorStyles(color), style]} {...rest}>
      {children}
    </Text>
  );
};

function getVariantStyles(variant: TypographyVariant): TextStyle {
  switch (variant) {
    case 'h1':
      return typography.h1;
    case 'h2':
      return typography.h2;
    case 'h3':
      return typography.h3;
    case 'body':
      return typography.body;
    case 'bodySmall':
      return typography.bodySmall;
    case 'caption':
      return typography.caption;
    case 'captionRegular':
      return typography.captionRegular;
    case 'captionBig':
      return typography.captionBig;
    case 'input':
      return typography.input;
    case 'inputCaption':
      return typography.inputCaption;
    case 'button':
      return typography.button;
  }
}

function getColorStyles(color: TypographyColor): TextStyle {
  switch (color) {
    case 'white.color':
      return { color: colors.white.color };
    case 'white.light':
      return { color: colors.white.light };
    case 'grey.extraLight':
      return { color: colors.grey.extraLight };
    case 'grey.light':
      return { color: colors.grey.light };
    case 'grey.dark':
      return { color: colors.grey.dark };
    case 'grey.extraDark':
      return { color: colors.grey.extraDark };
    case 'tertiary.color':
      return { color: colors.tertiary.color };
    case 'tertiary.light':
      return { color: colors.tertiary.light };
    case 'success.color':
      return { color: colors.success.color };
    case 'error.color':
      return { color: colors.error.color };
    case 'error.light':
      return { color: colors.error.light };
  }
}
