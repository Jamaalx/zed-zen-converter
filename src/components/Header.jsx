import React from 'react';
import logoIcon from '../assets/icon48.png';

function Header({ onAboutClick }) {
  const openLink = (url) => {
    window.electronAPI.openExternal(url);
  };

  return (
    <header className="bg-gradient-to-r from-zedzen-purple to-purple-700 px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <button
            onClick={() => openLink('https://zed-zen.com')}
            className="hover:scale-105 transition-transform cursor-pointer"
            title="Visit ZedZen.com"
          >
            <img
              src={logoIcon}
              alt="ZED-ZEN Logo"
              className="w-12 h-12 rounded-lg shadow-md"
            />
          </button>
          
          <div>
            <button
              onClick={() => openLink('https://zed-zen.com')}
              className="text-2xl font-bold text-white tracking-wider hover:text-zedzen-green transition-colors cursor-pointer"
            >
              ZED-ZEN
            </button>
            <p className="text-sm text-purple-200">Media Converter</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* About Button */}
          <button
            onClick={onAboutClick}
            className="px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About
          </button>
          
          <div className="text-right">
            <p className="text-xs text-purple-200">Version</p>
            <p className="text-sm font-semibold text-white">1.0.0</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;