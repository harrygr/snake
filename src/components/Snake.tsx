import React from "react";
import { Coords } from "../App";
import { Block } from "./Block";

export interface Props {
  coords: Coords[];
  face: string;
}

export function Snake({ coords, face }: Props) {
  const [head, ...tail] = coords;
  return (
    <>
      <Block
        style={{ left: `${head.x}rem`, bottom: `${head.y}rem`, zIndex: 1 }}
      >
        {face}
      </Block>
      {tail.map((c, i) => (
        <Block
          key={i}
          style={{
            left: `${c.x}rem`,
            bottom: `${c.y}rem`,
            background: "forestgreen",
          }}
        />
      ))}
    </>
  );
}
