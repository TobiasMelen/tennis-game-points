import React from "react";
import { ComponentProps } from "react";
import css from "./MainContainer.css";

export default function MainContainer(props: ComponentProps<"main">) {
  return <main className={css.main} {...props} />;
}
