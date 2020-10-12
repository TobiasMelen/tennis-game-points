import React, {
  ComponentProps,
  CSSProperties,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import transitionChildren from "../hooks-n-hocs/transitionChildren";
import useFirestorePersistence from "../hooks-n-hocs/useFirestorePersistence";
import useGameRouting from "../hooks-n-hocs/useGameRouting";
import useGameStateSoundFX from "../hooks-n-hocs/useGameStateSoundFX";
import useReducerDispatch from "../hooks-n-hocs/useReducerDispatch";
import useWindowTitle from "../hooks-n-hocs/useWindowTitle";
import {
  GameScore,
  GameState,
  getGameStatus,
  Player,
  pointWonBy,
} from "../tennisScoring";
import { sourcePropEquals } from "../utils";
import Block from "./Block";
import Button from "./Button";
import MainContainer from "./MainContainer";
import ScoreboardSection from "./ScoreboardSection";
import SoundToggler from "./SoundToggler";

const hasPadStart = "padStart" in new String();
const formatScore = (score: GameScore) =>
  typeof score === "number" && hasPadStart
    ? new String(score).padStart(2, "0")
    : score.toString();

const initialScores: GameState = { server: 0, receiver: 0 };

export default function App() {
  const [gameState, setGameState] = useState(initialScores);
  const addPointTo = useReducerDispatch(pointWonBy, gameState, setGameState);

  const [gameId, setGameId] = useGameRouting();
  const reset = useCallback(() => {
    setGameId();
    setGameState(initialScores);
  }, []);
  const fireStoreGame = useFirestorePersistence(gameState, gameId);
  //update game if firestore brings new info
  useEffect(() => {
    if (fireStoreGame != null) {
      setGameId(fireStoreGame.id);
      //only update from firebase if firebase data diffs to local
      setGameState((state) =>
        sourcePropEquals(state, fireStoreGame) ? state : fireStoreGame
      );
    }
  }, [fireStoreGame]);

  const [gameOver, gameNotStarted] = useMemo(() => {
    const status = getGameStatus(gameState);
    return [status === "GAME_OVER", status === "NOT_STARTED"];
  }, [gameState]);

  const pointAwarder = (player: Player) => () =>
    !gameOver && addPointTo(player);

  const scoreProps = useCallback(
    (player: Player, score: string) => ({
      onClick: pointAwarder(player),
      style: { cursor: "pointer" },
      children: !gameOver && score,
    }),
    [pointAwarder, gameOver]
  );

  const [serverScore, receiverScore] = [
    formatScore(gameState.server),
    formatScore(gameState.receiver),
  ];
  useWindowTitle(gameOver ? "GAME" : `${serverScore} : ${receiverScore}`);

  const [soundEnabled, setSoundEnabled] = useState(true);
  useGameStateSoundFX(soundEnabled, gameState);
  return (
    <MainContainer>
      <SoundToggler status={soundEnabled} toggle={setSoundEnabled} />
      {/**Empty div for flexbox hacking */}
      <div />
      <Block>
        <ScoreboardSection {...scoreProps("server", serverScore)} />
        <ScoreboardSection>{gameOver ? "GAME" : ":"}</ScoreboardSection>
        <ScoreboardSection {...scoreProps("receiver", receiverScore)} />
      </Block>
      <Block>
        <Button onClick={reset} invisible={gameNotStarted}>
          {gameOver ? "New Game" : "Reset scores"}
        </Button>
      </Block>
    </MainContainer>
  );
}
