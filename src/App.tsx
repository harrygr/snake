import * as O from "fp-ts/Option";
import * as R from "fp-ts/Record";
import * as Eq from "fp-ts/Eq";
import * as A from "fp-ts/Array";
import * as React from "react";
import { Snake } from "./components/Snake";
import { Food } from "./components/Food";
import { GameOverMessage } from "./components/GameOverMessage";
import { pipe } from "fp-ts/lib/function";

const MOVE_INTERVAL = 150;
const BOARD_WIDTH = 30;
const BOARD_HEIGHT = 30;
const INITIAL_SNAKE_LENGTH = 3;

export interface Point {
  x: number;
  y: number;
}

export type Direction = "U" | "D" | "L" | "R";

const AppContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};

const ArenaStyle: React.CSSProperties = {
  width: "30rem",
  height: "30rem",
  position: "relative",
  background: "peachpuff",
  border: "0.4rem orangered solid",
  margin: "2rem",
};

interface State {
  direction: Direction;
  snakeLocation: Point[];
  foodLocation: Point;
  addSegment: boolean;
  listener: O.Option<number>;
}

type Action =
  | { type: "Move" }
  | { type: "Restart"; listener: number }
  | { type: "SetListener"; id: O.Option<number> }
  | { type: "SetDirection"; direction: Direction };

const initialState = (): State => {
  const centerX = Math.floor(BOARD_WIDTH / 2);
  const centerY = Math.floor(BOARD_HEIGHT / 2);
  const snakeLocation = Array.from({ length: INITIAL_SNAKE_LENGTH }).map(
    (_, i) => ({ x: centerX, y: centerY - i })
  );

  return {
    direction: "U",
    snakeLocation,
    foodLocation: getFoodLocation(snakeLocation),
    addSegment: false,
    listener: O.none,
  };
};

const reducer: React.Reducer<State, Action> = (state, action) => {
  if (action.type === "Move") {
    return moveSnake(state);
  }
  if (action.type === "Restart") {
    return { ...initialState(), listener: O.some(action.listener) };
  }
  if (action.type === "SetListener") {
    return { ...state, listener: action.id };
  }
  if (action.type === "SetDirection") {
    return { ...state, direction: action.direction, directionChanged: true };
  }
  return state;
};

export const App = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState());
  const startMoving = () =>
    setInterval(() => dispatch({ type: "Move" }), MOVE_INTERVAL);

  const startPlay = () => {
    if (O.isSome(state.listener)) {
      return;
    }

    dispatch({
      type: "SetListener",
      id: O.some(startMoving()),
    });
  };

  const stopPlay = () => {
    pipe(
      state.listener,
      O.map((listener) => {
        clearInterval(listener);
        dispatch({ type: "SetListener", id: O.none });
      })
    );
  };

  const setDirection = (e: KeyboardEvent) => {
    pipe(
      getDirection(e.key),
      O.map((direction) => dispatch({ type: "SetDirection", direction }))
    );
  };

  const restartPlay = () => {
    dispatch({
      type: "Restart",
      listener: startMoving(),
    });
  };

  React.useEffect(() => {
    document.body.addEventListener("keydown", setDirection);
    startPlay();
    return () => document.body.removeEventListener("keydown", setDirection);
  }, []);

  const isGameOver = hasEatenItself(state.snakeLocation);

  React.useEffect(() => {
    if (isGameOver) {
      stopPlay();
    }
  }, [isGameOver]);

  return (
    <main className="App" style={AppContainerStyle}>
      <div style={ArenaStyle}>
        <Snake coords={state.snakeLocation} face={isGameOver ? "🙀" : "😈"} />
        <Food location={state.foodLocation} />
        {isGameOver && <GameOverMessage onPlayAgain={restartPlay} />}
      </div>
      Score: {state.snakeLocation.length - INITIAL_SNAKE_LENGTH}
    </main>
  );
};

const nextX = (headX: number, direction: Direction) => {
  return (
    (BOARD_WIDTH +
      (headX + (direction === "R" ? 1 : direction === "L" ? -1 : 0))) %
    BOARD_WIDTH
  );
};
const nextY = (headY: number, direction: Direction) => {
  return (
    (BOARD_HEIGHT +
      (headY + (direction === "U" ? 1 : direction === "D" ? -1 : 0))) %
    BOARD_HEIGHT
  );
};

const moveSnake = ({
  snakeLocation,
  direction,
  addSegment,
  foodLocation,
  listener,
}: State): State => {
  const nextHead = {
    x: nextX(snakeLocation[0].x, direction),
    y: nextY(snakeLocation[0].y, direction),
  };

  const newSnakeLocation = [nextHead]
    .concat(snakeLocation)
    .slice(0, addSegment ? undefined : -1);

  const hasEatenFood = pointEq.equals(nextHead, foodLocation);

  return {
    listener,
    snakeLocation: newSnakeLocation,
    addSegment: hasEatenFood,
    direction,
    foodLocation: hasEatenFood
      ? getFoodLocation(newSnakeLocation)
      : foodLocation,
  };
};

function getDirection(key: KeyboardEvent["key"]) {
  const directions: Record<KeyboardEvent["key"], Direction> = {
    ArrowDown: "D",
    ArrowUp: "U",
    ArrowLeft: "L",
    ArrowRight: "R",
  };

  return R.lookup(key)(directions);
}

function hasEatenItself(snake: Point[]) {
  const [head, ...tail] = snake;
  return containsPoint(head, tail);
}

function getFoodLocation(snakeLocation: Point[]): Point {
  const foodLocation = { x: getPointX(), y: getPointY() };
  if (containsPoint(foodLocation, snakeLocation)) {
    return getFoodLocation(snakeLocation);
  }
  return foodLocation;
}

function getPointX() {
  return Math.floor(Math.random() * BOARD_WIDTH);
}
function getPointY() {
  return Math.floor(Math.random() * BOARD_HEIGHT);
}

const pointEq: Eq.Eq<Point> = Eq.fromEquals(
  (c1, c2) => c1.x === c2.x && c1.y === c2.y
);

const containsPoint = A.elem(pointEq);
