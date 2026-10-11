import { useReducer, useCallback } from "react";

function historyReducer(state, action) {
  switch (action.type) {
    case "PUSH": {
      const current = Array.isArray(state.history[state.index])
        ? state.history[state.index]
        : (Array.isArray(state.initial) ? state.initial : []);
      const resolved = typeof action.payload === "function"
        ? action.payload(current)
        : action.payload;
      const safeNext = resolved !== undefined && resolved !== null ? resolved : current;
      const newHistory = state.history.slice(0, state.index + 1);
      newHistory.push(safeNext);
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      return {
        ...state,
        history: newHistory,
        index: newHistory.length - 1,
      };
    }
    case "UNDO": {
      return {
        ...state,
        index: Math.max(0, state.index - 1),
      };
    }
    case "REDO": {
      return {
        ...state,
        index: Math.min(state.history.length - 1, state.index + 1),
      };
    }
    case "RESET": {
      const nextInitial = Array.isArray(action.payload)
        ? action.payload
        : (Array.isArray(state.initial) ? state.initial : []);
      return {
        ...state,
        history: [nextInitial],
        index: 0,
      };
    }
    default:
      return state;
  }
}

export function useHistory(initial = []) {
  const safeInitial = Array.isArray(initial) ? initial : [];
  const [state, dispatch] = useReducer(historyReducer, {
    history: [safeInitial],
    index: 0,
    initial: safeInitial,
  });

  const push = useCallback((next) => {
    dispatch({ type: "PUSH", payload: next });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: "UNDO" });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: "REDO" });
  }, []);

  const reset = useCallback((newInitial) => {
    dispatch({ type: "RESET", payload: newInitial });
  }, []);

  const current = Array.isArray(state.history[state.index])
    ? state.history[state.index]
    : (Array.isArray(state.initial) ? state.initial : []);

  const canUndo = state.index > 0;
  const canRedo = state.index < state.history.length - 1;

  return { state: current, push, undo, redo, reset, canUndo, canRedo };
}

