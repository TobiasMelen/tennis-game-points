import { useEffect, useMemo, useState } from "react";
import { sourcePropEquals } from "../utils";

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const FIREBASE_APP_ID = process.env.FIREBASE_APP_ID;

export default function useFirestorePersistence<TState>(
  collection: string,
  state: TState,
  id?: string,
  shouldUpdate = (prevState?: TState) =>
    !prevState || !sourcePropEquals(state, prevState)
) {
  //Firebase JS is huuge (or, in fairness to all, it might be parcels tree-shaking not being great)
  //Anyway, in no way are we loading this chonk upfront.
  const [firebase, setFirebase] = useState<typeof import("firebase")>();
  useEffect(() => {
    const missingConfig = [
      !FIREBASE_API_KEY && "FIREBASE_API_KEY",
      !FIREBASE_APP_ID && "FIREBASE_APP_ID",
    ].filter((missing) => missing) as string[];
    if (missingConfig.length) {
      console.warn(
        `Firebase environment config value/s: ${missingConfig.join(
          ", "
        )} are missing. 
        Starting project without Firebase, no persistence or sharing will be available`
      );
      return;
    }
    //import async if all config values exists
    import("./firebasePackage").then(({ default: firebase }) => {
      firebase.initializeApp({
        projectId: FIREBASE_APP_ID,
        apiKey: FIREBASE_API_KEY,
      });
      setFirebase(firebase);
    });
  }, [FIREBASE_APP_ID, FIREBASE_API_KEY]);

  const [firestoreData, setFirestoreData] = useState<TState>();
  const [firestoreId, setFirestoreId] = useState<string>();
  const getCollection = useMemo(
    () => firebase && (() => firebase.firestore().collection(collection)),
    [firebase, collection]
  );
  //Attach listener when gameId changes.
  useEffect(() => {
    //If there's a hash and game has no score, load data from firebase
    if (getCollection == null || !id?.length) {
      return;
    }
    const unsub = getCollection()
      .doc(id)
      .onSnapshot((doc) => {
        //Broken type declartions, no way to specify collection type generically.
        const data = doc.data() as TState;

        data &&
          //Half-hearted attempt to avoid data races which does not solve the issue
          //I'm missing the moral fortitude to solve this correctly.
          !doc.metadata.hasPendingWrites &&
          setFirestoreData(data);
      });
    return unsub;
  }, [id, getCollection]);

  //Save data
  useEffect(() => {
    if (!getCollection || !shouldUpdate(firestoreData)) {
      return;
    }
    const stateCollection = getCollection();
    if (id) {
      stateCollection.doc(id).set(state);
    } else {
      stateCollection.add(state).then((res) => {
        setFirestoreId(res.id);
      });
    }
  }, [state, getCollection]);
  return [firestoreId, firestoreData] as const;
}
