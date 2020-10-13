import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { sourcePropEquals } from "../utils";

/**
 * Set state but shallow compare all props, cut down on shallow compare checks in other places.
 */
export default function useShallowComparedState<TState>(
  initialState: TState | (() => TState)
) {
  const [state, setStateInternal] = useState(initialState);
  const setState = useCallback<Dispatch<SetStateAction<TState>>>(
    (action) => {
      setStateInternal((state) => {
        const newState =
          typeof action === "function"
            ? //@ts-ignore: This is a valid typescript concern, state itself can contain a function.
              //But i believe this to be a bug in react as well.
              action(state)
            : action;
        return sourcePropEquals(newState, state) ? state : newState;
      });
    },
    [setStateInternal]
  );
  return [state, setState] as const;
}
