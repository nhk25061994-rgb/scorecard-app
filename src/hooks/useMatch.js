// src/hooks/useMatch.js
import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@scorecard:matchState';
const PAST_MATCHES_KEY = '@scorecard:pastMatches';

const initialState = {
  runs: 0,
  wickets: 0,
  balls: 0,
  overs: 0,
  ballsInOver: 0,
  currentOverBalls: [],
  history: [],
  allOvers: [],
  wides: 0,
  widesRuns: 0,
  noBalls: 0,
  noBallsRuns: 0,
  maxOvers: null,
  battingTeam: '',
  bowlingTeam: '',
  target: null,
  innings: 1,
  firstInningsScore: null,
};

export default function useMatch() {
  const [state, setState] = useState(initialState);
  const [pastMatches, setPastMatches] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef(null);

  // --- Hydrate on mount ---
  useEffect(() => {
    (async () => {
      try {
        const [raw, pastRaw] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(PAST_MATCHES_KEY),
        ]);
        if (raw) setState({ ...initialState, ...JSON.parse(raw) });
        if (pastRaw) setPastMatches(JSON.parse(pastRaw));
      } catch (e) {
        // silent - first run or corrupt data, just start fresh
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // --- Persist (debounced) ---
  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
    }, 300);
    return () => saveTimer.current && clearTimeout(saveTimer.current);
  }, [state, loaded]);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(PAST_MATCHES_KEY, JSON.stringify(pastMatches)).catch(() => {});
  }, [pastMatches, loaded]);

  // --- Helpers ---
  const pushHistory = (s) => ({
    ...s,
    history: [
      ...s.history,
      {
        runs: s.runs, wickets: s.wickets, balls: s.balls,
        overs: s.overs, ballsInOver: s.ballsInOver,
        currentOverBalls: [...s.currentOverBalls],
        allOvers: s.allOvers.map((o) => ({ ...o, balls: [...o.balls] })),
        wides: s.wides, widesRuns: s.widesRuns,
        noBalls: s.noBalls, noBallsRuns: s.noBallsRuns,
      },
    ].slice(-40),
  });

  const addLegalBall = useCallback((runValue, label) => {
    setState((s) => {
      let next = pushHistory(s);
      const entry = { label, runs: runValue };
      const newBallsInOver = s.ballsInOver + 1;
      next = {
        ...next,
        runs: s.runs + runValue,
        balls: s.balls + 1,
      };
      if (newBallsInOver === 6) {
        const finishedOver = {
          number: s.overs + 1,
          balls: [...s.currentOverBalls, entry],
          runs: [...s.currentOverBalls, entry].reduce((a, b) => a + b.runs, 0),
        };
        next = {
          ...next,
          overs: s.overs + 1,
          ballsInOver: 0,
          currentOverBalls: [],
          allOvers: [...s.allOvers, finishedOver],
        };
      } else {
        next = {
          ...next,
          ballsInOver: newBallsInOver,
          currentOverBalls: [...s.currentOverBalls, entry],
        };
      }
      return next;
    });
  }, []);

  const addDot = useCallback(() => addLegalBall(0, '•'), [addLegalBall]);
  const addRuns = useCallback((n) => addLegalBall(n, String(n)), [addLegalBall]);

  const addWide = useCallback(() => {
    setState((s) => {
      const next = pushHistory(s);
      return {
        ...next,
        runs: s.runs + 1,
        wides: s.wides + 1,
        widesRuns: s.widesRuns + 1,
        currentOverBalls: [...s.currentOverBalls, { label: 'wd', runs: 1, extra: true }],
      };
    });
  }, []);

  const addNoBall = useCallback(() => {
    setState((s) => {
      const next = pushHistory(s);
      return {
        ...next,
        runs: s.runs + 1,
        noBalls: s.noBalls + 1,
        noBallsRuns: s.noBallsRuns + 1,
        currentOverBalls: [...s.currentOverBalls, { label: 'nb', runs: 1, extra: true }],
      };
    });
  }, []);

  const addWicket = useCallback(() => {
    setState((s) => {
      if (s.wickets >= 10) return s;
      let next = pushHistory(s);
      next = { ...next, wickets: s.wickets + 1 };
      // now inline a legal ball (0 runs, label W)
      const entry = { label: 'W', runs: 0 };
      const newBallsInOver = s.ballsInOver + 1;
      next = { ...next, balls: s.balls + 1 };
      if (newBallsInOver === 6) {
        const finishedOver = {
          number: s.overs + 1,
          balls: [...s.currentOverBalls, entry],
          runs: [...s.currentOverBalls, entry].reduce((a, b) => a + b.runs, 0),
        };
        next = {
          ...next,
          overs: s.overs + 1,
          ballsInOver: 0,
          currentOverBalls: [],
          allOvers: [...s.allOvers, finishedOver],
        };
      } else {
        next = {
          ...next,
          ballsInOver: newBallsInOver,
          currentOverBalls: [...s.currentOverBalls, entry],
        };
      }
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    setState((s) => {
      if (s.history.length === 0) return s;
      const last = s.history[s.history.length - 1];
      return {
        ...s,
        ...last,
        history: s.history.slice(0, -1),
      };
    });
  }, []);

  const setMatchConfig = useCallback(({ battingTeam, bowlingTeam, maxOvers }) => {
    setState((s) => ({
      ...s,
      battingTeam: battingTeam || s.battingTeam || 'Home',
      bowlingTeam: bowlingTeam || s.bowlingTeam || 'Visitors',
      maxOvers: maxOvers ? parseInt(maxOvers, 10) : s.maxOvers,
    }));
  }, []);

  const setTargetRuns = useCallback((t) => {
    setState((s) => ({ ...s, target: parseInt(t, 10) }));
  }, []);

  const adjustScore = useCallback((deltaRuns) => {
    setState((s) => ({ ...pushHistory(s), runs: s.runs + deltaRuns }));
  }, []);

  const startSecondInnings = useCallback(() => {
    setState((s) => ({
      ...initialState,
      firstInningsScore: {
        runs: s.runs,
        wickets: s.wickets,
        overs: s.overs,
        ballsInOver: s.ballsInOver,
        team: s.battingTeam || 'Home',
      },
      target: s.runs + 1,
      battingTeam: s.bowlingTeam,
      bowlingTeam: s.battingTeam,
      maxOvers: s.maxOvers,
      innings: 2,
    }));
  }, []);

  const startFreshMatch = useCallback(() => {
    setState((s) => {
      if (s.runs > 0 || s.wickets > 0 || s.balls > 0 || s.allOvers.length > 0) {
        const now = new Date();
        const entry = {
          id: Date.now(),
          date: now.toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
          }),
          time: now.toLocaleTimeString('en-GB', {
            hour: '2-digit', minute: '2-digit',
          }),
          battingTeam: s.battingTeam || 'Home',
          bowlingTeam: s.bowlingTeam || 'Visitors',
          runs: s.runs,
          wickets: s.wickets,
          overs: s.overs,
          ballsInOver: s.ballsInOver,
          firstInnings: s.firstInningsScore,
          target: s.target,
          innings: s.innings,
        };
        setPastMatches((prev) => [entry, ...prev]);
      }
      return { ...initialState };
    });
  }, []);

  const clearPastMatches = useCallback(() => setPastMatches([]), []);

  // --- Derived values ---
  const oversDisplay = `${state.overs}.${state.ballsInOver}`;
  const totalBalls = state.maxOvers ? state.maxOvers * 6 : null;
  const ballsBowled = state.overs * 6 + state.ballsInOver;
  const ballsRemaining = totalBalls ? totalBalls - ballsBowled : null;
  const runsNeeded = state.target ? state.target - state.runs : null;
  const rrr =
    state.target && ballsRemaining > 0
      ? ((runsNeeded / ballsRemaining) * 6).toFixed(2)
      : null;
  const crr = ballsBowled > 0 ? ((state.runs / ballsBowled) * 6).toFixed(2) : '0.00';
  const currentOverLegalBalls = state.currentOverBalls.filter((b) => !b.extra);
  const overProgress = Array.from({ length: 6 }, (_, i) => currentOverLegalBalls[i]);

  return {
    ...state,
    pastMatches,
    loaded,
    // derived
    oversDisplay,
    ballsRemaining,
    runsNeeded,
    rrr,
    crr,
    overProgress,
    // actions
    addDot,
    addRuns,
    addWide,
    addNoBall,
    addWicket,
    undo,
    setMatchConfig,
    setTargetRuns,
    adjustScore,
    startSecondInnings,
    startFreshMatch,
    clearPastMatches,
  };
}
