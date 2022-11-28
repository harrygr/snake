import * as React from "react";

const BlockStyle: React.CSSProperties = {
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "1rem",
  width: "1rem",
};

export const Block = ({ style, ...props }: React.ComponentProps<"span">) => (
  <span {...props} style={{ ...BlockStyle, ...style }} />
);
