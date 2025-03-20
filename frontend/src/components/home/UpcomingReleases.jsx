import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import axios from "axios";

const UpcomingReleases = () => {
  const [upcomingReleases, setUpcomingReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [now, setNow] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);

  // Fetch upcoming game releases
  useEffect(() => {
    const fetchUpcomingReleases = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/upcoming-releases"
        );
        setUpcomingReleases(response.data.upcomingGameReleases);
        setLoading(false);
      } catch (err) {
        setError("Error fetching upcoming releases.");
        setLoading(false);
      }
    };

    fetchUpcomingReleases();
  }, []);

  // Update the current time every second for the countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate the time remaining until release
  const calculateTimeRemaining = (releaseDate) => {
    const release = new Date(releaseDate);
    const difference = release - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isReleased: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { days, hours, minutes, seconds, isReleased: false };
  };

  // Pagination logic
  const indexOfLastRelease = currentPage * itemsPerPage;
  const indexOfFirstRelease = indexOfLastRelease - itemsPerPage;
  const currentReleases = upcomingReleases.slice(
    indexOfFirstRelease,
    indexOfLastRelease
  );

  const paginate = (direction) => {
    setCurrentPage((prevPage) =>
      direction === "next"
        ? prevPage + 1
        : direction === "prev"
        ? prevPage - 1
        : prevPage
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 bg-[#EFF5F5] text-[#497174] font-semibold">
        <div className="animate-pulse">Loading upcoming releases...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#EB6440] text-white p-3 rounded-md shadow-md">
        {error}
      </div>
    );
  }

  return (
    <div className="upcoming-releases bg-[#EFF5F5] py-6">
      <div className="max-w-screen-lg mx-auto px-4 bg-[#497174] p-6 rounded-lg shadow-md">
        <h1 className="text-white text-3xl font-bold mb-6 text-center">
          Upcoming Game Releases
        </h1>
        <div className="release-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentReleases.map((release) => {
            const timeRemaining = calculateTimeRemaining(release.releaseDate);

            return (
              <div
                key={release._id}
                className="release-item bg-white rounded-lg overflow-hidden shadow-lg border border-[#D6E4E5] flex flex-col transform hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                <div className="relative flex-grow">
                  <img
                    src={release.featuredImage}
                    alt={release.title}
                    className="w-full h-36 object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-[#EB6440] text-white px-3 py-1 m-2 rounded-full text-xs font-semibold">
                    {new Date(release.releaseDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="release-details p-4 flex flex-col justify-between flex-grow">
                  <h2 className="text-[#497174] text-xl font-semibold mb-2 truncate">
                    {release.title}
                  </h2>

                  <div className="flex flex-col justify-between flex-grow">
                    <div className="mb-4">
                      <p className="text-[#497174] text-xs font-semibold mb-2">
                        {timeRemaining.isReleased
                          ? "Now Available!"
                          : "Countdown:"}
                      </p>

                      {!timeRemaining.isReleased && (
                        <div className="grid grid-cols-4 gap-2">
                          <div className="bg-[#D6E4E5] rounded p-2 text-center">
                            <span className="text-[#EB6440] text-sm font-bold">
                              {timeRemaining.days}
                            </span>
                            <p className="text-[#497174] text-xs">Days</p>
                          </div>
                          <div className="bg-[#D6E4E5] rounded p-2 text-center">
                            <span className="text-[#EB6440] text-sm font-bold">
                              {timeRemaining.hours}
                            </span>
                            <p className="text-[#497174] text-xs">Hrs</p>
                          </div>
                          <div className="bg-[#D6E4E5] rounded p-2 text-center">
                            <span className="text-[#EB6440] text-sm font-bold">
                              {timeRemaining.minutes}
                            </span>
                            <p className="text-[#497174] text-xs">Min</p>
                          </div>
                          <div className="bg-[#D6E4E5] rounded p-2 text-center">
                            <span className="text-[#EB6440] text-sm font-bold">
                              {timeRemaining.seconds}
                            </span>
                            <p className="text-[#497174] text-xs">Sec</p>
                          </div>
                        </div>
                      )}

                      {timeRemaining.isReleased && (
                        <div className="bg-[#497174] text-white p-2 rounded text-center text-xs">
                          Game has been released!
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-[#497174] text-xs mt-2">
                        <span className="font-semibold">By:</span>{" "}
                        {release.createdBy ? release.createdBy.name : "Unknown"}
                      </p>
                      <Link
                        to={`/release/${release._id}`}
                        className="bg-[#EB6440] text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-[#d15a39] transition-colors duration-300"
                      >
                        View Details
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 inline-block ml-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination with Arrows */}
        <div className="flex justify-center mt-6">
          <button
            className="bg-[#EB6440] text-white px-4 py-2 rounded-md mx-2 transform hover:scale-105 transition-all duration-300"
            onClick={() => paginate("prev")}
            disabled={currentPage === 1}
          >
            ←
          </button>
          <button
            className="bg-[#EB6440] text-white px-4 py-2 rounded-md mx-2 transform hover:scale-105 transition-all duration-300"
            onClick={() => paginate("next")}
            disabled={
              currentPage === Math.ceil(upcomingReleases.length / itemsPerPage)
            }
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingReleases;
