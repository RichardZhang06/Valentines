import { Link } from "react-router-dom";

const HomeScreen = () => {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen relative"
      style={{
        background: "linear-gradient(to right, #FBCFE8, #F472B6, #EC4899)", // Custom pink gradient
      }}
    >
      <div className="text-center px-6 md:px-12 z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-xl">
          💖 Welcome to Cat & Bombs! 💖
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8 font-medium">
          A fun Valentine's Day game where you dodge bombs with your cat!
        </p>

        <Link
          to="/game"
          className="bg-white text-pink-600 py-4 px-8 rounded-full text-3xl font-semibold transition duration-300 ease-in-out transform hover:bg-pink-100 hover:text-red-500 hover:scale-105 shadow-xl hover:shadow-2xl"
        >
          Start Game
        </Link>

        {/* Heart Emoji with Pulse Animation */}
        <div className="mt-12 animate-pulse text-6xl">
          ❤️
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
