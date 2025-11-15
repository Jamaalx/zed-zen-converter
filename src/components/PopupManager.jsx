import React, { useEffect, useState } from 'react';
import analytics from '../utils/analytics';

function PopupManager({ conversionsThisSession }) {
  const [activePopup, setActivePopup] = useState(null);

  useEffect(() => {
    // Check every 10 seconds for popup triggers
    const interval = setInterval(() => {
      if (activePopup) return; // Don't show multiple popups

      // Time-based popup (5 minutes)
      if (analytics.shouldShowTimePopup()) {
        setActivePopup('time');
        analytics.markTimePopupShown();
        return;
      }

      // Conversion popup (5 files)
      if (analytics.shouldShowConversionPopup()) {
        setActivePopup('conversion');
        analytics.markConversionPopupShown();
        return;
      }

      // 10 total conversions popup
      if (analytics.shouldShow10ConversionPopup()) {
        setActivePopup('milestone');
        analytics.mark10ConversionPopupShown();
        return;
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [activePopup]);

  const openLink = (url) => {
    require('electron').shell.openExternal(url);
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  if (!activePopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-md w-full border-2 border-zedzen-purple shadow-2xl animate-scale-in">
        {/* Time Popup - 5 minutes */}
        {activePopup === 'time' && (
          <div className="p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-zedzen-purple rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                You've been crushing it! 🚀
              </h3>
              <p className="text-gray-300 mb-4">
                5 minutes of productivity! Want to stay updated with more free tools from ZED-ZEN?
              </p>
            </div>

            <div className="space-y-3">
              <button
  onClick={() => {
    openLink('https://www.linkedin.com/in/alex-mantello-2b166414a/');
    closePopup();
  }}
  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-colors flex items-center justify-center gap-2"
>
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
  Follow on LinkedIn
</button>

              <button
                onClick={() => {
                  openLink('https://zed-zen.com');
                  closePopup();
                }}
                className="w-full px-6 py-3 bg-zedzen-purple hover:bg-purple-600 rounded-lg text-white font-semibold transition-colors"
              >
                Visit ZED-ZEN.com
              </button>

              <button
                onClick={closePopup}
                className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        )}

        {/* Conversion Popup - 5 files */}
        {activePopup === 'conversion' && (
          <div className="p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-zedzen-green rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                5 Files Converted! 🎉
              </h3>
              <p className="text-gray-300 mb-4">
                You're saving time and money! Want even more features like background removal and cloud integration?
              </p>
            </div>

            <div className="bg-gradient-to-r from-zedzen-purple to-purple-700 rounded-xl p-4 mb-4">
              <h4 className="text-white font-bold mb-2">✨ Premium Features</h4>
              <ul className="text-sm text-purple-100 space-y-1">
                <li>🎨 AI Background Removal</li>
                <li>☁️ Google Drive Integration</li>
                <li>🖼️ Advanced Image Editing</li>
                <li>⚡ Priority Processing</li>
                <li>📊 Batch Analytics</li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  openLink('https://zed-zen.com/premium');
                  closePopup();
                }}
                className="w-full px-6 py-3 bg-zedzen-purple hover:bg-purple-600 rounded-lg text-white font-semibold transition-colors"
              >
                Learn About Premium
              </button>

              <button
                onClick={closePopup}
                className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
              >
                Continue Free
              </button>
            </div>
          </div>
        )}

        {/* Milestone Popup - 10 total */}
        {activePopup === 'milestone' && (
          <div className="p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-zedzen-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                10 Files Milestone! ⭐
              </h3>
              <p className="text-gray-300 mb-4">
                You're a power user! Share ZED-ZEN with your team and help them save time too!
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-300 text-center">
                💡 <strong className="text-white">Did you know?</strong> Teams using ZED-ZEN save an average of <strong className="text-zedzen-green">3 hours per week</strong> on media optimization!
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  openLink('mailto:?subject=Check out ZED-ZEN Media Converter&body=I\'ve been using this free tool to convert images and videos - it\'s amazing! https://zed-zen.com');
                  closePopup();
                }}
                className="w-full px-6 py-3 bg-zedzen-green hover:bg-green-600 rounded-lg text-gray-900 font-semibold transition-colors"
              >
                Share with Team
              </button>

              <button
                onClick={() => {
                  openLink('https://zed-zen.com');
                  closePopup();
                }}
                className="w-full px-6 py-3 bg-zedzen-purple hover:bg-purple-600 rounded-lg text-white font-semibold transition-colors"
              >
                Explore More Tools
              </button>

              <button
                onClick={closePopup}
                className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PopupManager;