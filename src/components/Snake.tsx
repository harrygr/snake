import React from "react";
import { Point } from "../App";
import { Block } from "./Block";

export interface Props {
  coords: Point[];
  face: string;
}

export function Snake({ coords, face }: Props) {
  const [head, ...tail] = coords;
  return (
    <>
      <Block
        style={{
          left: `${head.x}rem`,
          bottom: `${head.y}rem`,
          zIndex: 1,
        }}
      >
        {face}
      </Block>
      {tail.map((c) => (
        <Block
          key={`${c.x}-${c.y}`}
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
