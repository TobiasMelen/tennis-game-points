import React, {
  ComponentProps,
  CSSProperties,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from "react";
import transitionChildren from "../hooks-n-hocs/transitionChildren";
import useGameStateSoundFX from "../hooks-n-hocs/useGameStateSoundFX";
import useResettableReducer from "../hooks-n-hocs/useResettableReducer";
import useWindowTitle from "../hooks-n-hocs/useWindowTitle";
import { GameScore, getGameStatus, Player, pointWonBy } from "../tennisScoring";
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

export default function App() {
  const [scores, addPointTo, reset] = useResettableReducer(pointWonBy, {
    Server: 0,
    Receiver: 0,
  });

  const [gameOver, gameNotStarted] = useMemo(() => {
    const status = getGameStatus(scores);
    return [status === "GAME_OVER", status === "NOT_STARTED"];
  }, [scores]);

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
    formatScore(scores.Server),
    formatScore(scores.Receiver),
  ];
  useWindowTitle(gameOver ? "GAME" : `${serverScore} : ${receiverScore}`);

  const [soundEnabled, setSoundEnabled] = useState(true);
  useGameStateSoundFX(soundEnabled, scores);
  return (
    <MainContainer>
      <SoundToggler status={soundEnabled} toggle={setSoundEnabled} />
      {/**Empty div for flexbox hacking */}
      <div />
      <Block>
        <ScoreboardSection {...scoreProps("Server", serverScore)} />
        <ScoreboardSection>{gameOver ? "GAME" : ":"}</ScoreboardSection>
        <ScoreboardSection {...scoreProps("Receiver", receiverScore)} />
      </Block>
      <Block>
        <Button onClick={reset} invisible={gameNotStarted}>
          {gameOver ? "New Game" : "Reset scores"}
        </Button>
      </Block>
    </MainContainer>
  );
}
