// src/modals/ArchiveModal.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import BottomSheet from '../components/BottomSheet';
import FolioButton from '../components/FolioButton';
import { colors, fonts, sizes, spacing } from '../theme';

export default function ArchiveModal({ visible, onClose, pastMatches, onStartFresh }) {
  const hasMatches = pastMatches.length > 0;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="The "
      titleAccent="Archive"
      subtitle="Past Scorecards"
    >
      {!hasMatches ? (
        <View style={styles.empty}>
          <Text style={styles.emptyMark}>§</Text>
          <Text style={styles.emptyTitle}>
            An <Text style={styles.emptyEm}>empty</Text> archive
          </Text>
          <Text style={styles.emptyP}>
            Complete a match and begin a fresh{'\n'}one to preserve it here.
          </Text>
          <FolioButton
            label="Begin Fresh Match"
            onPress={() => { onStartFresh(); onClose(); }}
            variant="ghost"
            style={{ marginTop: 20 }}
          />
        </View>
      ) : (
        <View>
          {pastMatches.map((m) => (
            <View key={m.id} style={styles.entry}>
              <View style={styles.entryTop}>
                <Text style={styles.entryMeta}>{m.date} · {m.time}</Text>
                <Text style={styles.entryMeta}>{m.innings === 2 ? 'II INNINGS' : 'I INNINGS'}</Text>
              </View>
              <Text style={styles.teams}>
                {m.battingTeam}
                <Text style={styles.vs}> v. </Text>
                {m.bowlingTeam}
              </Text>
              <Text style={styles.score}>
                <Text style={styles.scoreBold}>{m.runs}/{m.wickets}</Text>
                <Text style={styles.scoreIn}> in </Text>
                {m.overs}.{m.ballsInOver} ov
              </Text>
              {m.firstInnings ? (
                <Text style={styles.first}>
                  1st: {m.firstInnings.team} {m.firstInnings.runs}/{m.firstInnings.wickets}
                </Text>
              ) : null}
            </View>
          ))}
          <FolioButton
            label="Begin "
            accent="Fresh"
            onPress={() => { onStartFresh(); onClose(); }}
            style={{ marginTop: 20 }}
          />
        </View>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
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

  entry: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  entryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  entryMeta: {
    fontFamily: fonts.monoSemibold,
    fontSize: sizes.label,
    letterSpacing: 1.8,
    color: colors.subtle,
  },
  teams: {
    fontFamily: fonts.displaySemibold,
    fontSize: 20,
    color: colors.ink,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  vs: {
    fontFamily: fonts.displayItalicMedium,
    color: colors.accent,
    fontSize: 13,
  },
  score: {
    fontFamily: fonts.displayItalic,
    fontSize: 15,
    color: '#3a2f22',
  },
  scoreBold: {
    fontFamily: fonts.displayBold,
    color: colors.ink,
    letterSpacing: -0.2,
  },
  scoreIn: { fontFamily: fonts.displayItalic },
  first: {
    fontFamily: fonts.monoRegular,
    fontSize: 10,
    color: colors.muted,
    marginTop: 4,
    letterSpacing: 0.5,
  },
});
