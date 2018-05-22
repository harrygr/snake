import * as React from "react";
import styled from "react-emotion";
import { Coords } from "src/App";
import { Block } from "src/components/Block";

export interface Props {
  coords: Coords[];
  face: string;
}

const Segment = styled(Block)`
  background: forestgreen;
`;

const Head = styled(Block)`
  z-index: 1;
`;

export function Snake({ coords, face }: Props) {
  const [head, ...tail] = coords;
  return (
    <>
      <Head style={{ left: `${head.x}rem`, bottom: `${head.y}rem` }}>
        {face}
      </Head>
      {tail.map((c, i) => (
        <Segment key={i} style={{ left: `${c.x}rem`, bottom: `${c.y}rem` }} />
      ))}
    </>
  );
}
