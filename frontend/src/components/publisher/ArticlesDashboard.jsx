import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Clock, CheckCircle, Eye, Search, Filter, XCircle, ArrowUp } from "lucide-react";

const ArticlesDashboard = () => {
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/news/dash", {
          withCredentials: true,
        });
        setNewsList(response.data.news);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navigate]);

  const filteredNews = newsList.filter((news) => {
    const matchesFilter =
      filter === "all" ? true : filter === "approved" ? news.approve : !news.approve;
    const matchesSearch =
      searchTerm === ""
        ? true
        : news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          news.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          news.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-24 bg-[#EFF5F5]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#497174] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#497174]">Loading news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFF5F5]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter & Search */}
        <div className="bg-[#FFFFFF] rounded-xl shadow border border-[#D6E4E5] p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 text-[#497174]" size={18} />
              <input
                type="text"
                placeholder="Search news by title, excerpt or category..."
                className="pl-10 pr-4 py-3 w-full rounded-lg border border-[#D6E4E5] focus:ring-2 focus:ring-[#497174] outline-none transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-3 text-[#497174] hover:text-[#EB6440]"
                >
                  <XCircle size={18} />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex items-center bg-[#EFF5F5] rounded-lg border border-[#D6E4E5] p-1 shadow-sm">
              {["all", "approved", "pending"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                    filter === type
                      ? "bg-[#EB6440] text-white"
                      : "text-[#497174] hover:bg-[#D6E4E5]"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* No results */}
        {filteredNews.length === 0 ? (
          <div className="bg-white border border-[#D6E4E5] shadow-md rounded-xl p-12 text-center">
            <p className="text-xl font-semibold text-[#497174]">No news found</p>
            <p className="mt-2 text-[#000000]/60">Try adjusting your filters or search keywords.</p>
            <button
              onClick={() => {
                setFilter("all");
                setSearchTerm("");
              }}
              className="mt-4 px-5 py-2 bg-[#EB6440] text-white rounded-md hover:bg-[#497174] transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-[#000000]/60 mb-4">
              Showing {filteredNews.length} news item{filteredNews.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((news) => (
                <Link key={news._id} to={`/news/dash/${news._id}`} className="group">
                  <div className="bg-white border border-[#D6E4E5] rounded-xl shadow hover:shadow-xl transition duration-300 flex flex-col overflow-hidden transform group-hover:-translate-y-1">
                    <div className="h-52 relative overflow-hidden">
                      <img
                        src={news.images[0]}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full border flex items-center gap-1 ${
                            news.approve
                              ? "bg-green-100 text-green-800 border-green-300"
                              : "bg-yellow-100 text-yellow-800 border-yellow-300"
                          }`}
                        >
                          {news.approve ? (
                            <>
                              <CheckCircle size={12} /> Approved
                            </>
                          ) : (
                            <>Pending</>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex-grow flex flex-col">
                      <h3 className="font-semibold text-lg text-[#000000] group-hover:text-[#EB6440] line-clamp-2 mb-2">
                        {news.title}
                      </h3>
                      <p className="text-sm text-[#497174] line-clamp-3">{news.excerpt}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="bg-[#EFF5F5] border border-[#D6E4E5] text-xs text-[#497174] px-3 py-1 rounded-full">
                          {news.platform}
                        </span>
                        <span className="bg-[#EFF5F5] border border-[#D6E4E5] text-xs text-[#497174] px-3 py-1 rounded-full">
                          {news.category}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#EFF5F5]">
                        <span className="text-sm text-[#000000]/70 flex items-center gap-1">
                          <Clock size={14} />
                          {formatDate(news.createdAt)}
                        </span>
                        <span className="text-sm flex items-center gap-1 bg-[#D6E4E5] hover:bg-[#497174] hover:text-white text-[#497174] px-3 py-1 rounded-md transition font-medium">
                          <Eye size={16} />
                          View
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-[#EB6440] text-white p-3 rounded-full shadow-lg hover:bg-[#497174] transition z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default ArticlesDashboard;
