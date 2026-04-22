// src/modals/BreakdownModal.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import BottomSheet from '../components/BottomSheet';
import { colors, fonts, sizes, spacing, radii } from '../theme';

function BallChip({ ball }) {
  const cls =
    ball.label === 'W' ? 'w'
    : ball.runs === 6 ? 'six'
    : ball.runs === 4 ? 'four'
    : '';
  return (
    <View style={[chipStyles.chip, chipStyles[cls]]}>
      <Text style={[chipStyles.chipText, chipStyles[`${cls}Text`]]}>{ball.label}</Text>
    </View>
  );
}

export default function BreakdownModal({
  visible,
  onClose,
  wides, widesRuns,
  noBalls, noBallsRuns,
  allOvers,
}) {
  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Over "
      titleAccent="Breakdown"
      subtitle="Ball-by-Ball Ledger"
    >
      {/* Extras */}
      <View style={styles.extrasRow}>
        <View style={[styles.extraCard, styles.wdCard]}>
          <Text style={styles.extraLabel}>WIDES</Text>
          <Text style={styles.extraFigure}>{wides}</Text>
          <Text style={styles.extraSub}>{widesRuns} runs conceded</Text>
        </View>
        <View style={[styles.extraCard, styles.nbCard]}>
          <Text style={styles.extraLabel}>NO BALLS</Text>
          <Text style={styles.extraFigure}>{noBalls}</Text>
          <Text style={styles.extraSub}>{noBallsRuns} runs conceded</Text>
        </View>
      </View>

      {allOvers.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyMark}>∅</Text>
          <Text style={styles.emptyTitle}>
            No <Text style={styles.emptyEm}>overs</Text> complete
          </Text>
          <Text style={styles.emptyP}>
            Completed overs shall appear here,{'\n'}ball by ball.
          </Text>
        </View>
      ) : (
        <View>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { width: 42 }]}>OVER</Text>
            <Text style={[styles.th, { flex: 1 }]}>BALLS</Text>
            <Text style={[styles.th, { width: 56, textAlign: 'right' }]}>RUNS</Text>
          </View>
          {[...allOvers].reverse().map((ov) => (
            <View key={ov.number} style={styles.tr}>
              <Text style={[styles.overNum, { width: 42 }]}>{ov.number}</Text>
              <View style={[styles.chips, { flex: 1 }]}>
                {ov.balls.map((b, i) => (
                  <BallChip key={i} ball={b} />
                ))}
              </View>
              <Text style={[styles.runsCell, { width: 56, textAlign: 'right' }]}>{ov.runs}</Text>
            </View>
          ))}
        </View>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  extrasRow: { flexDirection: 'row', gap: 14, marginBottom: 18 },
  extraCard: {
    flex: 1,
    padding: 12,
    borderWidth: 1.5,
    borderColor: colors.ink,
    borderTopWidth: 5,
    borderRadius: radii.md,
  },
  wdCard: { borderTopColor: colors.warning },
  nbCard: { borderTopColor: colors.accent },
  extraLabel: {
    fontFamily: fonts.monoSemibold,
    fontSize: sizes.label,
    letterSpacing: 1.8,
    color: colors.subtle,
    marginBottom: 6,
  },
  extraFigure: {
    fontFamily: fonts.displayBold,
    fontSize: sizes.extraFigure,
    color: colors.ink,
    letterSpacing: -1.7,
    lineHeight: 44,
  },
  extraSub: {
    fontFamily: fonts.displayItalic,
    fontSize: 11,
    color: colors.muted,
    marginTop: 4,
  },

  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyMark: {
    fontFamily: fonts.displayItalic,
    fontSize: sizes.emptyMark,
    color: colors.faint,
    marginBottom: 10,
    lineHeight: 78,
  },
  emptyTitle: {
    fontFamily: fonts.displaySemibold,
    fontSize: 24,
    color: colors.ink,
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  emptyEm: { fontFamily: fonts.displayItalicMedium, color: colors.accent },
  emptyP: {
    fontFamily: fonts.displayItalic,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },

  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.ink,
  },
  th: {
    fontFamily: fonts.monoSemibold,
    fontSize: sizes.label,
    letterSpacing: 1.8,
    color: colors.subtle,
  },
  tr: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    borderStyle: 'dotted',
  },
  overNum: {
    fontFamily: fonts.displayItalicBold,
    fontSize: 17,
    color: colors.accent,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 3 },
  runsCell: {
    fontFamily: fonts.displayBold,
    fontSize: 18,
    color: colors.ink,
    letterSpacing: -0.3,
  },
});

const chipStyles = StyleSheet.create({
  chip: {
    minWidth: 22,
    height: 20,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.ink,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontFamily: fonts.monoSemibold,
    fontSize: 10,
    color: colors.ink,
  },
  four: { backgroundColor: colors.ink },
  fourText: { color: colors.cream },
  six: { backgroundColor: colors.accent, borderColor: colors.accent },
  sixText: { color: colors.cream },
  w: { backgroundColor: colors.accent, borderColor: colors.accent },
  wText: { color: colors.cream },
});
