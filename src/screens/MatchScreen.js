// src/screens/MatchScreen.js
import React, { useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import MatchSetupModal from '../modals/MatchSetupModal';
import TargetModal from '../modals/TargetModal';
import AdjustScoreModal from '../modals/AdjustScoreModal';
import BreakdownModal from '../modals/BreakdownModal';
import ArchiveModal from '../modals/ArchiveModal';
import { colors, fonts } from '../theme';

const buzz = (style = 'Light') => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle[style]).catch(() => {});
};

function PressScale({ children, style, onPress, onLongPress }) {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[style, pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] }]}
    >
      {children}
    </Pressable>
  );
}

export default function MatchScreen({ match }) {
  const [activeModal, setActiveModal] = useState(null);

  const overRuns = match.currentOverBalls.reduce((a, b) => a + b.runs, 0);
  const lastBallIdx = (() => {
    for (let i = match.overProgress.length - 1; i >= 0; i--) {
      if (match.overProgress[i]) return i;
    }
    return -1;
  })();

  const tapDot = () => { buzz('Light'); match.addDot(); };
  const tapRuns = (n) => { buzz(n >= 4 ? 'Medium' : 'Light'); match.addRuns(n); };
  const tapWide = () => { buzz('Light'); match.addWide(); };
  const tapNoBall = () => { buzz('Light'); match.addNoBall(); };
  const tapWicket = () => { if (match.wickets >= 10) return; buzz('Heavy'); match.addWicket(); };
  const tapUndo = () => { buzz('Light'); match.undo(); };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* TOP BAR */}
        <View style={styles.topBar}>
          <View style={styles.inningsPill}>
            <Text style={styles.inningsFlame}>🔥</Text>
            <Text style={styles.inningsText}>
              {match.innings === 1 ? '1ST INNINGS' : '2ND INNINGS'}
            </Text>
          </View>
          <View style={styles.topIcons}>
            <PressScale style={styles.iconBtn} onPress={() => setActiveModal('edit')}>
              <Text style={styles.iconGlyph}>✎</Text>
            </PressScale>
            <PressScale
              style={styles.iconBtn}
              onPress={() => setActiveModal('setup')}
              onLongPress={() => setActiveModal('archive')}
            >
              <Text style={styles.iconGlyph}>⚙</Text>
            </PressScale>
          </View>
        </View>

        {/* TEAMS */}
        <View style={styles.teamsRow}>
          <View style={styles.teamSide}>
            <Text style={styles.teamText}>{match.battingTeam || 'Batting'}</Text>
            <View style={styles.batDot} />
          </View>
          <Text style={styles.vsText}>vs</Text>
          <Text style={[styles.teamText, { textAlign: 'right' }]}>
            {match.bowlingTeam || 'Bowling'}
          </Text>
        </View>

        {/* SCORE BLOCK */}
        <View style={styles.scoreBlock}>
          <Text style={styles.scoreLabel}>
            SCORE · {match.innings === 1 ? 'FIRST INNINGS' : 'SECOND INNINGS'}
          </Text>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreRuns}>{match.runs}</Text>
            <Text style={styles.scoreSlash}>/</Text>
            <Text style={styles.scoreWkts}>{match.wickets}</Text>
            <Text style={styles.scoreOvers}>
              {String(match.overs).padStart(2, '0')}{match.ballsInOver ? `.${match.ballsInOver}` : ''}
            </Text>
          </View>
          <View style={styles.scoreStatsRow}>
            <Text style={styles.statKey}>CRR</Text>
            <Text style={styles.statVal}>{match.crr}</Text>
            <View style={styles.statGap} />
            <Text style={styles.statKey}>Balls</Text>
            <Text style={styles.statVal}>{match.balls}</Text>
            {match.rrr ? (
              <>
                <View style={styles.statGap} />
                <Text style={styles.statKey}>RRR</Text>
                <Text style={styles.statVal}>{match.rrr}</Text>
              </>
            ) : null}
          </View>
        </View>

        {/* THIS OVER */}
        <View style={styles.overCard}>
          <View style={styles.overHeader}>
            <Text style={styles.overTitle}>THIS OVER · #{match.overs + 1}</Text>
            <Text style={styles.overRuns}>
              <Text style={styles.overRunsNum}>{overRuns}</Text> RUNS
            </Text>
          </View>
          <View style={styles.ballsRow}>
            {match.overProgress.map((ball, i) => {
              if (!ball) {
                return <View key={i} style={[styles.ballCell, styles.ballEmpty]} />;
              }
              const isLast = i === lastBallIdx;
              const isW = ball.label === 'W';
              const isDot = ball.runs === 0 && !isW;
              return (
                <View
                  key={i}
                  style={[
                    styles.ballCell,
                    isLast && styles.ballCellActive,
                    isW && styles.ballCellWicket,
                  ]}
                >
                  <Text
                    style={[
                      styles.ballText,
                      isLast && styles.ballTextActive,
                      isW && styles.ballTextWicket,
                      isDot && { color: colors.textMuted },
                    ]}
                  >
                    {isDot ? '·' : ball.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* BUTTON GRID */}
        <View style={styles.grid}>
          {/* Row 1: dot / wide / no-ball */}
          <View style={styles.gridRow}>
            <PressScale style={[styles.btn, styles.btnDark]} onPress={tapDot}>
              <Text style={styles.btnDarkText}>
                <Text style={{ color: colors.textMuted }}>• </Text>Dot
              </Text>
            </PressScale>
            <PressScale style={[styles.btn, styles.btnOrangeOutline]} onPress={tapWide}>
              <Text style={styles.btnOrangeText}>Wide</Text>
            </PressScale>
            <PressScale style={[styles.btn, styles.btnOrangeOutline]} onPress={tapNoBall}>
              <Text style={styles.btnOrangeText}>No Ball</Text>
            </PressScale>
          </View>
          {/* Row 2: 1 / 2 / 3 */}
          <View style={styles.gridRow}>
            {[1, 2, 3].map((n) => (
              <PressScale
                key={n}
                style={[styles.btn, styles.btnDark]}
                onPress={() => tapRuns(n)}
              >
                <Text style={styles.btnNumText}>{n}</Text>
              </PressScale>
            ))}
          </View>
          {/* Row 3: 4 / 6 / OUT */}
          <View style={styles.gridRow}>
            <PressScale style={[styles.btn, styles.btnGreen]} onPress={() => tapRuns(4)}>
              <Text style={styles.btnGreenText}>
                <Text style={styles.btnGreenIcon}>⚡ </Text>4
              </Text>
            </PressScale>
            <PressScale style={[styles.btn, styles.btnGreen]} onPress={() => tapRuns(6)}>
              <Text style={styles.btnGreenText}>
                <Text style={styles.btnGreenIcon}>🔥 </Text>6
              </Text>
            </PressScale>
            <PressScale style={[styles.btn, styles.btnRedOutline]} onPress={tapWicket}>
              <Text style={styles.btnRedOutlineText}>
                <Text style={styles.btnRedIcon}>♟ </Text>OUT
              </Text>
            </PressScale>
          </View>
          {/* Row 4: TARGET / EXTRAS / UNDO */}
          <View style={styles.gridRow}>
            <PressScale
              style={[styles.btn, styles.btnBlue]}
              onPress={() => setActiveModal('target')}
            >
              <Text style={styles.btnSolidText}>
                <Text style={styles.btnSolidIcon}>◎ </Text>TARGET
              </Text>
            </PressScale>
            <PressScale
              style={[styles.btn, styles.btnCyan]}
              onPress={() => setActiveModal('breakdown')}
            >
              <Text style={styles.btnSolidText}>
                <Text style={styles.btnSolidIcon}>↗ </Text>EXTRAS
              </Text>
            </PressScale>
            <PressScale
              style={[styles.btn, styles.btnRedSolid]}
              onPress={tapUndo}
            >
              <Text style={styles.btnSolidText}>
                <Text style={styles.btnSolidIcon}>↺ </Text>UNDO
              </Text>
            </PressScale>
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <MatchSetupModal
        visible={activeModal === 'setup'}
        onClose={() => setActiveModal(null)}
        initial={{
          battingTeam: match.battingTeam,
          bowlingTeam: match.bowlingTeam,
          maxOvers: match.maxOvers,
        }}
        onSave={(cfg) => { match.setMatchConfig(cfg); setActiveModal(null); }}
      />
      <TargetModal
        visible={activeModal === 'target'}
        onClose={() => setActiveModal(null)}
        onSetTarget={(t) => { match.setTargetRuns(t); setActiveModal(null); }}
        onStartSecond={() => { match.startSecondInnings(); }}
      />
      <AdjustScoreModal
        visible={activeModal === 'edit'}
        onClose={() => setActiveModal(null)}
        onApply={(delta) => { match.adjustScore(delta); setActiveModal(null); }}
      />
      <BreakdownModal
        visible={activeModal === 'breakdown'}
        onClose={() => setActiveModal(null)}
        wides={match.wides}
        widesRuns={match.widesRuns}
        noBalls={match.noBalls}
        noBallsRuns={match.noBallsRuns}
        allOvers={match.allOvers}
      />
      <ArchiveModal
        visible={activeModal === 'archive'}
        onClose={() => setActiveModal(null)}
        pastMatches={match.pastMatches}
        onStartFresh={match.startFreshMatch}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  inningsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: colors.greenSoft,
    borderWidth: 1,
    borderColor: colors.greenBorder,
  },
  inningsFlame: { fontSize: 12, marginRight: 6 },
  inningsText: {
    fontFamily: fonts.monoBold,
    fontSize: 11,
    color: colors.green,
    letterSpacing: 1.2,
  },
  topIcons: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 36, height: 36,
    borderRadius: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlyph: { color: colors.textSecondary, fontSize: 16 },

  // Teams row
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  teamSide: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  teamText: {
    fontFamily: fonts.displayItalic,
    fontSize: 18,
    color: colors.textSecondary,
    flex: 1,
  },
  batDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.green,
    marginLeft: 8,
  },
  vsText: {
    fontFamily: fonts.displayItalic,
    fontSize: 14,
    color: colors.green,
    marginHorizontal: 14,
  },

  // Score block
  scoreBlock: { marginBottom: 18 },
  scoreLabel: {
    fontFamily: fonts.monoSemibold,
    fontSize: 10,
    letterSpacing: 2,
    color: colors.textMuted,
    marginBottom: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  scoreRuns: {
    fontFamily: fonts.displayBlack,
    fontSize: 112,
    color: colors.textPrimary,
    letterSpacing: -6,
    lineHeight: 100,
    includeFontPadding: false,
  },
  scoreSlash: {
    fontFamily: fonts.displayRegular,
    fontSize: 96,
    color: colors.textSubtle,
    marginHorizontal: 2,
    lineHeight: 100,
    includeFontPadding: false,
  },
  scoreWkts: {
    fontFamily: fonts.displayBlack,
    fontSize: 112,
    color: colors.textPrimary,
    letterSpacing: -6,
    lineHeight: 100,
    includeFontPadding: false,
  },
  scoreOvers: {
    fontFamily: fonts.monoBold,
    fontSize: 24,
    color: colors.green,
    marginLeft: 6,
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  scoreStatsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  statKey: {
    fontFamily: fonts.monoRegular,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  statVal: {
    fontFamily: fonts.monoBold,
    fontSize: 13,
    color: colors.textPrimary,
    marginLeft: 6,
    letterSpacing: 0.4,
  },
  statGap: { width: 16 },

  // This over card
  overCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorderSoft,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  overHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  overTitle: {
    fontFamily: fonts.monoSemibold,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.textMuted,
  },
  overRuns: {
    fontFamily: fonts.monoRegular,
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.textMuted,
  },
  overRunsNum: {
    fontFamily: fonts.monoBold,
    color: colors.textPrimary,
    fontSize: 12,
  },
  ballsRow: { flexDirection: 'row', gap: 6 },
  ballCell: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.cardDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ballEmpty: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderStyle: 'dashed',
  },
  ballCellActive: {
    backgroundColor: colors.green,
  },
  ballCellWicket: {
    backgroundColor: colors.red,
  },
  ballText: {
    fontFamily: fonts.displayBold,
    fontSize: 16,
    color: colors.textSecondary,
  },
  ballTextActive: { color: '#0A1018' },
  ballTextWicket: { color: '#FFFFFF' },

  // Grid
  grid: { gap: 10 },
  gridRow: { flexDirection: 'row', gap: 10 },
  btn: {
    flex: 1,
    height: 64,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  btnDark: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
  },
  btnDarkText: {
    fontFamily: fonts.displaySemibold,
    fontSize: 17,
    color: colors.textPrimary,
  },
  btnNumText: {
    fontFamily: fonts.displayBold,
    fontSize: 24,
    color: colors.textPrimary,
  },
  btnOrangeOutline: {
    backgroundColor: colors.orangeSoft,
    borderColor: colors.orangeBorder,
  },
  btnOrangeText: {
    fontFamily: fonts.displayBold,
    fontSize: 17,
    color: colors.orange,
  },
  btnGreen: {
    backgroundColor: colors.greenSoft,
    borderColor: colors.greenBorder,
  },
  btnGreenText: {
    fontFamily: fonts.displayBold,
    fontSize: 22,
    color: colors.green,
  },
  btnGreenIcon: { fontSize: 14 },
  btnRedOutline: {
    backgroundColor: colors.redSoft,
    borderColor: colors.redBorder,
  },
  btnRedOutlineText: {
    fontFamily: fonts.displayBold,
    fontSize: 17,
    color: colors.red,
    letterSpacing: 1,
  },
  btnRedIcon: { fontSize: 14 },
  btnBlue: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },
  btnCyan: {
    backgroundColor: colors.lightBlue,
    borderColor: colors.lightBlue,
  },
  btnRedSolid: {
    backgroundColor: colors.redSolid,
    borderColor: colors.redSolid,
  },
  btnSolidText: {
    fontFamily: fonts.displayBold,
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  btnSolidIcon: { fontSize: 13 },
});
