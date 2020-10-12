import test from "ava";
import {
  GameScore,
  GameState,
  opponentOf,
  Player,
  pointWonBy,
  score,
} from "./tennisScoring";

//Opponent brainfart tests
test("receiver is opponent to server", (t) =>
  t.assert(opponentOf("receiver") === "server"));
test("server is opponent to receiver", (t) =>
  t.assert(opponentOf("server") === "receiver"));

//Factory HoF to create pointwinner for specified player from provided state.
const pointWinForPlayer = (player: Player) => (
  playerScore: GameScore,
  otherPlayerScore: GameScore
) => {
  const otherPlayer = opponentOf(player);
  return pointWonBy(
    {
      [player]: playerScore,
      [otherPlayer]: otherPlayerScore,
    } as GameState,
    player
  );
};

//Scoring tests, run for both players.
for (const player of ["server", "receiver"] as const) {
  const playerPointWinAt = pointWinForPlayer(player);
  const basicIncrementTest = (
    currentScore: GameScore,
    expectedScore: GameScore
  ) =>
    test(`${currentScore} score is incremented to ${expectedScore} for player ${player}`, (t) => {
      const score = playerPointWinAt(currentScore, 0);
      t.is(
        score[player],
        expectedScore,
        `Scoring point at "${currentScore}" should result in "${expectedScore}" score`
      );
    });

  basicIncrementTest(0, 15);
  basicIncrementTest(15, 30);
  basicIncrementTest(30, 40);
  basicIncrementTest(40, "GAME");
  basicIncrementTest("AD", "GAME");

  test(`Scoring at 40 with other player at 40 results in advantage (AD) for player ${player}`, (t) => {
    const score = playerPointWinAt(40, 40);
    t.is(score[player], "AD");
  });

  test(`Scoring by player ${player} at 40 with other player in advantage results in deuce (40, 40)`, (t) => {
    const score = playerPointWinAt(40, "AD");
    t.assert(Object.values(score).every((value) => value === 40));
  });

  test(`Scoring by player ${player} when either player is in GAME is exceptional`, (t) => {
    t.throws(() => playerPointWinAt("GAME", 0));
    t.throws(() => playerPointWinAt(0, "GAME"));
  });
}

//Score presentaion tests
test("Scores are presented in correct order", (t) => {
  t.is(score({ server: 30, receiver: 15 }), "thirty fifteen");
  t.is(score({ server: 0, receiver: 40 }), "love forty");
});

test("Deuce is presented as deuce", (t) => {
  t.is(score({ server: 40, receiver: 40 }), "deuce");
});

test("Single player presentation is correct", (t) => {
  t.is(score({ server: "AD", receiver: 0 }), "advantage, server");
  t.is(score({ server: 0, receiver: "GAME" }), "game, receiver");
});
