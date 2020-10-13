import {
  Dispatch,
  Reducer,
  ReducerAction,
  ReducerState,
  SetStateAction,
  useCallback
} from "react";

/**
 * Reacts built in reducer can't be used if value needs to be updated from source outside reducer.
 * I much rather have an intermediate dispatch instead of a "god" action to replace entire state by dispatch. 
 */
export default function useReducerDispatch<R extends Reducer<any, any>>(
  reducer: R,
  setState: Dispatch<SetStateAction<ReducerState<R>>>
) {
  const dispatch = useCallback(
    (action: ReducerAction<R>) => {
      setState((state) => reducer(state, action));
    },
    [setState]
  );
  return dispatch;
}
