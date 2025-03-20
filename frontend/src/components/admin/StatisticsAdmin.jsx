import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";

function StatisticsAdmin() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [roleCounts, setRoleCounts] = useState({
    user: 0,
    publisher: 0,
    admin: 0,
  });

  const [totalNews, setTotalNews] = useState(0);
  const [approvedNews, setApprovedNews] = useState(0);
  const [notApprovedNews, setNotApprovedNews] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        const users = response.data;

        setTotalUsers(users.length);

        const roleData = { user: 0, publisher: 0, admin: 0 };
        users.forEach((user) => {
          if (roleData[user.role] !== undefined) {
            roleData[user.role]++;
          }
        });

        setRoleCounts(roleData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchNews = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/news/allNews");
        const news = response.data;

        setTotalNews(news.length);

        const approvedCount = news.filter((item) => item.approve).length;
        const notApprovedCount = news.length - approvedCount;

        setApprovedNews(approvedCount);
        setNotApprovedNews(notApprovedCount);

        const categoryData = {};
        news.forEach((item) => {
          categoryData[item.category] = (categoryData[item.category] || 0) + 1;
        });

        setCategoryCounts(categoryData);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchUsers();
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Admin statistics and performance metrics</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Users" 
          value={totalUsers} 
          icon="👥"
          color="bg-blue-500" 
        />
        <StatCard 
          title="Total News" 
          value={totalNews} 
          icon="📰"
          color="bg-purple-500" 
        />
        <StatCard 
          title="Approved News" 
          value={approvedNews} 
          icon="✅"
          color="bg-green-500" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* User Roles Chart */}
        <ChartCard 
          title="User Role Distribution" 
          subtitle={`${totalUsers} total registered users`}
        >
          <div className="relative h-64">
            <Pie 
              data={generatePieChart(
                roleCounts, 
                ["#4CAF50", "#FF9800", "#F44336"]
              )} 
            />
            <div className="absolute bottom-0 w-full">
              <Legend 
                items={[
                  { label: "Admin", color: "#4CAF50" },
                  { label: "Editor", color: "#FF9800" },
                  { label: "User", color: "#F44336" }
                ]} 
              />
            </div>
          </div>
        </ChartCard>

        {/* News Approval Chart */}
        <ChartCard 
          title="News Approval Status" 
          subtitle={`${approvedNews + notApprovedNews} total news articles`}
        >
          <div className="relative h-64">
            <Pie 
              data={generatePieChart(
                { Approved: approvedNews, "Pending": notApprovedNews }, 
                ["#2196F3", "#F44336"]
              )} 
            />
            <div className="absolute bottom-0 w-full">
              <Legend 
                items={[
                  { label: "Approved", color: "#2196F3" },
                  { label: "Pending", color: "#F44336" }
                ]} 
              />
            </div>
          </div>
        </ChartCard>
      </div>

      {/* News Categories Chart */}
      <ChartCard 
        title="News by Category" 
        subtitle="Distribution of articles across categories"
      >
        <div className="h-80">
          <Bar data={generateBarChart(categoryCounts)} />
        </div>
      </ChartCard>
    </div>
  );
};

// Enhanced Stat Card Component
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div className="p-5">
      <div className="flex items-center">
        <div className={`${color} w-12 h-12 rounded-full flex items-center justify-center text-white text-xl`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-gray-800 text-2xl font-bold">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  </div>
);

// Enhanced Chart Card Component
const ChartCard = ({ title, subtitle, children }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
    <div className="mb-4">
      <h3 className="text-gray-800 text-xl font-semibold">{title}</h3>
      {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
    </div>
    {children}
  </div>
);

// Custom Legend Component
const Legend = ({ items }) => (
  <div className="flex justify-center items-center gap-4 mt-4">
    {items.map((item, index) => (
      <div key={index} className="flex items-center">
        <div 
          className="w-3 h-3 rounded-full mr-2" 
          style={{ backgroundColor: item.color }}
        />
        <span className="text-sm text-gray-600">{item.label}</span>
      </div>
    ))}
  </div>
);

// Generate Pie Chart Data
const generatePieChart = (data, colors) => ({
  labels: Object.keys(data),
  datasets: [
    {
      data: Object.values(data),
      backgroundColor: colors,
      borderWidth: 0,
    },
  ],
});

// Generate Bar Chart Data
const generateBarChart = (data) => ({
  labels: Object.keys(data),
  datasets: [
    {
      label: "Number of Articles",
      data: Object.values(data),
      backgroundColor: "rgba(75, 192, 192, 0.8)",
      borderRadius: 8,
    },
  ],
});

export default StatisticsAdmin;
