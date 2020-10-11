import React, {
  ComponentProps,
  CSSProperties,
  PropsWithChildren,
  useCallback,
  useMemo,
} from "react";
import transitionChildren from "../hooks-n-hocs/transitionChildren";
import useGameStateSoundFX from "../hooks-n-hocs/useGameStateSoundFX";
import useResettableReducer from "../hooks-n-hocs/useResettableReducer";
import useWindowTitle from "../hooks-n-hocs/useWindowTitle";
import { GameScore, isGameOngoing, Player, pointWonBy } from "../tennisScoring";
import Block from "./Block";
import Button from "./Button";
import MainContainer from "./MainContainer";

const cutoutTextStyle: CSSProperties = {
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  fontSize: "15em",
  textShadow: "3px 3px 3px white",
  backgroundColor: "#aaa",
  fontWeight: 900,
  fontFamily: "monospace",
  WebkitTextStroke: "1px #eee",
  transition: "opacity 100ms linear, transform 100ms linear",
};

const LazyHeader = transitionChildren("h1");

const ScoreboardSection = (props: ComponentProps<"h1">) => {
  return (
    <LazyHeader
      transitionTime={100}
      style={{ ...cutoutTextStyle, minWidth: "1.5em", cursor: "pointer" }}
      goingInStyle={{ opacity: 0, transform: "translateY(-40px)" }}
      goingOutStyle={{ opacity: 0, transform: "translateY(40px)" }}
      {...props}
    />
  );
};

const hasPadStart = "padStart" in new String();
const formatScore = (score: GameScore) =>
  typeof score === "number" && hasPadStart
    ? new String(score).padStart(2, "0")
    : score;

export default function App() {
  const [scores, addPointTo, reset] = useResettableReducer(pointWonBy, {
    Server: 0,
    Receiver: 0,
  });
  useGameStateSoundFX(scores);
  const gameOver = useMemo(() => !isGameOngoing(scores), [scores]);
  useWindowTitle(gameOver ? "GAME" : `${scores.Server} : ${scores.Receiver}`);
  const pointAwarder = (player: Player) => () =>
    !gameOver && addPointTo(player);
  return (
    <MainContainer>
      <Block>
        {gameOver ? (
          <h1 style={cutoutTextStyle}>GAME</h1>
        ) : (
          <>
            <ScoreboardSection onClick={pointAwarder("Server")}>
              {formatScore(scores.Server)}
            </ScoreboardSection>
            <h1 style={cutoutTextStyle}>{":"}</h1>
            <ScoreboardSection onClick={pointAwarder("Receiver")}>
              {formatScore(scores.Receiver)}
            </ScoreboardSection>
          </>
        )}
      </Block>
      <Block>
        <Button onClick={reset}>
          {gameOver ? "New Game" : "Reset scores"}
        </Button>
      </Block>
    </MainContainer>
  );
}
