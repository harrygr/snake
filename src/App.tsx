import { Option, None } from "catling";
import * as React from "react";
import styled from "react-emotion";
import { Snake } from "./components/Snake";
import { Food } from "src/components/Food";
import { GameOverMessage } from "./components/GameOverMessage";

export interface Coords {
  x: number;
  y: number;
}

export type Direction = "U" | "D" | "L" | "R";

interface State {
  direction: Direction;
  snakeLocation: Coords[];
  foodLocation: Coords;
  addSegment: boolean;
  listener: Option<NodeJS.Timer>;
  gameOver: boolean;
}

const AppContainer = styled("div")`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
}
`;

const Arena = styled("div")`
  width: 30rem;
  height: 30rem;
  position: relative;
  background: peachpuff;
  border: 0.4rem orangered solid;
  margin: 2rem;
`;

const loop = (val: number) => {
  if (val > 29) {
    return 0;
  }
  if (val < 0) {
    return 29;
  }

  return val;
};

function initialState(): State {
  return {
    direction: "U",
    snakeLocation: [{ x: 15, y: 15 }, { x: 15, y: 14 }, { x: 15, y: 13 }],
    foodLocation: { x: getPoint(), y: getPoint() },
    addSegment: false,
    listener: None(),
    gameOver: false
  };
}

class App extends React.Component<{}, State> {
  public state: State = initialState();

  componentDidMount() {
    document.body.addEventListener("keydown", this.setDirection);
    this.startPlay();
  }

  startPlay = () => {
    this.setState({
      listener: Option(setInterval(this.move, 150))
    });
  };

  stopPlay = () => {
    this.state.listener.map(clearInterval);
    this.setState({ listener: None() });
  };

  restartPlay = () => {
    this.setState(initialState(), this.startPlay);
  };
  eatFood = () => {
    this.setState({
      addSegment: true,
      foodLocation: getFoodLocation(this.state.snakeLocation)
    });
  };

  public move = () => {
    const { direction, snakeLocation, addSegment, foodLocation } = this.state;

    const nextHead = {
      x: loop(
        snakeLocation[0].x +
          (direction === "R" ? 1 : direction === "L" ? -1 : 0)
      ),
      y: loop(
        snakeLocation[0].y +
          (direction === "U" ? 1 : direction === "D" ? -1 : 0)
      )
    };

    const newSnakeLocation = [nextHead]
      .concat(snakeLocation)
      .slice(0, addSegment ? undefined : -1);

    if (hasEatenItself(newSnakeLocation)) {
      this.stopPlay();
      this.setState({ gameOver: true });
      return;
    }
    this.setState({
      snakeLocation: newSnakeLocation,
      addSegment: false
    });

    if (nextHead.x === foodLocation.x && nextHead.y === foodLocation.y) {
      this.eatFood();
    }
  };

  setDirection = (e: KeyboardEvent) => {
    getDirection(e.key).map(direction => {
      this.setState({
        direction
      });
    });
  };

  public render() {
    return (
      <AppContainer className="App">
        <Arena>
          <Snake
            coords={this.state.snakeLocation}
            face={this.state.gameOver ? "🙀" : "😈"}
          />
          <Food location={this.state.foodLocation} />
          {this.state.gameOver && (
            <GameOverMessage onPlayAgain={this.restartPlay} />
          )}
        </Arena>
        Score: {this.state.snakeLocation.length - 3}
      </AppContainer>
    );
  }
}

export default App;

function getDirection(key: KeyboardEvent["key"]) {
  const directions: Record<KeyboardEvent["key"], Direction> = {
    ArrowDown: "D",
    ArrowUp: "U",
    ArrowLeft: "L",
    ArrowRight: "R"
  };

  return Option(directions[key]);
}

function hasEatenItself(snake: Coords[]) {
  const [head, ...tail] = snake;
  return tail.some(isSameCoords(head));
}

function getFoodLocation(snakeLocation: Coords[]): Coords {
  const foodLocation = { x: getPoint(), y: getPoint() };
  if (snakeLocation.some(isSameCoords(foodLocation))) {
    return getFoodLocation(snakeLocation);
  }
  return foodLocation;
}

function getPoint() {
  return Math.floor(Math.random() * 30);
}

function isSameCoords(c1: Coords) {
  return (c2: Coords) => c1.x === c2.x && c1.y === c2.y;
}
