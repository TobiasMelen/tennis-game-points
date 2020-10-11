import React from "react";
import { ComponentProps } from "react";
import transitionChildren from "../hooks-n-hocs/transitionChildren";
import css from "./ScoreboardSection.css";

function ScoreboardSection(props: ComponentProps<"div">) {
  return <div className={css.scoreboardSection} {...props} />;
}

export default transitionChildren(ScoreboardSection, {
  transitionTime: 110,
  goingInStyle: { opacity: 0, transform: "translateY(-40px)" },
  goingOutStyle: { opacity: 0, transform: "translateY(40px)" },
});
