// src/components/FolioButton.js
import React, { useRef } from 'react';
import { Pressable, Text, StyleSheet, Animated } from 'react-native';
import { colors, fonts, spacing, radii } from '../theme';

export default function FolioButton({ label, accent, onPress, variant = 'solid', style }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, stiffness: 300, damping: 18 }).start();
  };
  const onOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, stiffness: 300, damping: 18 }).start();
  };

  const isGhost = variant === 'ghost';

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPressIn={onIn}
        onPressOut={onOut}
        onPress={onPress}
        style={[
          styles.btn,
          isGhost ? styles.ghost : styles.solid,
          style,
        ]}
      >
        <Text style={[styles.text, isGhost ? styles.ghostText : styles.solidText]}>
          {label}{accent ? <Text style={[styles.accent, isGhost ? styles.accentGhost : null]}>{accent}</Text> : null}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    borderWidth: 1.5,
    marginTop: spacing.md,
  },
  solid: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: colors.ink,
  },
  text: {
    fontFamily: fonts.displaySemibold,
    fontSize: 18,
    letterSpacing: -0.2,
  },
  solidText: {
    color: colors.cream,
  },
  ghostText: {
    color: colors.ink,
  },
  accent: {
    fontFamily: fonts.displayItalicMedium,
    color: colors.cream,
  },
  accentGhost: {
    color: colors.accent,
  },
});
