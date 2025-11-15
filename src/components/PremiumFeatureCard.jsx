import React, { useState } from 'react';

function PremiumFeatureCard({ feature, icon, description }) {
  const [showUpgrade, setShowUpgrade] = useState(false);

  const openLink = (url) => {
    window.electronAPI.openExternal(url);
  };

  return (
    <>
      <button
        onClick={() => setShowUpgrade(true)}
        className="w-full p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-yellow-500 border-opacity-50 hover:border-opacity-100 transition-all group relative overflow-hidden"
      >
        {/* Premium Badge */}
        <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-500 rounded-full text-xs font-bold text-gray-900">
          PRO
        </div>

        {/* Lock Icon Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-12 h-12 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </div>

        <div className="text-left relative z-10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="text-2xl">{icon}</div>
            <h3 className="text-lg font-bold text-white">{feature}</h3>
          </div>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </button>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl max-w-lg w-full border-2 border-yellow-500 shadow-2xl">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-4xl">✨</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Premium Feature</h3>
                    <p className="text-gray-800">Unlock {feature}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUpgrade(false)}
                  className="text-gray-900 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-xl font-bold text-white mb-3">What's Included in Premium?</h4>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-zedzen-green mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-white font-medium">AI Background Removal</p>
                      <p className="text-sm text-gray-400">Remove backgrounds from images instantly</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-zedzen-green mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-white font-medium">Google Drive Integration</p>
                      <p className="text-sm text-gray-400">Direct save and load from cloud</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-zedzen-green mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-white font-medium">Advanced Editing Tools</p>
                      <p className="text-sm text-gray-400">Watermarks, filters, and more</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-zedzen-green mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-white font-medium">Priority Support</p>
                      <p className="text-sm text-gray-400">Get help within 24 hours</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-zedzen-purple to-purple-700 rounded-xl p-4 mb-6 text-center">
                <p className="text-3xl font-bold text-white mb-1">29 RON/month</p>
                <p className="text-purple-200 text-sm">~7 EUR | Cancel anytime</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    openLink('https://zed-zen.com/premium');
                    setShowUpgrade(false);
                  }}
                  className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-gray-900 font-bold transition-colors"
                >
                  Upgrade to Premium
                </button>
                <button
                  onClick={() => setShowUpgrade(false)}
                  className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PremiumFeatureCard;