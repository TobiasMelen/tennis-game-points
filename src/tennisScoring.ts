import { assertThisWillNeverHappen } from "./utils";

//typings

/**  Union of all possible player scores */
export type GameScore = 0 | 15 | 30 | 40 | "AD" | "GAME";

/** Game state for a tennis game */
export type GameState = {
  Server: GameScore;
  Receiver: GameScore;
};

/** Game state validated as ongoing (no one has won yet) */
export type OngoingGameState = {
  [P in keyof GameState]: Exclude<GameScore, "GAME">;
};

/** Index number for Player. 1 or 2.*/
export type Player = keyof GameState;

//end typings, runtime js below.

/** Validate that game is ongoing and remove "GAME" as possible score value */
export const isGameOngoing = (
  gameState: GameState
): gameState is OngoingGameState =>
  Object.values(gameState).every((score) => score !== "GAME");

/** Get opponent role for player, this func is banking it on 3 person tennis never happening */
export const opponentOf = (player: Player): Player =>
  player === "Server" ? "Receiver" : "Server";

/** Increment score by one point for selected player */
export const pointWonBy = (gameState: GameState, player: Player) => {
  if (!isGameOngoing(gameState)) {
    throw new Error(
      `Cannot increment score for player ${player}, Game is already completed. Please start a new Game.`
    );
  }
  const otherPlayer = opponentOf(player);
  //Local util to create new score for scoring player, or both players, with less syntax clutter.
  const newScore = (
    scoringPlayerScore: GameScore,
    otherPlayerScore?: GameScore
  ) =>
    ({
      [player]: scoringPlayerScore,
      [otherPlayer]: otherPlayerScore ?? gameState[otherPlayer],
    } as GameState);

  const currentScore = gameState[player];
  switch (currentScore) {
    case 0:
      return newScore(15);
    case 15:
      return newScore(30);
    case 30:
      return newScore(40);
    case 40: {
      //When adding point to score beyond 40, the other players current score affects scoring outcome.
      switch (gameState[otherPlayer]) {
        case 40:
          return newScore("AD");
        case "AD":
          return newScore(40, 40);
        default:
          return newScore("GAME");
      }
    }
    case "AD":
      return newScore("GAME");
    default:
      //Typescript needs a return here, appearantly
      return assertThisWillNeverHappen(currentScore);
  }
};

//Stateful class implementation which I will never use for anything
export class TennisGame {
  #gamestate: GameState;
  constructor(initalState: GameState) {
    this.#gamestate = initalState;
  }
  pointWonBy(player: Player) {
    this.#gamestate = pointWonBy(this.#gamestate, player);
  }
}
