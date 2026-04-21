import { FC, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { colors, radii, spacing, typography } from '../theme';
import { Typography } from './Typography';

const EYE_ICON = require('../../assets/eye.png');

export interface TextFieldProps extends Omit<TextInputProps, 'onChange' | 'onBlur'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secure?: boolean;
  onBlur?: () => void;
}

export const TextField: FC<TextFieldProps> = ({
  label,
  value,
  onChangeText,
  error,
  secure,
  onBlur,
  onFocus,
  ...rest
}) => {
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const [reveal, setReveal] = useState(false);
  const obscure = secure && !reveal;

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={() => inputRef.current?.focus()}
        style={[styles.box, focused && styles.boxFocused, !!error && styles.boxError]}
      >
        <Typography variant="inputCaption" color="grey.light" style={styles.label}>
          {label}
        </Typography>
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={obscure}
          placeholderTextColor={colors.grey.light}
          style={styles.input}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          {...rest}
        />
        {secure && (
          <Pressable
            onPress={() => setReveal((r) => !r)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={reveal ? 'Hide password' : 'Show password'}
            style={({ pressed }) => [styles.eye, pressed && styles.eyePressed]}
          >
            <Image
              source={EYE_ICON}
              style={[styles.eyeIcon, { opacity: reveal ? 0.4 : 1 }]}
              resizeMode="contain"
            />
          </Pressable>
        )}
      </Pressable>
      {error && (
        <Typography variant="bodySmall" color="error.color" style={styles.error}>
          {error}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch' },
  box: {
    height: 61,
    backgroundColor: colors.white.color,
    borderRadius: radii.input,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 10,
    justifyContent: 'flex-start',
  },
  boxFocused: { borderWidth: 1, borderColor: colors.tertiary.color },
  boxError: { borderWidth: 1, borderColor: colors.error.color },
  label: { marginBottom: spacing.xs },
  input: {
    ...typography.input,
    color: colors.grey.extraDark,
    padding: 0,
    margin: 0,
  },
  eye: {
    position: 'absolute',
    right: spacing.base,
    top: 18,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyePressed: { opacity: 0.6 },
  eyeIcon: { width: 24, height: 24 },
  error: { marginTop: 6, marginLeft: spacing.xs },
});
