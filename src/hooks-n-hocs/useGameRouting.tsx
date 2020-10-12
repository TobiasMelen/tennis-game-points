import { useEffect, useState } from "react";

const retrieveRoutedGame = () => {
  const match = location.hash.match(/^#game\/(\w+)$/);
  return match?.[1];
};
const setRoutedGame = (gameId?: string) => (location.hash = gameId ? `game/${gameId}` : "");

export default function useGameRouting() {
  const [game, setGame] = useState(retrieveRoutedGame());
  useEffect(() => {
    addEventListener("hashchange", () => {
      setGame(retrieveRoutedGame());
    });
  }, []);
  return [game, setRoutedGame] as const;
}
