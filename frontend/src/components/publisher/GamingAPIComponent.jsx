import React, { useState, useEffect } from "react";
import { Star, List, Grid } from "lucide-react";
import Navbar from "../navbar/Navbar";

const GamingAPIComponent = () => {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [viewMode, setViewMode] = useState("grid");

  // Color palette
  const colors = {
    background: "#EFF5F5",
    secondaryBg: "#D6E4E5",
    primary: "#497174",
    accent: "#EB6440",
    white: "#FFFFFF",
    black: "#000000"
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://api.rawg.io/api/games?page_size=50&ordering=-added&key=3d02fb394f4845d8ab49066b17433a46");
        
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        
        const data = await response.json();
        setGames(data.results);
      } catch (err) {
        setError("Failed to fetch data from the API.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchGames();
  }, []);

  const sortGames = (method) => {
    setSortBy(method);
    let sortedGames = [...games];
    switch (method) {
      case "name":
        sortedGames.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "rating":
        sortedGames.sort((a, b) => b.rating - a.rating);
        break;
      case "release":
        sortedGames.sort((a, b) => new Date(b.released) - new Date(a.released));
        break;
      default:
        sortedGames.sort((a, b) => (b.metacritic || 0) - (a.metacritic || 0));
        break;
    }
    setGames(sortedGames);
  };

  const toggleView = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: colors.background }}>
        <div className="flex flex-col items-center p-8 rounded-xl shadow-lg" style={{ backgroundColor: colors.white }}>
          <div className="w-16 h-16 border-4 border-t-4 rounded-full animate-spin" 
               style={{ borderColor: colors.secondaryBg, borderTopColor: colors.accent }}></div>
          <p className="mt-6 text-xl font-medium" style={{ color: colors.primary }}>Loading the top games...</p>
          <p className="mt-2 text-sm" style={{ color: colors.primary }}>Getting the latest data for you</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="p-10 rounded-xl shadow-xl max-w-md w-full" style={{ backgroundColor: colors.white }}>
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full" style={{ backgroundColor: colors.secondaryBg }}>
            <span className="text-3xl" style={{ color: colors.accent }}>!</span>
          </div>
          <p className="text-center font-bold text-xl mb-4" style={{ color: colors.accent }}>{error}</p>
          <p className="text-center mb-6" style={{ color: colors.primary }}>We couldn't connect to our game database. Please try again later.</p>
          <button 
            className="py-3 px-6 rounded-lg text-white font-medium w-full transition-all duration-300 hover:shadow-lg"
            style={{ backgroundColor: colors.accent }}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <Navbar />
        <header className="mt-12 py-10 shadow-md" style={{ backgroundColor: colors.primary }}>
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center" style={{ color: colors.white }}>Top 50 Most Rated Games</h1>
            <p className="text-center mt-3 text-lg" style={{ color: colors.secondaryBg }}>Top Rated Games by Metacritic Website</p>
          </div>
        </header>

        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <div className="w-full md:w-auto">
              <span className="text-lg font-medium block md:inline mb-2 md:mb-0 md:mr-3" style={{ color: colors.primary }}>Sort by:</span>
              <div className="inline-flex rounded-lg shadow-md overflow-hidden">
                <button 
                  className="px-5 py-3 text-sm font-medium transition-colors duration-200"
                  style={{ 
                    backgroundColor: sortBy === "popularity" ? colors.accent : colors.white,
                    color: sortBy === "popularity" ? colors.white : colors.primary 
                  }}
                  onClick={() => sortGames("popularity")}
                >
                  Popularity
                </button>
                <button 
                  className="px-5 py-3 text-sm font-medium transition-colors duration-200"
                  style={{ 
                    backgroundColor: sortBy === "rating" ? colors.accent : colors.white,
                    color: sortBy === "rating" ? colors.white : colors.primary 
                  }}
                  onClick={() => sortGames("rating")}
                >
                  Rating
                </button>
                <button 
                  className="px-5 py-3 text-sm font-medium transition-colors duration-200"
                  style={{ 
                    backgroundColor: sortBy === "name" ? colors.accent : colors.white,
                    color: sortBy === "name" ? colors.white : colors.primary 
                  }}
                  onClick={() => sortGames("name")}
                >
                  Name
                </button>
                <button 
                  className="px-5 py-3 text-sm font-medium transition-colors duration-200"
                  style={{ 
                    backgroundColor: sortBy === "release" ? colors.accent : colors.white,
                    color: sortBy === "release" ? colors.white : colors.primary 
                  }}
                  onClick={() => sortGames("release")}
                >
                  Release Date
                </button>
              </div>
            </div>
            <button 
              className="px-5 py-3 rounded-lg shadow-md flex items-center justify-center transition-all duration-300 w-full md:w-auto"
              style={{ backgroundColor: colors.white, color: colors.primary }}
              onClick={toggleView}
            >
              <span className="mr-2 font-medium">{viewMode === "grid" ? "List View" : "Grid View"}</span>
              {viewMode === "grid" ? <List size={18} /> : <Grid size={18} />}
            </button>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {games.map((game, index) => (
                <div 
                  key={game.id} 
                  className="rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out"
                  style={{ backgroundColor: colors.white }}
                >
                  <div className="relative">
                    <img
                      src={game.background_image || "/api/placeholder/400/200"}
                      alt={game.name}
                      className="w-full h-52 object-cover"
                    />
                    <div 
                      className="absolute top-3 left-3 w-10 h-10 flex items-center justify-center text-white font-bold rounded-lg shadow-md"
                      style={{ backgroundColor: colors.accent }}
                    >
                      {index + 1}
                    </div>
                    {game.metacritic && (
                      <div className="absolute bottom-3 right-3 px-3 py-1 font-bold rounded-lg shadow-md"
                           style={{ backgroundColor: colors.black, color: game.metacritic > 75 ? "#6bd425" : game.metacritic > 50 ? "#ffbd3f" : "#ff4545" }}>
                        {game.metacritic}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-3 truncate" style={{ color: colors.primary }}>{game.name}</h3>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm font-medium" style={{ color: colors.primary }}>
                        {game.released ? new Date(game.released).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }) : "TBA"}
                      </p>
                      <div className="flex items-center px-3 py-1 rounded-md" style={{ backgroundColor: colors.secondaryBg }}>
                        <Star size={16} fill="#FFD700" color="#FFD700" />
                        <span className="ml-1 font-medium" style={{ color: colors.primary }}>
                          {game.rating ? game.rating.toFixed(1) : "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {game.genres && game.genres.slice(0, 3).map(genre => (
                        <span 
                          key={genre.id} 
                          className="px-3 py-1 text-xs rounded-full" 
                          style={{ backgroundColor: colors.secondaryBg, color: colors.primary }}
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: colors.white }}>
              <table className="min-w-full divide-y" style={{ borderColor: colors.secondaryBg }}>
                <thead style={{ backgroundColor: colors.primary }}>
                  <tr>
                    <th className="px-6 py-4 text-sm font-medium uppercase tracking-wider text-left" style={{ color: colors.white }}>Rank</th>
                    <th className="px-6 py-4 text-sm font-medium uppercase tracking-wider text-left" style={{ color: colors.white }}>Game</th>
                    <th className="px-6 py-4 text-sm font-medium uppercase tracking-wider text-left" style={{ color: colors.white }}>Release Date</th>
                    <th className="px-6 py-4 text-sm font-medium uppercase tracking-wider text-left" style={{ color: colors.white }}>Rating</th>
                    <th className="px-6 py-4 text-sm font-medium uppercase tracking-wider text-left" style={{ color: colors.white }}>Genres</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: colors.secondaryBg }}>
                  {games.map((game, index) => (
                    <tr key={game.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold" style={{ backgroundColor: colors.accent, color: colors.white }}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            <img 
                              className="h-12 w-12 rounded-md object-cover" 
                              src={game.background_image || "/api/placeholder/50/50"} 
                              alt={game.name} 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-md font-bold" style={{ color: colors.primary }}>{game.name}</div>
                            {game.metacritic && (
                              <div className="mt-1 inline-block px-2 py-1 text-xs font-medium rounded" 
                                   style={{ 
                                     backgroundColor: game.metacritic > 75 ? "#e6f5d0" : game.metacritic > 50 ? "#fff6e0" : "#ffeded",
                                     color: game.metacritic > 75 ? "#5eb31b" : game.metacritic > 50 ? "#daa520" : "#d13030"
                                   }}>
                                Metacritic: {game.metacritic}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm" style={{ color: colors.primary }}>
                        {game.released ? new Date(game.released).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) : "TBA"}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center p-2 rounded" style={{ backgroundColor: colors.secondaryBg }}>
                          <Star size={16} fill="#FFD700" color="#FFD700" />
                          <span className="ml-1 font-medium" style={{ color: colors.primary }}>
                            {game.rating ? game.rating.toFixed(1) : "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex flex-wrap gap-2">
                          {game.genres && game.genres.slice(0, 3).map(genre => (
                            <span 
                              key={genre.id} 
                              className="px-3 py-1 text-xs rounded-full" 
                              style={{ backgroundColor: colors.secondaryBg, color: colors.primary }}
                            >
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GamingAPIComponent;