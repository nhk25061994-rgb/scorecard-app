// src/components/PaperBackground.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';

// A two-layer background: the gradient feel achieved with stacked radial-ish
// overlays (RN has no native radial gradients, so we fake subtle tonality
// with overlaid translucent views).
export default function PaperBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.cream }]} />
      <View style={[StyleSheet.absoluteFill, styles.topTint]} />
      <View style={[StyleSheet.absoluteFill, styles.bottomTint]} />
    </View>
  );
}

const styles = StyleSheet.create({
  topTint: {
    backgroundColor: 'rgba(180, 140, 80, 0.05)',
  },
  bottomTint: {
    backgroundColor: 'rgba(100, 70, 40, 0.03)',
  },
});
