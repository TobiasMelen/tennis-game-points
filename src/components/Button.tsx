import React, { ComponentProps } from "react";
import classes from "./Button.css";
export default function Button(props: ComponentProps<"button">) {
  return <button className={classes.button} {...props} />;
}
