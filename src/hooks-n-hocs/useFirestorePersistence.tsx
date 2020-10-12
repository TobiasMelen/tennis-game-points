import firebase from "firebase/app";
import "firebase/firestore";
import { useEffect, useState } from "react";
import { GameState, getGameStatus } from "../tennisScoring";
import { sourcePropEquals } from "../utils";

const firebaseApiKey = process.env.FIREBASE_API_KEY;
const firebaseAppId = process.env.FIREBASE_APP_ID;
const firebaseConfigExists = firebaseApiKey && firebaseAppId;
if (firebaseConfigExists) {
  firebase.initializeApp({
    projectId: firebaseAppId,
    apiKey: firebaseApiKey,
  });
} else {
  console.warn(
    "Firebase environment config is missing, starting project without Firebase, no persistence or sharing will be available"
  );
}

const getGameCollection = () => firebase.firestore().collection("games");

export default function useFirestorePersistence(
  gameState: GameState,
  gameId?: string
) {
  const [firestoreGame, setFirestoreGame] = useState<
    GameState & { id: string }
  >();
  //Attach listener when gameId changes.
  useEffect(() => {
    //If there's a hash and game has no score, load data from firebase
    if (!firebaseConfigExists || !gameId?.length) {
      return;
    }
    const unsub = getGameCollection()
      .doc(gameId)
      .onSnapshot((doc) => {
        //Google has this weird but consistent habit of writing shit code.
        //In this case it's broken type declartions, no way to specify collection type generically.
        const data = doc.data() as GameState;
        data &&
          setFirestoreGame({
            id: doc.id,
            ...data,
          });
      });
    return unsub;
  }, [gameId]);

  //Save data
  useEffect(() => {
    //Do not save data for games yet to start and games where firestore data already matches state.
    if (
      !firebaseConfigExists ||
      getGameStatus(gameState) == "NOT_STARTED" ||
      (firestoreGame && sourcePropEquals(gameState, firestoreGame))
    ) {
      return;
    }
    const collection = getGameCollection();
    if (gameId) {
      collection.doc(gameId).set(gameState);
    } else {
      collection
        .add(gameState)
        .then((res) => setFirestoreGame({ id: res.id, ...gameState }));
    }
  }, [gameState]);
  return firestoreGame;
}
