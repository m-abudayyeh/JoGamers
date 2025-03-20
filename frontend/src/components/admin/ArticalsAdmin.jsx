import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ArticalsAdmin = () => {
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // added state for filtering

  // Fetch News from Backend
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/news/allNews");
      setNews(response.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  // Open Modal to View Full News
  const openNewsModal = (newsItem) => {
    setSelectedNews(newsItem);
    setModalOpen(true);
  };

  // Approve News using updateNews Controller
  const approveNews = async (newsId) => {
    Swal.fire({
      title: "Approve this news?",
      text: "This will make it publicly visible!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#497174", // Updated color
      cancelButtonColor: "#EB6440", // Updated color
      confirmButtonText: "Yes, approve it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`http://localhost:5000/api/news/news/${newsId}`, { approve: true });
          Swal.fire("Approved!", "The news has been approved.", "success");
          fetchNews(); // Refresh list
        } catch (error) {
          Swal.fire("Error", "Failed to approve the news", "error");
        }
      }
    });
  };

  // Handle filter changes
  const handleFilter = (status) => {
    setFilter(status);
  };

  // Filtered news based on status
  const filteredNews = news.filter((newsItem) => {
    if (filter === 'approved') {
      return newsItem.approve;
    }
    if (filter === 'pending') {
      return !newsItem.approve;
    }
    return true; // For 'all' filter
  });

  return (
    <div className="bg-gradient-to-br from-[#EFF5F5] to-[#D6E4E5] min-h-screen p-8">
  <div className="max-w-7xl mx-auto">
    {/* Header with stats */}
    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-[#497174]">News Dashboard</h1>

      <div className="flex space-x-4 mt-4 md:mt-0">
        <div className="bg-white rounded-lg shadow px-4 py-3 text-center">
          <p className="text-xs text-[#497174] font-medium">TOTAL</p>
          <p className="text-2xl font-bold text-gray-800">{news.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow px-4 py-3 text-center">
          <p className="text-xs text-[#497174] font-medium">APPROVED</p>
          <p className="text-2xl font-bold text-gray-800">{news.filter(n => n.approve).length}</p>
        </div>
        <div className="bg-white rounded-lg shadow px-4 py-3 text-center">
          <p className="text-xs text-[#EB6440] font-medium">PENDING</p>
          <p className="text-2xl font-bold text-gray-800">{news.filter(n => !n.approve).length}</p>
        </div>
      </div>
    </div>

    {/* Filter tabs */}
    <div className="bg-white shadow-sm rounded-lg p-2 mb-8 flex overflow-x-auto">
      <button
        onClick={() => handleFilter('all')}
        className={`px-4 py-2 ${filter === 'all' ? 'bg-[#D6E4E5] text-[#497174]' : 'text-gray-600 hover:bg-gray-100'} rounded-md font-medium mr-2`}
      >
        All
      </button>
      <button
        onClick={() => handleFilter('approved')}
        className={`px-4 py-2 ${filter === 'approved' ? 'bg-[#497174] text-white' : 'text-gray-600 hover:bg-gray-100'} rounded-md font-medium mr-2`}
      >
        Approved
      </button>
      <button
        onClick={() => handleFilter('pending')}
        className={`px-4 py-2 ${filter === 'pending' ? 'bg-[#EB6440] text-white' : 'text-gray-600 hover:bg-gray-100'} rounded-md font-medium`}
      >
        Pending
      </button>
    </div>

    {/* News grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredNews.map((newsItem) => (
        <div
          key={newsItem._id}
          className="bg-white rounded-xl shadow overflow-hidden group transform transition-transform duration-300 hover:scale-105 relative"
        >
          <div className="relative group-hover:bg-black group-hover:opacity-50 transition-all duration-300">
            {/* News image */}
            {newsItem.images && newsItem.images.length > 0 ? (
              <img
                src={newsItem.images[0]}
                alt={newsItem.title}
                className="w-full h-52 object-cover group-hover:blur-sm transition-all duration-300"
              />
            ) : (
              <div className="w-full h-52 bg-gray-100 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Status badge */}
            <div className="absolute top-4 right-4">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  newsItem.approve
                    ? 'bg-[#497174] text-white'
                    : 'bg-[#EB6440] text-white'
                }`}
              >
                {newsItem.approve ? 'Approved' : 'Pending'}
              </span>
            </div>

            {/* Quick action overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => openNewsModal(newsItem)}
                className="bg-white text-gray-800 font-medium px-4 py-2 rounded-lg mr-2 hover:bg-gray-100"
              >
                View
              </button>
              {!newsItem.approve && (
                <button
                  onClick={() => approveNews(newsItem._id)}
                  className="bg-[#497174] text-white font-medium px-4 py-2 rounded-lg hover:bg-[#497174] opacity-80"
                >
                  Approve
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-[#D6E4E5] text-[#497174] flex items-center justify-center mr-3 font-medium">
                {(newsItem.author?.name || 'U')[0].toUpperCase()}
              </div>
              <span className="text-sm text-gray-600">{newsItem.author?.name || 'Unknown'}</span>
            </div>

            <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{newsItem.title}</h2>

            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
              {newsItem.content}
            </p>

            <div className="flex justify-between items-center">
              <button
                onClick={() => openNewsModal(newsItem)}
                className="text-[#497174] text-sm font-medium hover:text-[#497174]"
              >
                Read more
              </button>

              {!newsItem.approve && (
                <button
                  onClick={() => approveNews(newsItem._id)}
                  className="text-[#EB6440] text-sm font-medium hover:text-[#EB6440]"
                >
                  Approve
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Modal */}
    {modalOpen && selectedNews && (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Modal header */}
          <div className="relative">
            {selectedNews.images && selectedNews.images.length > 0 ? (
              <img
                src={selectedNews.images[0]}
                alt={selectedNews.title}
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Close button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-opacity-70"
            >
              ✕
            </button>

            {/* Status badge */}
            <div className="absolute top-4 left-4">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  selectedNews.approve
                    ? 'bg-[#497174] text-white'
                    : 'bg-[#EB6440] text-white'
                }`}
              >
                {selectedNews.approve ? 'Approved' : 'Pending'}
              </span>
            </div>
          </div>

          {/* Modal content */}
          <div className="p-6 overflow-y-auto flex-1">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-[#D6E4E5] text-[#497174] flex items-center justify-center mr-3 font-medium">
                {(selectedNews.author?.name || 'U')[0].toUpperCase()}
              </div>
              <div>
                <p className="text-gray-800 font-medium">{selectedNews.author?.name || 'Unknown'}</p>
                <p className="text-gray-500 text-sm">Author</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedNews.title}</h2>

            <div className="prose max-w-none">
              <p>{selectedNews.content}</p>
            </div>
          </div>

          {/* Modal footer */}
          <div className="border-t border-gray-200 p-4 flex justify-between">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>

            {!selectedNews.approve && (
              <button
                onClick={() => {
                  approveNews(selectedNews._id);
                  setModalOpen(false);
                }}
                className="px-4 py-2 bg-[#497174] text-white rounded-lg hover:bg-[#497174]"
              >
                Approve & Close
              </button>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
</div>

  );
};

export default ArticalsAdmin;
