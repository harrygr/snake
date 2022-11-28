import * as React from "react";

const ButtonStyle: React.CSSProperties = {
  background: "powderblue",
  border: "0.25rem steelblue solid",
  cursor: "pointer",
  padding: "1rem 2rem",
  fontSize: "1rem",
  borderRadius: "1rem",
};

export const Button = ({ style, ...props }: React.ComponentProps<"button">) => (
  <button {...props} style={{ ...style, ...ButtonStyle }} />
);
