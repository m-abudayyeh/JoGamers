import React from "react";
import { FiMail, FiSend, FiGithub, FiTwitter, FiInstagram, FiTwitch, FiYoutube, FiLinkedin } from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Color palette
  const colors = {
    lightBg:  "#EFF5F5",
    mediumBg: "#D6E4E5",
    primary:  "#497174",
    accent:   "#EB6440",
    white:    "#FFFFFF",
    black:    "#000000"
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300">
      {/* Wave SVG Divider */}
      <div className="w-full overflow-hidden">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="fill-current text-gray-800 w-full h-12 -mb-1"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-1">
            <div className="mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                GamePulse
              </span>
            </div>
            <p className="text-sm mb-6 text-gray-400 leading-relaxed">
              Your daily dose of gaming news, reviews, and insights from across the gaming universe.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Icons */}
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">
                <FiTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">
                <FiInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">
                <FiYoutube className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">
                <FiTwitch className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">
                <FiLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4 text-white relative inline-block">
              Categories
              <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-orange-500"></span>
            </h3>
            <ul className="space-y-3">
              {["PC Gaming", "Console", "Mobile", "Esports", "Reviews", "Upcoming"].map((category) => (
                <li key={category}>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-orange-400 transition-colors duration-300 flex items-center"
                  >
                    <span className="mr-2 text-orange-500">›</span>
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4 text-white relative inline-block">
              Resources
              <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-orange-500"></span>
            </h3>
            <ul className="space-y-3">
              {["Game Guides", "Hardware Reviews", "Developer Interviews", "Gaming Deals", "Community Forum"].map((resource) => (
                <li key={resource}>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-orange-400 transition-colors duration-300 flex items-center"
                  >
                    <span className="mr-2 text-orange-500">›</span>
                    {resource}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4 text-white relative inline-block">
              Newsletter
              <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-orange-500"></span>
            </h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Subscribe to get the latest gaming updates and exclusive content.
            </p>
            <form className="flex flex-col space-y-3">
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  placeholder="Your email"
                  className="pl-10 w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-500 hover:to-red-400 text-white py-2 px-4 rounded-md font-medium transition-all duration-300 flex items-center justify-center"
              >
                Subscribe
                <FiSend className="ml-2 h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            {[
              { title: "24/7 Support", desc: "Always here to help" },
              { title: "Daily Updates", desc: "Fresh gaming content" },
              { title: "Exclusive Access", desc: "Early game previews" },
              { title: "Gaming Community", desc: "Join the conversation" }
            ].map((feature, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all duration-300">
                <h4 className="font-medium text-orange-400 mb-1">{feature.title}</h4>
                <p className="text-xs text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-sm text-gray-500">
              © {currentYear} GamePulse. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Contact Us"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-xs text-gray-500 hover:text-orange-400 transition-colors duration-300"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <div className="text-center pb-6">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="inline-flex items-center justify-center p-2 rounded-full bg-orange-500 hover:bg-orange-400 text-white transition-all duration-300 transform hover:-translate-y-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default Footer;