// src/modals/AdjustScoreModal.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet from '../components/BottomSheet';
import FolioField from '../components/FolioField';
import FolioButton from '../components/FolioButton';
import { colors, fonts, sizes, spacing } from '../theme';

export default function AdjustScoreModal({ visible, onClose, onApply }) {
  const [over, setOver] = useState('');
  const [ball, setBall] = useState('');
  const [runs, setRuns] = useState('');

  const handleApply = () => {
    if (!runs) return;
    onApply(parseInt(runs, 10));
    setOver(''); setBall(''); setRuns('');
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Adjust the "
      titleAccent="Ledger"
      subtitle="Change Score"
    >
      <View>
        <Text style={styles.note}>
          Record runs against a specific over and ball.
        </Text>

        <View style={styles.row3}>
          <FolioField
            style={styles.col}
            label="OVER"
            placeholder="1"
            value={over}
            onChangeText={setOver}
            keyboardType="number-pad"
          />
          <FolioField
            style={styles.col}
            label="BALL"
            placeholder="3"
            value={ball}
            onChangeText={setBall}
            keyboardType="number-pad"
          />
          <FolioField
            style={styles.col}
            label="RUNS"
            placeholder="4"
            value={runs}
            onChangeText={setRuns}
            keyboardType="number-pad"
          />
        </View>

        <FolioButton label="Enter in the " accent="Book" onPress={handleApply} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  note: {
    fontFamily: fonts.displayItalic,
    fontSize: sizes.bodySmall,
    color: colors.muted,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  row3: {
    flexDirection: 'row',
    gap: 16,
  },
  col: {
    flex: 1,
  },
});
