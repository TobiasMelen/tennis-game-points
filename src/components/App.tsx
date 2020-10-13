import React, { useCallback, useEffect, useMemo, useState } from "react";
import useFirestorePersistence from "../hooks-n-hocs/useFirestorePersistence";
import useGameRouting from "../hooks-n-hocs/useGameRouting";
import useGameStateSoundFX from "../hooks-n-hocs/useGameStateSoundFX";
import useReducerDispatch from "../hooks-n-hocs/useReducerDispatch";
import useShallowComparedState from "../hooks-n-hocs/useShallowComparedState";
import useWindowTitle from "../hooks-n-hocs/useWindowTitle";
import {
  GameScore,
  GameState,
  getGameStatus,
  Player,
  pointWonBy,
} from "../tennisScoring";
import Block from "./Block";
import Button, { FadingButton } from "./Button";
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
  //state of game
  const [gameState, setGameState] = useShallowComparedState(initialScores);
  //dispatch to reducing by pointWonBy
  const addPointTo = useReducerDispatch(pointWonBy, setGameState);
  //routed id of game, set by firebase
  const [gameId, setGameId] = useGameRouting();
  //if user navigates away from all games, reset score
  useEffect(() => {
    if (gameId == null) {
      setGameState(initialScores);
    }
  }, [gameId]);
  //persist gamestate to firebase game collection
  const [firestoreId, firestoreGame] = useFirestorePersistence(
    "games",
    gameState,
    gameId,
    () =>
      //don't save state if games not started and i'ts not connected yet
      !gameNotStarted && !gameId
  );

  //update game if firestore brings new info
  useEffect(() => {
    firestoreGame && setGameState(firestoreGame);
    firestoreId && setGameId(firestoreId);
  }, [firestoreGame, firestoreId]);

  //make booleans of gamestatus for less clutter later
  const [gameOver, gameNotStarted] = useMemo(() => {
    const status = getGameStatus(gameState);
    return [status === "GAME_OVER", status === "NOT_STARTED"];
  }, [gameState]);

  //Props for scoreboard components
  const scoreProps = useCallback(
    (player: Player, score: string) => ({
      onClick: () => !gameOver && addPointTo(player),
      style: { cursor: "pointer" },
      children: !gameOver && score,
    }),
    [addPointTo, gameOver]
  );

  //Score formatted for display. Why I didn't just have strings in the state from the get go? Very good question.
  const [serverScore, receiverScore] = [
    formatScore(gameState.server),
    formatScore(gameState.receiver),
  ];

  //Set gamestate to title of window
  useWindowTitle(gameOver ? "GAME" : `${serverScore} : ${receiverScore}`);

  //FX
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
        <FadingButton
          onClick={() => setGameState(initialScores)}
          invisible={gameNotStarted}
        >
          {gameOver ? "Reset Game" : "Reset Scores"}
        </FadingButton>
      </Block>
    </MainContainer>
  );
}
