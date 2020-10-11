import React from "react";

type Props = {
  status: boolean;
  toggle(status: boolean): void;
};

export default function SoundToggler(props: Props) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        paddingTop: 10,
        paddingRight: 15,
        fontSize: "2.2em",
        cursor: "pointer",
        opacity: 0.75,
      }}
      onClick={() => props.toggle(!props.status)}
    >
      {props.status ? "😮" : "🤐"}
    </div>
  );
}
