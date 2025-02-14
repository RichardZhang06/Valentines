import { useState, useEffect, useRef, useCallback } from "react";

export default function MovableCat() {
  const [position, setPosition] = useState({
    x: 0,
    y: window.innerHeight - 128, // Start at the bottom-left corner
  });
  const [bombs, setBombs] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const keysPressed = useRef({});
  const requestRef = useRef(null);

  const catSize = 128; // Cat size in pixels
  const bombSize = 40; // Bomb size in pixels

  // Moves the cat and keeps it within the viewport
  const moveCat = (dx, dy) => {
    setPosition((prev) => {
      const newX = Math.min(
        Math.max(prev.x + dx, 0),
        window.innerWidth - catSize
      );
      const newY = Math.min(
        Math.max(prev.y + dy, 0),
        window.innerHeight - catSize
      );
      return { x: newX, y: newY };
    });
  };

  // Creates 3 bombs at random horizontal positions at the top
  const createBombs = () => {
    const bombsToCreate = [];
    for (let i = 0; i < 3; i++) {
      const x = Math.random() * (window.innerWidth - bombSize);
      bombsToCreate.push({ x, y: 0 });
    }
    setBombs((prevBombs) => [...prevBombs, ...bombsToCreate]);
  };

  // Setup key event listeners for movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;
    };
    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Collision detection using axis-aligned bounding boxes
  const checkCollision = (bombList) => {
    for (let bomb of bombList) {
      if (
        position.x < bomb.x + bombSize &&
        position.x + catSize > bomb.x &&
        position.y < bomb.y + bombSize &&
        position.y + catSize > bomb.y
      ) {
        console.log("Collision detected!");
        setGameOver(true);
        return true;
      }
    }
    return false;
  };

  // Update loop: moves the cat and bombs
  const updatePosition = useCallback(() => {
    if (gameOver) return; // Stop updates if game is over

    const movementSpeed = 3;
    let dx = 0,
      dy = 0;
    if (keysPressed.current["ArrowUp"]) dy -= movementSpeed;
    if (keysPressed.current["ArrowDown"]) dy += movementSpeed;
    if (keysPressed.current["ArrowLeft"]) dx -= movementSpeed;
    if (keysPressed.current["ArrowRight"]) dx += movementSpeed;

    if (dx !== 0 || dy !== 0) {
      moveCat(dx, dy);
    }

    // Update bombs: move them down and filter off-screen bombs
    setBombs((prevBombs) => {
      const updatedBombs = prevBombs
        .map((bomb) => ({ ...bomb, y: bomb.y + 6 })) // Increased speed of falling bombs
        .filter((bomb) => bomb.y < window.innerHeight);
      // Check for collision using updated bomb positions
      checkCollision(updatedBombs);
      return updatedBombs;
    });

    requestRef.current = requestAnimationFrame(updatePosition);
  }, [gameOver, position]);

  // Run the update loop
  useEffect(() => {
    requestRef.current = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(requestRef.current);
  }, [updatePosition]);

  // Separate effect to create bombs every 2 seconds (2000ms)
  useEffect(() => {
    const bombInterval = setInterval(createBombs, 2000); // Increased interval for slower bomb spawn
    return () => clearInterval(bombInterval);
  }, []); // Runs only once on mount

  // Restart game handler
  const restartGame = () => {
    setPosition({ x: 0, y: window.innerHeight - 128 }); // Reset to bottom-left
    setBombs([]);
    setGameOver(false);
  };

  return (
    <div
      className="relative w-screen h-screen bg-gray-200"
      style={{ overflow: "hidden" }}
    >
      {/* Labels at the top */}
      <div className="absolute top-4 left-4 text-red-500 font-bold text-xl">
        <p>Will you be my Valentine?</p>
      </div>
      <div className="absolute top-4 right-4 text-red-500 font-bold text-xl">
        <p>bomb = yes</p>
      </div>

      <div
        className="absolute"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/1864/1864514.png"
          alt="Cat Avatar"
          className="w-32 h-32"
        />
      </div>

      {bombs.map((bomb, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            transform: `translate(${bomb.x}px, ${bomb.y}px)`,
            width: `${bombSize}px`,
            height: `${bombSize}px`,
            backgroundColor: "black",
            borderRadius: "50%",
          }}
        />
      ))}

      {gameOver && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="text-4xl font-bold text-red-500">YAYYY!</h1>
          <button
            onClick={restartGame}
            className="mt-4 py-2 px-6 bg-pink-500 text-white rounded-lg hover:bg-pink-400"
          >
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
}
