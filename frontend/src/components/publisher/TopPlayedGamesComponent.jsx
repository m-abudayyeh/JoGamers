import React, { useState, useEffect } from "react";
import { Star, List, Grid, ArrowUp, Trophy, Search, Download } from "lucide-react";
import Navbar from "../navbar/Navbar";

const TopPlayedGamesComponent = () => {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("players");
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 32;
  useEffect(() => {
    // Handle scroll to top button visibility
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Fetch top played games
    const fetchTopPlayedGames = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/api/top-played");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // Ensure 'data.response.ranks' exists and is an array
        if (data && data.response && Array.isArray(data.response.ranks)) {
          // Fetch game names based on appid
          const gameData = await Promise.all(
            data.response.ranks.map(async (game) => {
              const appid = game.appid;
              const gameName = await fetchGameName(appid);  // Fetch game name from Steam Store API
              return {
                ...game,
                name: gameName,  // Add the name property to each game
              };
            })
          );
          setGames(gameData);
        } else {
          throw new Error("Invalid data format received from the API.");
        }
      } catch (err) {
        setError("Failed to fetch data from the Steam Charts API.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch the game name using Steam's API
    const fetchGameName = async (appid) => {
      try {
        const response = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}`);
        const data = await response.json();
        if (data[appid] && data[appid].success) {
          return data[appid].data.name;  // Return the game name from the Steam Store API
        }
        return "Unknown Game";  // Fallback if no name is found
      } catch (error) {
        console.error("Error fetching game name:", error);
        return "Unknown Game";
      }
    };

    fetchTopPlayedGames();
  }, []);

  const sortGames = (method) => {
    setSortBy(method);
    let sortedGames = [...games];
    switch (method) {
      case "players":
        sortedGames.sort((a, b) => b.peak_in_game - a.peak_in_game);  // Sort by peak_in_game (players)
        break;
      case "name":
        sortedGames.sort((a, b) => a.name.localeCompare(b.name));  // Sort by game name
        break;
      default:
        break;
    }
    setGames(sortedGames);
  };

  const toggleView = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
  const paginatedGames = filteredGames.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  

  const handleGameSelect = (game) => {
    setSelectedGame(selectedGame && selectedGame.appid === game.appid ? null : game);
  };

  // Loading UI with skeleton loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center w-full max-w-7xl px-4">
          <div className="w-20 h-20 border-4 border-t-4 border-orange-500 border-t-orange-500 border-opacity-20 rounded-full animate-spin"></div>
          <p className="mt-6 text-xl font-medium text-gray-700">Loading top games...</p>
          <div className="w-full mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-300 rounded-md mb-3 w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded-md w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-100">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p className="text-center text-red-500 font-bold text-xl mb-2">Error</p>
          <p className="text-center text-gray-600">{error}</p>
          <button 
            className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-300 mx-auto block w-full font-medium"
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
      <Navbar />
      <div className="min-h-screen bg-gray-100" style={{ backgroundColor: "#EFF5F5" }}>
        {/* Hero Header */}
        <header className="relative py-16 overflow-hidden bg-gradient-to-r from-teal-700 to-cyan-700" style={{ backgroundColor: "#497174" }}>
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-2 mb-4 bg-white/10 rounded-full backdrop-blur-sm">
                <Trophy className="h-5 w-5 text-amber-300 mr-2" />
                <span className="text-white font-medium">Live Rankings</span>
              </div>
              <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">Top Most Played Games</h1>
              <p className="text-xl text-teal-100 max-w-2xl mx-auto" style={{ color: "#D6E4E5" }}>
                The definitive list of the most popular games on Steam right now
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-100 to-transparent" style={{ from: "#EFF5F5" }}></div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 pt-8 relative z-10 -mt-8">
          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
              <div className="relative w-full lg:w-1/3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Search games..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center justify-between w-full lg:w-auto">
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium mr-3">Sort by:</span>
                  <div className="inline-flex rounded-lg shadow-sm">
                    <button 
                      className={`px-4 py-2 text-sm font-medium rounded-l-lg border border-r-0 ${sortBy === "players" ? "bg-teal-600 text-white border-teal-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"} transition-colors duration-200`} 
                      style={sortBy === "players" ? { backgroundColor: "#497174", color: "#FFFFFF" } : {}}
                      onClick={() => sortGames("players")}
                    >
                      Players
                    </button>
                    <button 
                      className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${sortBy === "name" ? "bg-teal-600 text-white border-teal-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"} transition-colors duration-200`}
                      style={sortBy === "name" ? { backgroundColor: "#497174", color: "#FFFFFF" } : {}}
                      onClick={() => sortGames("name")}
                    >
                      Name
                    </button>
                  </div>
                </div>
                
                <button 
                  className="ml-4 px-4 py-2 bg-white text-gray-700 rounded-lg shadow border border-gray-300 hover:bg-gray-50 flex items-center transition-colors duration-200" 
                  onClick={toggleView}
                >
                  {viewMode === "grid" ? (
                    <>
                      <List className="h-5 w-5 mr-2" />
                      <span className="hidden sm:inline">List View</span>
                    </>
                  ) : (
                    <>
                      <Grid className="h-5 w-5 mr-2" />
                      <span className="hidden sm:inline">Grid View</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-teal-700">{filteredGames.length}</span> games
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>

          {/* Game Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedGames.map((game) => (
                <div 
                  key={game.appid} 
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer group"
                  style={{ backgroundColor: "#FFFFFF" }}
                  onClick={() => handleGameSelect(game)}
                >
                  <div className="relative">
                    <img
                      src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`}
                      alt={game.name}
                      className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/api/placeholder/400/320";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div 
                      className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center text-white font-bold rounded-full"
                      style={{ backgroundColor: "#EB6440" }}
                    >
                      {game.rank}
                    </div>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-3 py-1 rounded-full">
                        {game.peak_in_game.toLocaleString()} Players
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                        <p className="text-sm font-medium" style={{ color: "#497174" }}>Rank #{game.rank}</p>
                      </div>
                      <div className="text-sm font-medium" style={{ color: "#497174" }}>
                        {game.peak_in_game.toLocaleString()} Players
                      </div>
                    </div>
                  </div>
                  
{/* Expanded Game Details (conditionally rendered) */}
                  {selectedGame && selectedGame.appid === game.appid && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-teal-700">Game Details</h4>
                        <a 
                          href={`https://store.steampowered.com/app/${game.appid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-teal-600 hover:text-teal-800 flex items-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View on Steam
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                          </svg>
                        </a>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Current Players:</span>
                          <span className="font-medium">{game.peak_in_game.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Global Rank:</span>
                          <span className="font-medium">#{game.rank}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">App ID:</span>
                          <span className="font-medium">{game.appid}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-x-auto" style={{ backgroundColor: "#FFFFFF" }}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Game</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Players</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {paginatedGames.map((game) => (
                    <React.Fragment key={game.appid}>
                      <tr 
                        className={`hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${selectedGame && selectedGame.appid === game.appid ? 'bg-teal-50' : ''}`}
                        onClick={() => handleGameSelect(game)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full text-white font-medium text-sm" style={{ backgroundColor: "#EB6440" }}>
                            {game.rank}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-20 rounded overflow-hidden">
                              <img 
                                className="h-12 w-20 object-cover" 
                                src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`}
                                alt={game.name}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/api/placeholder/400/320";
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{game.name}</div>
                              <div className="text-xs text-gray-500">App ID: {game.appid}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, game.peak_in_game / 50000 * 100)}%` }}></div>
                            </div>
                            <span className="ml-3 text-sm text-gray-700">{game.peak_in_game.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a
                            href={`https://store.steampowered.com/app/${game.appid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-600 hover:text-teal-900"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View
                          </a>
                        </td>
                      </tr>
                      
                      {/* Expanded Row */}
                      {selectedGame && selectedGame.appid === game.appid && (
                        <tr className="bg-gray-50">
                          <td colSpan="4" className="px-6 py-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <div className="mb-4 md:mb-0">
                                <h4 className="font-medium text-gray-900 mb-2">Game Statistics</h4>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                  <div>
                                    <span className="text-gray-500">Peak Players:</span>
                                    <span className="ml-2 font-medium">{game.peak_in_game.toLocaleString()}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Global Rank:</span>
                                    <span className="ml-2 font-medium">#{game.rank}</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <a
                                  href={`https://store.steampowered.com/app/${game.appid}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  View on Steam
                                  <svg className="ml-2 -mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                  </svg>
                                </a>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Empty State */}
          {filteredGames.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-md">
              <div className="text-teal-700 bg-teal-100 p-4 rounded-full mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No games found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search term</p>
              <button
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-200"
                onClick={() => setSearchTerm("")}
              >
                Clear search
              </button>
            </div>
          )}
          
          {/* Pagination (Optional) - Just showing UI, not functional */}
          {totalPages > 1 && (
  <div className="mt-10 flex justify-center items-center gap-2 flex-wrap">
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className={`px-3 py-1 rounded-md font-medium ${
        currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#EB6440] text-white hover:bg-[#d05a3a]'
      }`}
    >
      Previous
    </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        onClick={() => setCurrentPage(page)}
        className={`px-3 py-1 rounded-md font-medium ${
          currentPage === page
            ? 'bg-[#497174] text-white'
            : 'bg-white text-[#497174] border border-[#D6E4E5] hover:bg-[#EFF5F5]'
        }`}
      >
        {page}
      </button>
    ))}

    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className={`px-3 py-1 rounded-md font-medium ${
        currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#EB6440] text-white hover:bg-[#d05a3a]'
      }`}
    >
      Next
    </button>
  </div>
)}

        </div>
        
        {/* Scroll to top button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 rounded-full bg-teal-600 text-white shadow-lg hover:bg-teal-700 transition-all duration-300 z-50"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-6 w-6" />
          </button>
        )}
        
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8 mt-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <h3 className="text-xl font-bold">Steam Charts</h3>
                <p className="text-gray-400 mt-2">Track the most popular games on Steam</p>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <span className="sr-only">Discord</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"></path>
                </svg>
              </a>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-500 text-sm">
            © {new Date().getFullYear()} Steam Charts. All game artwork and data belong to their respective owners.
          </div>
        </div>
      </footer>
    </div>
    
    {/* Game Preview Modal - Only show when a game is selected in certain contexts */}
    {selectedGame && viewMode === "grid" && (
      <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true" onClick={() => setSelectedGame(null)}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div 
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img 
                src={`https://steamcdn-a.akamaihd.net/steam/apps/${selectedGame.appid}/header.jpg`}
                alt={selectedGame.name}
                className="w-full object-cover h-64"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/api/placeholder/400/320";
                }}
              />
              <button
                className="absolute top-4 right-4 rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-70 transition-all duration-200"
                onClick={() => setSelectedGame(null)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent py-8 px-6">
                <h3 className="text-2xl font-bold text-white">{selectedGame.name}</h3>
                <div className="flex items-center mt-2">
                  <div className="bg-teal-600 text-white text-sm px-3 py-1 rounded-full">
                    Rank #{selectedGame.rank}
                  </div>
                  <div className="bg-gray-800 text-white text-sm px-3 py-1 rounded-full ml-2">
                    {selectedGame.peak_in_game.toLocaleString()} Players
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white px-6 py-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Player Statistics</h4>
                  <div className="mt-2 flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, selectedGame.peak_in_game / 50000 * 100)}%` }}></div>
                    </div>
                    <span className="ml-3 text-sm font-medium">{selectedGame.peak_in_game.toLocaleString()} current players</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">App ID</h4>
                    <p className="mt-1">{selectedGame.appid}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Global Rank</h4>
                    <p className="mt-1">#{selectedGame.rank}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-end">
              <a
                href={`https://store.steampowered.com/app/${selectedGame.appid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                View on Steam
                <svg className="ml-2 -mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default TopPlayedGamesComponent;