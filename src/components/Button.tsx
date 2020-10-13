import React, { ComponentProps } from "react";
import transitionChildren from "../hooks-n-hocs/transitionChildren";
import classes from "./Button.css";
export default function Button({
  invisible,
  ...props
}: ComponentProps<"button"> & { invisible?: boolean }) {
  const style = invisible ? { ...props.style, opacity: 0 } : props.style;
  return <button className={classes.button} {...props} style={style} />;
}

export const FadingButton = transitionChildren(Button, {
  transitionTime: 100,
  goingInStyle: { opacity: 1 },
  goingOutStyle: { opacity: 0 },
});
