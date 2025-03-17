import { useState } from "react";
import { NavLink } from "react-router-dom";
import './Header.css';

const Header = function () {
    return (
      <div className="bg-gray-900 text-white py-4 px-6 fixed top-0 left-0 w-full shadow-lg">
        <ul className="flex justify-between items-center max-w-6xl mx-auto">
          <li className="text-xl font-bold">📹 Videotube</li>
          <li className="cursor-pointer hover:text-gray-300 transition">Subscriptions</li>
          <li className="cursor-pointer hover:text-gray-300 transition">Account</li>
        </ul>
      </div>
    );
  };
  
  export default Header;
  