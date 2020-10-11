import { useEffect, useRef, useState } from "react";
import hit1 from "url:../../assets/sound/hit1.mp3";
import hit2 from "url:../../assets/sound/hit2.mp3";
import hit3 from "url:../../assets/sound/hit3.mp3";
import hit4 from "url:../../assets/sound/hit4.mp3";
import { GameState } from "../tennisScoring";

const hitPaths = [hit1, hit2, hit3, hit4];

export default function useGameStateSoundFX(gameState: GameState) {
  const [hitSounds, setHitSounds] = useState<HTMLAudioElement[]>([]);

  //load soundeffects
  useEffect(() => {
    Promise.all(
      hitPaths.map((path) => {
        const audio = new Audio(path);
        audio.load();
        audio.volume = 0.3
        return new Promise<HTMLAudioElement>(
          (res) => (audio.onloadeddata = () => res(audio))
        );
      })
    ).then(setHitSounds);
  }, []);

  const prevHitIndex = useRef<number>();
  //play hit soundeffect on gamestate change
  useEffect(() => {
    if (
      hitSounds.length === 0 ||
      Object.values(gameState).every((val) => val === 0)
    ) {
      return;
    }
    //find random non repeating hit sound.
    const hitIndex = (function findHit(): number {
      const suggest = Math.floor(Math.random() * hitSounds.length);
      if (suggest !== prevHitIndex.current) {
        prevHitIndex.current = suggest;
        return suggest;
      }
      return findHit();
    })();
    hitSounds[hitIndex].play();
  }, [gameState, hitSounds]);
}
