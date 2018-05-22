import * as React from "react";
import styled from "react-emotion";
import { Button } from "./Button";

const GameOverTextContainer = styled("div")`
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 7;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  & > :not(:first-child) {
    margin-top: 1rem;
  }
`;
interface Props {
  onPlayAgain: () => void;
}

export function GameOverMessage({ onPlayAgain }: Props) {
  return (
    <GameOverTextContainer>
      <div>Game Over 💩</div>
      <Button onClick={onPlayAgain}>Play again 🙅‍♂️</Button>
    </GameOverTextContainer>
  );
}
