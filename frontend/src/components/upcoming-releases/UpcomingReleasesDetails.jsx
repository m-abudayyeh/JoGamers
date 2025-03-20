import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../navbar/Navbar";

const UpcomingReleasesDetails = () => {
  const { id } = useParams();
  const [release, setRelease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [now, setNow] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReleaseDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/upcoming-releases/${id}`
        );
        setRelease(response.data.release);
        setLoading(false);
      } catch (err) {
        setError("Error fetching release details.");
        setLoading(false);
      }
    };

    fetchReleaseDetails();
  }, [id]);

  // Update the current time every second for the countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate time remaining until release
  const calculateTimeRemaining = (releaseDate) => {
    if (!releaseDate) return { isReleased: true };
    
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 bg-gradient-to-b from-[#EFF5F5] to-[#FFFFFF]">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#D6E4E5] border-t-[#EB6440] rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-[#497174] font-medium text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-b from-[#EFF5F5] to-[#FFFFFF] p-4">
        <Navbar />
        <div className="max-w-md mx-auto mt-8">
          <div className="bg-[#EB6440] text-white p-4 rounded-md shadow-md text-center">
            <p className="mb-3">{error}</p>
            <button 
              onClick={() => navigate(-1)} 
              className="bg-white text-[#EB6440] px-4 py-1 rounded-md text-sm font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const timeRemaining = calculateTimeRemaining(release?.releaseDate);
  const releaseDate = new Date(release.releaseDate);

  return (
    <div className="bg-gradient-to-b from-[#EFF5F5] to-[#FFFFFF] min-h-screen">
      <Navbar />
      
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        {/* Hero Section - Keeping the image prominent */}
        <div className="relative h-[50vh] mb-4 rounded-lg overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-black opacity-20 z-10"></div>
          <img
            src={release.featuredImage}
            alt={release.title}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-black/80 to-transparent">
            <h1 className="text-white text-2xl md:text-3xl font-bold mb-1">
              {release.title}
            </h1>
            
            <div className="flex items-center space-x-3 text-sm">
              <div className="bg-[#EB6440] text-white px-2 py-1 rounded-full font-medium">
                {releaseDate.toLocaleDateString()}
              </div>
              <div className="text-white">
                By {release.createdBy ? release.createdBy.name : "Unknown"}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Area - More compact */}
        <div className="grid grid-cols-12 gap-4">
          {/* Main Content - 8 columns */}
          <div className="col-span-12 md:col-span-8">
            <div className="bg-white p-4 rounded-md shadow-md">
              <h2 className="text-[#497174] text-lg font-bold mb-3 pb-2 border-b border-[#D6E4E5]">
                About This Release
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                {release.description}
              </p>
            </div>
          </div>
          
          {/* Right Column - 4 columns */}
          <div className="col-span-12 md:col-span-4 space-y-4">
            {/* Countdown Timer - Smaller */}
            {!timeRemaining.isReleased ? (
              <div className="bg-white rounded-md shadow-md overflow-hidden">
                <div className="bg-[#497174] text-white p-2 text-sm text-center">
                  <h3 className="font-bold">Time Until Release</h3>
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-4 gap-1 text-center">
                    <div className="flex flex-col">
                      <div className="bg-[#EFF5F5] rounded p-1">
                        <span className="text-[#EB6440] text-sm font-bold">{timeRemaining.days}</span>
                      </div>
                      <span className="text-[#497174] text-xs mt-1">Days</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="bg-[#EFF5F5] rounded p-1">
                        <span className="text-[#EB6440] text-sm font-bold">{timeRemaining.hours}</span>
                      </div>
                      <span className="text-[#497174] text-xs mt-1">Hrs</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="bg-[#EFF5F5] rounded p-1">
                        <span className="text-[#EB6440] text-sm font-bold">{timeRemaining.minutes}</span>
                      </div>
                      <span className="text-[#497174] text-xs mt-1">Min</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="bg-[#EFF5F5] rounded p-1">
                        <span className="text-[#EB6440] text-sm font-bold">{timeRemaining.seconds}</span>
                      </div>
                      <span className="text-[#497174] text-xs mt-1">Sec</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#EB6440] text-white p-2 rounded-md shadow-md text-center text-sm">
                <p>This title is now available</p>
              </div>
            )}
            
            {/* Release Info - Smaller */}
            <div className="bg-white rounded-md shadow-md overflow-hidden">
              <div className="bg-[#497174] text-white p-2 text-sm">
                <h3 className="font-bold">Release Details</h3>
              </div>
              <div className="p-3 space-y-2 text-sm">
                <div>
                  <h4 className="text-[#EB6440] font-medium text-xs uppercase">Release Date</h4>
                  <p className="text-[#497174] font-medium">
                    {releaseDate.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h4 className="text-[#EB6440] font-medium text-xs uppercase">Creator</h4>
                  <p className="text-[#497174] font-medium">
                    {release.createdBy ? release.createdBy.name : "Unknown"}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Back Button - Smaller */}
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-[#EB6440] hover:bg-[#d15a39] text-white py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Releases
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingReleasesDetails;