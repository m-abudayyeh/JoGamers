import React, { useState } from "react";
import Navbar from "../navbar/Navbar";
import ArticlesDashboard from "./ArticlesDashboard";
import CreateArticle from "./CreateArticle";
import CreateRelease from "./CreateRelease";
import UpcomingReleasesDashboard from "./UpcomingReleasesDashboard";

function Publisher() {
  const [activeTab, setActiveTab] = useState("articles");

  const renderTabContent = () => {
    switch (activeTab) {
      case "articles":
        return <ArticlesDashboard />;
      case "create-article":
        return <CreateArticle />;
      case "create-release":
        return <CreateRelease />;
      case "upcoming":
        return <UpcomingReleasesDashboard />;
      default:
        return <ArticlesDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#EFF5F5] text-[#000000]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">
        <div className="bg-[#FFFFFF] shadow-xl rounded-2xl border border-[#D6E4E5] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#EB6440] to-[#497174] px-8 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white drop-shadow">Publisher Dashboard</h1>
              <div className="flex space-x-3">
                <button className="flex items-center bg-white/20 hover:bg-white/30 text-white font-medium px-4 py-2 rounded-lg shadow transition duration-200">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New
                </button>
                <button className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg shadow transition duration-200">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-white text-opacity-80 mt-2">Manage your articles, releases, and publishing activity</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-[#D6E4E5] bg-[#FFFFFF] sticky top-0 z-10">
            <nav className="flex px-4 sm:px-6 overflow-x-auto scrollbar-hide">
              <TabButton label="Articles" tab="articles" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton label="Create Article" tab="create-article" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton label="Create Release" tab="create-release" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton label="Upcoming Releases" tab="upcoming" activeTab={activeTab} setActiveTab={setActiveTab} />
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 bg-[#FFFFFF]">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}

// TabButton Component
const TabButton = ({ label, tab, activeTab, setActiveTab }) => {
  const tabIcons = {
    articles: (
      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7" />
      </svg>
    ),
    "create-article": (
      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    "create-release": (
      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    upcoming: (
      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    reports: (
      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm6 0V9a2 2 0 00-2-2h-2a2 2 0 00-2 2v10" />
      </svg>
    ),
    messages: (
      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M5 16h4l5 5v-5h5a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  };

  return (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center whitespace-nowrap py-4 px-6 text-sm font-medium transition-all duration-200 border-b-2 ${
        activeTab === tab
          ? "border-[#EB6440] text-[#497174] bg-[#D6E4E5] bg-opacity-40 rounded-t-md"
          : "border-transparent text-[#497174] text-opacity-70 hover:border-[#497174] hover:text-[#497174]"
      }`}
    >
      {tabIcons[tab]}
      {label}
    </button>
  );
};

export default Publisher;
