import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX, FiUser, FiHome, FiBookOpen, FiInfo, FiMail, FiTrendingUp, FiAward } from "react-icons/fi";
import axios from "axios";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/news/dash/verfiy-navbar", { withCredentials: true });
        console.log(response.data); 
        if (response.data.role) {
          setUserRole(response.data.role);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setIsAuthenticated(false);
      }
    };

    fetchUserRole();

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (pageId) => {
    setCurrentCategory(pageId);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/news/dash/logout", {}, { withCredentials: true });
      document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
      setUserRole(null);
      setIsAuthenticated(false);
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const pages = [
    { id: "home", name: "Home", link: "/", icon: <FiHome className="mr-2" /> },
    { id: "articles", name: "Articles", link: "/articles", icon: <FiBookOpen className="mr-2" /> },
    { id: "about", name: "About", link: "/about", icon: <FiInfo className="mr-2" /> },
    { id: "contact", name: "Contact", link: "/contact", icon: <FiMail className="mr-2" /> },
    { id: "popular", name: "Trending", link: "/games", icon: <FiTrendingUp className="mr-2" /> },
    { id: "top-played", name: "Top Played", link: "/top-played", icon: <FiAward className="mr-2" /> },
  ];

  const userPages = [];
  if (userRole === "admin") {
    userPages.push({ id: "admin", name: "Admin Dashboard", link: "/admin" });
  } else if (userRole === "publisher") {
    userPages.push({ id: "publisher", name: "Publisher Dashboard", link: "/publisher" });
  }

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-gray-900/85 backdrop-blur-lg shadow-lg py-2" 
          : "bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-md py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group" onClick={() => handleNavigation("home")}>
              <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Jo Gamers
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-1">
            {pages.map((page) => (
              <Link
                key={page.id}
                to={page.link}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center ${
                  currentCategory === page.id
                    ? "text-orange-500 border-b-2 border-orange-500 transform -translate-y-1"
                    : "text-white hover:text-orange-400 hover:bg-gray-700/40 hover:shadow-inner"
                }`}
                onClick={() => handleNavigation(page.id)}
              >
                <span className="hidden lg:block">{page.name}</span>
                <span className="block lg:hidden">{page.icon}</span>
              </Link>
            ))}

            {isAuthenticated && userPages.length > 0 && (
              <div 
                className="relative ml-2"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <button className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  isHovering ? "text-orange-400 bg-gray-700/40" : "text-white hover:text-orange-400"
                }`}>
                  Dashboard
                </button>
                <div className={`absolute left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-xl transform transition-all duration-300 ${
                  isHovering 
                    ? "opacity-100 visible translate-y-0" 
                    : "opacity-0 invisible -translate-y-2"
                }`}>
                  {userPages.map((page) => (
                    <Link
                      key={page.id}
                      to={page.link}
                      className="block px-4 py-3 text-sm text-white hover:bg-gray-700 hover:text-orange-400 transition-colors duration-200 first:rounded-t-md last:rounded-b-md"
                      onClick={() => handleNavigation(page.id)}
                    >
                      {page.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <Link 
                to="/login" 
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-500 rounded-md transition-colors duration-300"
              >
                Login
              </Link>
            ) : (
              <button 
                onClick={handleLogout} 
                className="px-4 py-2 text-sm font-medium text-white hover:text-orange-400 border border-gray-700 hover:border-orange-400 rounded-md transition-all duration-300"
              >
                Logout
              </button>
            )}
            <Link 
              to={isAuthenticated ? "/profile" : "/login"} 
              onClick={() => handleNavigation("profile")}
              className="relative group"
            >
              <div className="p-2 rounded-full text-white group-hover:text-orange-400 bg-gray-800 group-hover:bg-gray-700 transition-all duration-300">
                <FiUser className="h-5 w-5" />
              </div>
              <span className="absolute -bottom-8 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {isAuthenticated ? "Profile" : "Login"}
              </span>
            </Link>
          </div>

          <div className="flex md:hidden items-center">
            <button 
              onClick={toggleMenu} 
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-orange-400 hover:bg-gray-700 focus:outline-none"
            >
              <span className="sr-only">Open menu</span>
              {isOpen ? (
                <FiX className="block h-6 w-6 transition-transform duration-300 rotate-90" />
              ) : (
                <FiMenu className="block h-6 w-6 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div 
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800/90 backdrop-blur-lg mt-2 rounded-b-lg mx-2">
          {pages.map((page) => (
            <Link
              key={page.id}
              to={page.link}
              className={`flex items-center px-3 py-3 rounded-md text-base font-medium transition-all duration-300 ${
                currentCategory === page.id
                  ? "text-orange-500 bg-gray-700/50 border-l-4 border-orange-500"
                  : "text-white hover:text-orange-400 hover:bg-gray-700/30"
              }`}
              onClick={() => handleNavigation(page.id)}
            >
              {page.icon}
              {page.name}
            </Link>
          ))}

          {isAuthenticated && userPages.length > 0 && (
            <div className="border-t border-gray-700 pt-2 mt-2">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Dashboard</p>
              {userPages.map((page) => (
                <Link
                  key={page.id}
                  to={page.link}
                  className={`block px-3 py-3 rounded-md text-base font-medium transition-all duration-300 ${
                    currentCategory === page.id
                      ? "text-orange-500 bg-gray-700/50 border-l-4 border-orange-500"
                      : "text-white hover:text-orange-400 hover:bg-gray-700/30"
                  }`}
                  onClick={() => handleNavigation(page.id)}
                >
                  {page.name}
                </Link>
              ))}
            </div>
          )}

          <div className="border-t border-gray-700 pt-2 mt-2">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</p>
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="flex items-center px-3 py-3 rounded-md text-base font-medium text-white hover:text-orange-400 hover:bg-gray-700/30 transition-all duration-300"
                onClick={() => handleNavigation("login")}
              >
                <FiUser className="mr-2" />
                Login
              </Link>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="flex items-center px-3 py-3 rounded-md text-base font-medium text-white hover:text-orange-400 hover:bg-gray-700/30 transition-all duration-300"
                  onClick={() => handleNavigation("profile")}
                >
                  <FiUser className="mr-2" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-3 py-3 rounded-md text-base font-medium text-white hover:text-orange-400 hover:bg-gray-700/30 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;