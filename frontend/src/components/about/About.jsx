import React from "react";
import Navbar from "../navbar/Navbar";
import { ChevronRight, Users, Target, Zap, Mail } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EFF5F5] to-[#D6E4E5] text-gray-800">
      <Navbar />

      {/* Hero Section with Background */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <div className="absolute inset-0 bg-[#497174] opacity-80"></div>
        <img
          src="/api/placeholder/1600/800"
          alt="Gaming community"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              About <span className="text-[#EB6440]">Us</span>
            </h1>
            <p className="text-xl text-white max-w-2xl mx-auto">
              The team behind your favorite gaming community
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl py-12">
        {/* Our Story Section */}
        <div className="mb-20">
          <div className="flex items-center mb-6">
            <div className="h-1 bg-[#EB6440] w-12 mr-4"></div>
            <h2 className="text-2xl font-semibold text-[#497174]">OUR STORY</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold mb-6">
                Bringing gamers together since 2023
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                We started with a simple idea: create a space where gamers could
                find reliable information about upcoming releases and connect
                with others who share their passion.
              </p>
              <p className="text-lg text-gray-700">
                Today, we've grown into a thriving community of enthusiasts,
                reviewers, and industry experts all united by our love for
                gaming. Our platform aims to be the go-to resource for
                everything gaming-related, from breaking news to in-depth
                analysis.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img
                src="/Overwatch-League-1.jpg"
                alt="Our team working"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Mission and Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {/* Mission Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 transform hover:translate-y-[-5px] transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-[#497174] p-3 rounded-full mr-4">
                <Target size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#497174]">Our Mission</h3>
            </div>
            <p className="text-lg text-gray-700 mb-6">
              Our mission is to provide gamers and enthusiasts with the most
              up-to-date information on upcoming game releases, breaking news,
              and insightful content. We aim to build a community where everyone
              can share their passion for gaming.
            </p>
            <div className="flex items-center text-[#EB6440] font-semibold">
              <span>Your content and community are our priorities</span>
              <ChevronRight size={20} className="ml-2" />
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 transform hover:translate-y-[-5px] transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-[#497174] p-3 rounded-full mr-4">
                <Zap size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#497174]">Our Vision</h3>
            </div>
            <p className="text-lg text-gray-700 mb-6">
              Our vision is to create an inclusive platform where gamers can
              engage, learn, and grow together. We strive to offer content that
              sparks creativity, encourages new connections, and keeps players
              up-to-date on everything in the gaming world.
            </p>
            <div className="flex items-center text-[#EB6440] font-semibold">
              <span>Pushing the boundaries of gaming content</span>
              <ChevronRight size={20} className="ml-2" />
            </div>
          </div>
        </div>

        {/* Meet the Team Section */}
        <div className="mb-20">
          <div className="flex items-center justify-center mb-12">
            <div className="h-1 bg-[#EB6440] w-12 mr-4"></div>
            <h2 className="text-3xl font-bold text-[#497174]">Meet Our Team</h2>
            <div className="h-1 bg-[#EB6440] w-12 ml-4"></div>
          </div>

          <div className="flex items-center justify-center mb-10">
            <div className="bg-[#497174] p-4 rounded-full">
              <Users size={32} className="text-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300">
              <div className="p-6">
                <h4 className="text-xl font-semibold text-[#497174]">
                  Mohammed Alsarrawi
                </h4>
                <p className="text-sm text-gray-600">Scrum Master</p>
                <p className="text-gray-700 mt-4">
                  Keeps our team organized and makes sure we're always
                  delivering value to our users.
                </p>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300">
              <div className="p-6">
                <h4 className="text-xl font-semibold text-[#497174]">
                  Mustafa Obeidat
                </h4>
                <p className="text-sm text-gray-600">Product Owner</p>
                <p className="text-gray-700 mt-4">
                  Shapes our vision and ensures we're building what gamers
                  really need.
                </p>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300">
              <div className="p-6">
                <h4 className="text-xl font-semibold text-[#497174]">
                  Mohammed Abudayyeh
                </h4>
                <p className="text-sm text-gray-600">QA</p>
                <p className="text-gray-700 mt-4">
                  Our quality guardian who ensures everything we release meets
                  our high standards.
                </p>
              </div>
            </div>

            {/* Team Member 4 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300">
              <div className="p-6">
                <h4 className="text-xl font-semibold text-[#497174]">
                  Hasan Mansour
                </h4>
                <p className="text-sm text-gray-600">Developer</p>
                <p className="text-gray-700 mt-4">
                  Frontend wizard who brings our designs to life with elegant
                  code.
                </p>
              </div>
            </div>

            {/* Team Member 5 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300">
              <div className="p-6">
                <h4 className="text-xl font-semibold text-[#497174]">
                  Ahmad Tabaza
                </h4>
                <p className="text-sm text-gray-600">Developer</p>
                <p className="text-gray-700 mt-4">
                  Backend specialist who ensures our platform performs at its
                  best.
                </p>
              </div>
            </div>

            {/* Team Member 6 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300">
              <div className="p-6">
                <h4 className="text-xl font-semibold text-[#497174]">
                  Faisal Jadallah
                </h4>
                <p className="text-sm text-gray-600">Developer</p>
                <p className="text-gray-700 mt-4">
                  Full-stack developer who tackles our most challenging
                  technical problems.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-[#497174] text-white rounded-xl p-8 text-center shadow-xl">
          <h3 className="text-3xl font-bold mb-4">Join Our Community</h3>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Become a part of the future of gaming. Stay connected, informed, and
            engaged with fellow gamers!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/signup"
              className="bg-[#EB6440] hover:bg-[#d95a3a] text-white px-8 py-3 rounded-full font-bold transition-colors inline-flex items-center"
            >
              Join Now <ChevronRight size={20} className="ml-2" />
            </a>
            <a
              href="/contact"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-[#497174] text-white px-8 py-3 rounded-full font-bold transition-all inline-flex items-center"
            >
              Contact Us <Mail size={20} className="ml-2" />
            </a>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#497174] py-12 mt-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6">
              <p className="text-4xl font-bold text-white mb-2">100K+</p>
              <p className="text-lg text-gray-200">Active Users</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-white mb-2">500+</p>
              <p className="text-lg text-gray-200">Game Reviews</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-white mb-2">50+</p>
              <p className="text-lg text-gray-200">Contributors</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-white mb-2">24/7</p>
              <p className="text-lg text-gray-200">Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
