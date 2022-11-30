import React from "react";
import { Point } from "../App";
import { Block } from "./Block";

interface Props {
  location: Point;
}

export function Food({ location }: Props) {
  return (
    <Block
      style={{
        left: `${location.x}rem`,
        bottom: `${location.y}rem`,
        background: "transparent",
      }}
    >
      🍔
    </Block>
  );
}
