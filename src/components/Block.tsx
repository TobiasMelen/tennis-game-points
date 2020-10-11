import React, { ComponentProps } from "react";
import css from "./Block.css";

export default function Block(props: ComponentProps<"section">) {
  return <section className={css.block} {...props} />;
}
