import { useEffect } from "react";

export default function useWindowTitle(title: string) {
  useEffect(() => {
    window.document.title = title;
  }, [title]);
}
