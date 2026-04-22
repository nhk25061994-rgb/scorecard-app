// src/modals/MatchSetupModal.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet from '../components/BottomSheet';
import FolioField from '../components/FolioField';
import FolioButton from '../components/FolioButton';
import { colors, fonts, sizes, spacing } from '../theme';

export default function MatchSetupModal({ visible, onClose, onSave, initial }) {
  const [batting, setBatting] = useState('');
  const [bowling, setBowling] = useState('');
  const [maxOvers, setMaxOvers] = useState('');

  useEffect(() => {
    if (visible) {
      setBatting(initial?.battingTeam || '');
      setBowling(initial?.bowlingTeam || '');
      setMaxOvers(initial?.maxOvers ? String(initial.maxOvers) : '');
    }
  }, [visible, initial]);

  const handleSave = () => {
    if (!maxOvers) return;
    onSave({ battingTeam: batting, bowlingTeam: bowling, maxOvers });
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Match "
      titleAccent="Setup"
      subtitle="The Fixture"
    >
      <View>
        <Text style={styles.sectionLabel}>THE TEAMS</Text>
        <View style={styles.row}>
          <FolioField
            style={{ flex: 1, marginRight: 8 }}
            placeholder="Home XI"
            value={batting}
            onChangeText={setBatting}
          />
          <FolioField
            style={{ flex: 1, marginLeft: 8 }}
            placeholder="Visitors"
            value={bowling}
            onChangeText={setBowling}
          />
        </View>

        <FolioField
          label="OVERS PER INNINGS"
          placeholder="twenty"
          value={maxOvers}
          onChangeText={setMaxOvers}
          keyboardType="number-pad"
        />

        <View style={styles.note}>
          <Text style={styles.noteText}>
            Upon completion of the allotted overs, the match-book shall prompt the start of the second innings.
          </Text>
        </View>

        <FolioButton label="Begin the " accent="Match" onPress={handleSave} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontFamily: fonts.monoSemibold,
    fontSize: sizes.label,
    letterSpacing: 1.8,
    color: colors.subtle,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
  },
  note: {
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    borderStyle: 'dashed',
    paddingTop: spacing.md,
    marginTop: spacing.sm,
  },
  noteText: {
    fontFamily: fonts.displayItalic,
    fontSize: sizes.bodySmall,
    color: colors.muted,
    lineHeight: 20,
  },
});
