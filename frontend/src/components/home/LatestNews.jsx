import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronRight, Clock, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const LatestNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestNews = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/latestNewsRoute/latest"
        );
        if (Array.isArray(response.data.articles)) {
          setNews(response.data.articles);
        } else {
          console.error("Fetched data is not an array", response.data);
        }
      } catch (error) {
        console.error("Error fetching latest news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNews();
  }, []);

  return (
    <section className="bg-[#EFF5F5] py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="relative">
            <h2 className="text-3xl font-bold text-[#497174]">Latest News</h2>
            <div className="absolute -bottom-2 left-0 w-16 h-1 bg-[#EB6440] rounded-full"></div>
          </div>
          <Link
            to="/articles"
            className="flex items-center text-[#EB6440] hover:text-[#497174] font-medium transition-colors duration-300 group bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md"
          >
            View all
            <ChevronRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-[#D6E4E5] border-t-[#EB6440] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(news) &&
              news.map((item) => (
                <Link
                  to={`/news/${item._id}`}
                  key={item._id}
                  className="group block h-full"
                >
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 h-full flex flex-col transform group-hover:-translate-y-2 group-hover:ring-2 group-hover:ring-[#EB6440]">
                    <div className="relative h-48">
                      <img
                        src={item.images[0] || "/api/placeholder/500/300"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/api/placeholder/500/300";
                        }}
                      />
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/50"></div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#EB6440] text-white px-3 py-1 rounded-full text-xs uppercase font-bold tracking-wider shadow-md">
                          News
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <span className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                          <Eye size={14} className="mr-1" />
                          {Math.floor(Math.random() * 500) + 100}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex-grow flex flex-col">
                      <h3 className="text-xl font-semibold mb-3 text-[#497174] line-clamp-2 group-hover:text-[#EB6440] transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-4 flex-grow line-clamp-3 text-sm leading-relaxed">
                        {item.content?.substring(0, 120)}...
                      </p>
                      <div className="mt-auto pt-4 border-t border-[#D6E4E5]">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 font-medium flex items-center">
                            <Clock size={14} className="mr-2 text-[#497174]" />
                            {new Date(item.createdAt).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                          <div className="flex items-center bg-[#EFF5F5] p-2 rounded-full text-[#497174] group-hover:text-white group-hover:bg-[#EB6440] transition-all duration-300">
                            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestNews;