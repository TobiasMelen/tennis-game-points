import React, { ElementType, useEffect, useMemo } from "react";
import {
  CSSProperties,
  PropsWithChildren,
  useState,
} from "react";

type Props = {
  goingInStyle?: CSSProperties;
  goingOutStyle?: CSSProperties;
  transitionTime: number;
};

export default function transitionChildren<
  InnerProps extends PropsWithChildren<{ style?: CSSProperties }>
>(Component: ElementType<InnerProps>) {
  return ({
    children,
    style,
    goingInStyle,
    goingOutStyle,
    transitionTime,
    ...props
  }: InnerProps & Props) => {
    const [renderChildren, setRenderChildren] = useState(children);
    const [replacingChildren, setReplacingChildren] = useState(false);
    useEffect(() => {
      if (renderChildren === children) {
        const goingInTimer = window.setTimeout(
          () => setReplacingChildren(false),
          transitionTime
        );
        return () => clearTimeout(goingInTimer);
      }
      const goingOutTimer = window.setTimeout(() => {
        setRenderChildren(children);
        setReplacingChildren(true);
      }, transitionTime);
      return () => {
        clearTimeout(goingOutTimer);
      };
    }, [children, renderChildren]);

    const mergedStyle = useMemo(
      () => ({
        ...style,
        ...(renderChildren !== children
          ? goingOutStyle
          : replacingChildren
          ? goingInStyle
          : {}),
      }),
      [renderChildren, children, goingOutStyle, replacingChildren, goingInStyle]
    );

    return (
      //@ts-ignore Yes yes i know different subtype constraint.
      <Component {...props} style={mergedStyle}>
        {renderChildren}
      </Component>
    );
  };
}
