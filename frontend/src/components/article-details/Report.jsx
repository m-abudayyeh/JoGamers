import React, { useState } from 'react';
import { X, Flag, Trash2, AlertCircle, Send } from 'lucide-react';

export default function CommentsSection() {
  const [comment, setComment] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  // Placeholder comments data
  const comments = [
    {
      _id: '1',
      content: 'Example comment',
      createdBy: { username: 'User' },
      createdAt: new Date(),
    }
  ];

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    // Handle comment submission logic here
    setComment('');
  };

  const handleReportClick = (commentId) => {
    setSelectedCommentId(commentId);
    setIsReportModalOpen(true);
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    // Handle report submission logic here
    setIsReportModalOpen(false);
    setReportReason('');
    setSelectedCommentId(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
      <div className="p-6 md:p-8">
        <h2 className="text-2xl font-bold text-[#497174] mb-6 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          Comments ({comments.length})
        </h2>

        <form onSubmit={handleCommentSubmit} className="mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-[#497174] rounded-full flex items-center justify-center text-white">
                Y
              </div>
            </div>
            <div className="flex-grow">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-3 border border-[#D6E4E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#497174] min-h-24 bg-[#EFF5F5] resize-none"
                placeholder="Share your thoughts..."
                required
              ></textarea>
              <div className="flex justify-end mt-3">
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-[#EB6440] text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </form>

        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="border-b border-gray-100 pb-6 last:border-0">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-[#497174] rounded-full flex items-center justify-center text-white">
                    {comment.createdBy.username.charAt(0)}
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <h4 className="font-bold text-[#497174]">{comment.createdBy.username}</h4>
                      <span className="text-xs text-gray-500 ml-2">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleReportClick(comment._id)}
                        className="p-2 text-gray-500 hover:text-[#EB6440] transition-colors rounded-full hover:bg-gray-100"
                        title="Report Comment"
                      >
                        <Flag className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors rounded-full hover:bg-gray-100"
                        title="Delete Comment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Report Modal */}
        {isReportModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center text-[#497174]">
                  <AlertCircle className="w-6 h-6 mr-2" />
                  <h3 className="text-lg font-bold">Report Comment</h3>
                </div>
                <button
                  onClick={() => setIsReportModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleReportSubmit}>
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-4 py-3 border border-[#D6E4E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#497174] min-h-24 bg-[#EFF5F5] resize-none mb-4"
                  placeholder="Why are you reporting this comment?"
                  required
                ></textarea>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#EB6440] text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center group"
                  >
                    <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    Send Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}