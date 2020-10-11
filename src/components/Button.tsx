import React, { ComponentProps } from "react";
import classes from "./Button.css";
export default function Button(
  props: ComponentProps<"button"> & { invisible?: boolean }
) {
  const style = props.invisible ? { ...props.style, opacity: 0 } : props.style;
  return <button className={classes.button} {...props} style={style} />;
}
