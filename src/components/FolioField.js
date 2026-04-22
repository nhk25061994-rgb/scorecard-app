// src/components/FolioField.js
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, fonts, sizes, spacing } from '../theme';

export default function FolioField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  style,
}) {
  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.faint}
        keyboardType={keyboardType}
        underlineColorAndroid="transparent"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  label: {
    fontFamily: fonts.monoSemibold,
    fontSize: sizes.label,
    letterSpacing: 1.8,
    color: colors.subtle,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.ink,
    fontFamily: fonts.displaySemibold,
    fontSize: sizes.input,
    color: colors.ink,
  },
});
