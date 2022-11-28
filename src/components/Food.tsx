import React from "react";
import { Coords } from "../App";
import { Block } from "./Block";

interface Props {
  location: Coords;
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
