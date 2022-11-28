import * as React from "react";

import { Button } from "./Button";

const GameOverTextContainerStyle: React.CSSProperties = {
  position: "absolute",
  left: "50%",
  top: "50%",
  zIndex: 7,
  transform: "translate(-50%, -50%)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  // & > :not(:first-child) {
  //   margin-top: 1rem;
  // }
};
interface Props {
  onPlayAgain: () => void;
}

export function GameOverMessage({ onPlayAgain }: Props) {
  return (
    <div style={GameOverTextContainerStyle}>
      <div>Game Over 💩</div>
      <Button onClick={onPlayAgain}>Play again 🙅‍♂️</Button>
    </div>
  );
}
