// src/modals/TargetModal.js
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import BottomSheet from '../components/BottomSheet';
import FolioField from '../components/FolioField';
import FolioButton from '../components/FolioButton';
import { colors, fonts, sizes, spacing, radii } from '../theme';

function OptionCard({ num, title, sub, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.opt, pressed && styles.optPressed]}
      onPress={onPress}
    >
      <Text style={styles.optNum}>{num}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.optTitle}>{title}</Text>
        <Text style={styles.optSub}>{sub}</Text>
      </View>
    </Pressable>
  );
}

export default function TargetModal({ visible, onClose, onSetTarget, onStartSecond }) {
  const [mode, setMode] = useState('choose'); // 'choose' | 'enter'
  const [target, setTarget] = useState('');

  const close = () => {
    setMode('choose');
    setTarget('');
    onClose();
  };

  const handleSet = () => {
    if (!target) return;
    onSetTarget(target);
    setMode('choose');
    setTarget('');
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={close}
      title={mode === 'choose' ? 'The ' : 'Set '}
      titleAccent={mode === 'choose' ? 'Chase' : 'Target'}
      subtitle={mode === 'choose' ? 'Target Mode' : 'Runs to Chase'}
    >
      {mode === 'choose' ? (
        <View>
          <OptionCard
            num="i"
            title="Set a target directly"
            sub="Track runs required within this innings."
            onPress={() => setMode('enter')}
          />
          <OptionCard
            num="ii"
            title="Begin the second innings"
            sub="Preserve the first innings; commence the chase."
            onPress={() => { onStartSecond(); close(); }}
          />
        </View>
      ) : (
        <View>
          <FolioField
            label="TARGET RUNS"
            placeholder="one eighty-five"
            value={target}
            onChangeText={setTarget}
            keyboardType="number-pad"
          />
          <FolioButton label="Commence the " accent="Chase" onPress={handleSet} />
        </View>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  opt: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.ink,
    borderRadius: radii.md,
    marginBottom: spacing.md,
  },
  optPressed: {
    backgroundColor: colors.ink,
  },
  optNum: {
    fontFamily: fonts.displayItalicBold,
    fontSize: 34,
    color: colors.accent,
    width: 40,
    letterSpacing: -1,
  },
  optTitle: {
    fontFamily: fonts.displaySemibold,
    fontSize: 17,
    color: colors.ink,
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  optSub: {
    fontFamily: fonts.displayItalic,
    fontSize: 12,
    color: colors.muted,
  },
});
