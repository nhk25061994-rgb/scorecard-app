// src/components/BottomSheet.js
import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Pressable,
  Animated,
  StyleSheet,
  ScrollView,
  Text,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, fonts, sizes, spacing } from '../theme';

export default function BottomSheet({
  visible,
  onClose,
  title,
  titleAccent,
  subtitle,
  children,
}) {
  const translateY = useRef(new Animated.Value(800)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1, duration: 220, useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          stiffness: 180,
          damping: 18,
          mass: 0.9,
        }),
      ]).start();
    } else {
      translateY.setValue(800);
      backdropOpacity.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: backdropOpacity }]}>
        <Pressable style={styles.backdrop} onPress={onClose} />
      </Animated.View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.wrapper}
        pointerEvents="box-none"
      >
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          {/* hairline */}
          <View style={styles.hairline} />

          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>
                {title}
                {titleAccent ? <Text style={styles.titleAccent}>{titleAccent}</Text> : null}
              </Text>
              {subtitle ? <Text style={styles.subtitle}>§ {subtitle}</Text> : null}
            </View>
            <Pressable style={styles.close} onPress={onClose}>
              <Text style={styles.closeX}>×</Text>
            </Pressable>
          </View>

          <ScrollView
            style={{ maxHeight: '100%' }}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: spacing.xxl }}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlayDark,
  },
  sheet: {
    backgroundColor: colors.cream,
    borderTopWidth: 3,
    borderTopColor: colors.ink,
    paddingHorizontal: spacing.xl,
    paddingTop: 16,
    maxHeight: '88%',
  },
  hairline: {
    position: 'absolute',
    left: 0, right: 0, top: -8,
    height: 1,
    backgroundColor: colors.ink,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.ink,
    marginBottom: 16,
  },
  title: {
    fontFamily: fonts.displaySemibold,
    fontSize: sizes.folioTitle,
    color: colors.ink,
    letterSpacing: -0.7,
    lineHeight: 30,
  },
  titleAccent: {
    fontFamily: fonts.displayItalicMedium,
    color: colors.accent,
  },
  subtitle: {
    fontFamily: fonts.monoSemibold,
    fontSize: sizes.label,
    letterSpacing: 1.8,
    color: colors.subtle,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  close: {
    width: 30, height: 30,
    borderWidth: 1.5,
    borderColor: colors.ink,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeX: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.ink,
    lineHeight: 22,
  },
});
