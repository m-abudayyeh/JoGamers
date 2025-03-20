import React from "react";
import { FaFacebook, FaLinkedin, FaWhatsapp, FaTelegram } from "react-icons/fa";

const ShareButtons = ({ articleTitle, articleUrl, articleImage }) => {
  const encodedTitle = encodeURIComponent(articleTitle);
  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedImage = encodeURIComponent(articleImage);

  const socialPlatforms = [
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}&picture=${encodedImage}`,
      icon: <FaFacebook className="text-blue-600" />,
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <FaLinkedin className="text-blue-700" />,
    },
    {
      name: "WhatsApp",
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      icon: <FaWhatsapp className="text-green-600" />,
    },
    {
      name: "Telegram",
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <FaTelegram className="text-blue-500" />,
    },
  ];

  const openPopup = (url) => {
    window.open(url, "_blank", "width=600,height=400");
  };

  return (
    <div className="flex gap-3 ">
      {socialPlatforms.map((platform) => (
        <button
          key={platform.name}
          onClick={() => openPopup(platform.url)}
          className="p-2 rounded-full bg-[#D6E4E5] text-[#497174] hover:bg-gray-300 transition"
        >
          <span className="w-5 h-5 flex items-center justify-center">
            {platform.icon}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ShareButtons;