import * as React from "react";
import { Coords } from "src/App";
import { Block } from "src/components/Block";
import styled from "react-emotion";

interface Props {
  location: Coords;
}

const FoodBox = styled(Block)`
  background: transparent;
`;

export function Food({ location }: Props) {
  return (
    <FoodBox style={{ left: `${location.x}rem`, bottom: `${location.y}rem` }}>
      🍔
    </FoodBox>
  );
}
