import { useEffect, useRef, useState } from "react";
import hit1 from "url:../../assets/sound/hit1.mp3";
import hit2 from "url:../../assets/sound/hit2.mp3";
import hit3 from "url:../../assets/sound/hit3.mp3";
import hit4 from "url:../../assets/sound/hit4.mp3";
import applauseUrl from "url:../../assets/sound/applause.mp3";
import { GameState, getGameStatus, score } from "../tennisScoring";

const resolveLoadedAudio = (path: string) => {
  const audio = new Audio(path);
  audio.load();
  audio.volume = 0.3;
  return new Promise<HTMLAudioElement>(
    (res) => (audio.onloadeddata = () => res(audio))
  );
};

const hitPaths = [hit1, hit2, hit3, hit4];

export default function useGameStateSoundFX(
  enabled: boolean,
  gameState: GameState
) {
  const [hitSounds, setHitSounds] = useState<HTMLAudioElement[]>([]);
  const [applause, setApplause] = useState<HTMLAudioElement>();

  //load soundeffects
  useEffect(() => {
    Promise.all(hitPaths.map(resolveLoadedAudio)).then(setHitSounds);
    resolveLoadedAudio(applauseUrl).then(setApplause);
  }, []);

  const prevHitIndex = useRef<number>();
  //play hit soundeffect on gamestate change
  useEffect(() => {
    if (
      !enabled ||
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
    //if game is won, play applause
    if (getGameStatus(gameState) === "GAME_OVER" && applause) {
      const applauseDelay = setTimeout(() => applause.play(), 500);
      return () => clearTimeout(applauseDelay);
    }
  }, [gameState, hitSounds, applause]);

  //Announce score
  useEffect(() => {
    const speech = window.speechSynthesis;
    if (!enabled || speech == null) {
      return;
    }
    const announceDelay = setTimeout(() => {
      let scorePresentation = score(gameState);
      const utterance = new SpeechSynthesisUtterance(scorePresentation);
      utterance.volume = 0.2;
      utterance.lang = "en-GB";
      utterance.rate = 1.1;
      speech.speak(utterance);
    }, 1000);
    return () => clearTimeout(announceDelay);
  }, [gameState]);
}
