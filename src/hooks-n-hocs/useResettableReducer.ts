import {
  Reducer,
  ReducerAction,
  ReducerState,
  useCallback,
  useState,
} from "react";

//this might be a bit much
//Cheating a lot with dep arrays, but hey
export default function useResettableReducer<R extends Reducer<any, any>>(
  reducer: R,
  initialState: ReducerState<R>
) {
  const [state, setState] = useState(initialState);
  const dispatch = useCallback(
    (action: ReducerAction<R>) => {
      setState((state) => reducer(state, action));
    },
    [state]
  );
  const reset = useCallback(() => setState(initialState), []);
  return [state, dispatch, reset] as const;
}
