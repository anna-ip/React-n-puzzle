import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback
} from "react";
import { useTransition, a } from "react-spring";
import "./Puzzle.css";

// export const Puzzle = () => {
// const [size, setSize] = useState([0, 0]);

const isSolvable = (size, tiles) => {
  let invCount = 0;
  for (let i = 0; i < size * size - 1; i++) {
    for (let j = i + 1; j < size * size; j++) {
      if (tiles[i] && tiles[j] && tiles[i] > tiles[j]) invCount++;
    }
  }
  if (size % 2) {
    return invCount % 2 === 0;
  } else {
    const holeRow = Math.floor(tiles.indexOf(0) / size);
    return size - (holeRow % 2) !== invCount % 2;
  }
};

const useSize = ref => {
  const [size, setSize] = useState([0, 0]);

  const handleResize = useCallback(() => {
    if (ref.current) {
      const { clientWidth: w, clientHeight: h } = ref.current;
      setSize([w, h]);
    }
  }, [ref]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return [size, !!ref.current];
};

//here can the size of the Game board be changed
export const Puzzle = ({ size = 4 }) => {
  const initialTiles = useMemo(() => {
    const [hole, ...rest] = Array(size * size)
      .fill(null)
      .map((_, i) => i);
    return [...rest, hole];
  }, [size]);

  const [tiles, setTiles] = useState([]);

  //   insert some kind of shuffle with button onClick
  useEffect(() => {
    const shuffled = [...initialTiles];
    do {
      shuffled.sort(() => Math.random() - 0.5);
    } while (!isSolvable(size, shuffled));
    setTiles(shuffled);
  }, [initialTiles, size]);

  const [hole, movableTiles] = useMemo(() => {
    const hole = tiles.indexOf(0);
    return [
      hole,
      [
        hole - size,
        hole % size !== size ? hole + 1 : -1,
        hole + size,
        hole % size !== 0 ? hole - 1 : 1
      ].filter(t => t >= 0 && t < size * size)
    ];
  }, [tiles, size]);

  const moveTile = tile => {
    const newTiles = [...tiles];
    newTiles[hole] = tiles[tile];
    newTiles[tile] = 0;
    setTiles(newTiles);
  };

  const isComplete = useMemo(() => {
    return tiles.join(",") === initialTiles.join(",");
  }, [tiles, initialTiles]);

  const gridRef = useRef();
  const [gridSize, gridReady] = useSize(gridRef);

  const [tileWidth, tileHeight] = useMemo(
    () => gridSize.map(dim => dim / size),
    [gridSize, size]
  );

  const transitions = useTransition(
    gridReady
      ? tiles.map((number, i) => ({
          number,
          col: i % size,
          row: Math.floor(i / size)
        }))
      : [],
    item => item.number,
    {
      from: ({ col, row }) => ({ col, row }),
      update: ({ col, row }) => ({ col, row }),
      config: { mass: 1, tension: 400, friction: 30 }
    }
  );

  return (
    <div className="back-ground">
      <div className="board">
        <ul className="grid" ref={gridRef}>
          {transitions.map(
            ({ item: { number }, props: { col, row } }, index) => {
              const isMovable = movableTiles.includes(index);
              console.log(col.interpolate(col => `${col}px`));
              return (
                <a.li
                  key={number}
                  style={{
                    width: tileWidth,
                    height: tileHeight,
                    left: col.interpolate(col => `${col * tileWidth}px`),
                    top: row.interpolate(row => `${row * tileHeight}px`)
                  }}
                  className={number ? "item" : "item hidden"}
                >
                  <button
                    className="number-btn"
                    disabled={isComplete || !isMovable}
                    onclick={e => {
                      e.target.blur();
                      isMovable && moveTile(index);
                    }}
                  >
                    {number}
                  </button>
                </a.li>
              );
            }
          )}
        </ul>
        {isComplete && <h1 className="overlay">Grattis!</h1>}
      </div>
    </div>
  );
};
// };

// export default Puzzle;
