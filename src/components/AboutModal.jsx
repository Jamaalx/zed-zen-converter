import React from 'react';

function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const openLink = (url) => {
    window.electronAPI.openExternal(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-zedzen-purple shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-zedzen-purple to-purple-700 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 100 100" className="w-12 h-12">
                  <path 
                    d="M15 25 L85 25 L85 37 L38 37 L85 63 L85 75 L15 75 L15 63 L62 63 L15 37 Z" 
                    fill="#8B5CFF"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">ZED-ZEN Media Converter</h2>
                <p className="text-purple-200">Version 1.0.0 - Free Edition</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-red-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Free & Open */}
          <div className="bg-zedzen-green bg-opacity-10 border border-zedzen-green border-opacity-30 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-zedzen-green flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">100% Free Forever</h3>
                <p className="text-gray-300 text-sm">
                  This tool is completely free with no ads, no tracking, and no limitations. 
                  Convert unlimited files, offline, forever. Made with ❤️ for the HoReCa community.
                </p>
              </div>
            </div>
          </div>

          {/* What it does */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">What Can It Do?</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-zedzen-purple" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white font-medium text-sm">Images</span>
                </div>
                <p className="text-gray-400 text-xs">JPG, PNG, WebP, AVIF, SVG, BMP</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-zedzen-purple" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                  <span className="text-white font-medium text-sm">Videos</span>
                </div>
                <p className="text-gray-400 text-xs">MP4, WebM, AVI, MKV, MOV, GIF</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-zedzen-purple" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white font-medium text-sm">Documents</span>
                </div>
                <p className="text-gray-400 text-xs">PDF, DOCX, TXT</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-zedzen-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white font-medium text-sm">Batch Processing</span>
                </div>
                <p className="text-gray-400 text-xs">Convert 100+ files at once</p>
              </div>
            </div>
          </div>

          {/* About the Developer */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">About the Developer</h3>
            <div className="bg-gradient-to-r from-purple-900 to-gray-800 rounded-xl p-4 border border-purple-700">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-zedzen-purple rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                  AM
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-lg">Alex Mantello</h4>
                  <p className="text-purple-200 text-sm mb-2">Founder & Developer</p>
                  <p className="text-gray-300 text-sm mb-3">
                    Is helping restaurants optimize operations and grow revenue. 
                    He created this tool to help businesses save time and money on media optimization.
                  </p>
                  <div className="flex flex-wrap gap-2">
                 <button
  onClick={() => openLink('https://www.linkedin.com/in/alex-mantello-2b166414a/')}
  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-xs font-medium transition-colors flex items-center gap-1"
>
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
  LinkedIn
</button>

                    <button
                      onClick={() => openLink('mailto:alex.mantello13@gmail.com')}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About ZedZen */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">About ZED-ZEN</h3>
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-gray-300 text-sm mb-3">
                ZED-ZEN is building tools to help restaurants and hospitality businesses thrive in the digital age. 
                Our mission is to make professional-grade tools accessible to everyone.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => openLink('https://zed-zen.com')}
                  className="px-4 py-2 bg-zedzen-purple hover:bg-purple-600 rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Visit zed-zen.com
                </button>
                <button
                  onClick={() => openLink('https://fortitudovincit.ro')}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium transition-colors"
                >
                  Fortitudo Vincit SRL
                </button>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Built With</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">Electron</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">React</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">FFmpeg</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">Sharp</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">Tailwind CSS</span>
            </div>
          </div>

          {/* Support & Feedback */}
          <div className="bg-zedzen-purple bg-opacity-10 border border-zedzen-purple border-opacity-30 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-2">Love this tool? Help us spread the word! 💜</h3>
            <p className="text-gray-300 text-sm mb-3">
              Share it with your colleagues, friends, or anyone who could benefit from easy media conversion.
            </p>
            <button
  onClick={() => openLink('mailto:alex.mantello13@gmail.com?subject=Feedback on ZED-ZEN Media Converter&body=Hi Alex,%0D%0A%0D%0AI wanted to share some feedback about the Media Converter:%0D%0A%0D%0A')}
  className="px-4 py-2 bg-zedzen-purple hover:bg-purple-600 rounded-lg text-white text-sm font-medium transition-colors"
>
  Send Feedback
</button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 p-4 rounded-b-2xl text-center">
          <p className="text-gray-400 text-sm">
            © 2025 ZED-ZEN | Made with ❤️ in Romania
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutModal;