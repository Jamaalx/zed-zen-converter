import React from 'react';

function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const openLink = (url) => {
    window.electronAPI.openExternal(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-zedzen-green shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-zedzen-green to-green-600 p-6 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
            <button
              onClick={onClose}
              className="text-gray-900 hover:text-red-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-gray-300">
          <div className="bg-zedzen-green bg-opacity-10 border border-zedzen-green border-opacity-30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-zedzen-green flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-white mb-1">Your Privacy is Our Priority</p>
                <p className="text-xs text-gray-300">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>
          </div>

          <section>
            <h3 className="text-xl font-bold text-white mb-3">1. Overview</h3>
            <p className="text-sm leading-relaxed">
              ZED-ZEN Media Converter is designed with privacy at its core. We believe your files and data should remain yours. 
              This Privacy Policy explains our commitment to protecting your privacy.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3">2. Data We DO NOT Collect</h3>
            <div className="bg-gray-800 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-zedzen-green mb-2">🔒 Zero Data Collection:</p>
              <ul className="text-sm space-y-1 ml-4">
                <li>❌ Your files are NEVER uploaded to our servers</li>
                <li>❌ We do NOT collect your personal information</li>
                <li>❌ We do NOT track your usage or behavior</li>
                <li>❌ We do NOT use cookies or analytics</li>
                <li>❌ We do NOT share data with third parties</li>
                <li>❌ We do NOT store conversion history</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3">3. How the Software Works</h3>
            <p className="text-sm leading-relaxed mb-3">
              <strong className="text-white">100% Local Processing:</strong>
            </p>
            <ul className="text-sm space-y-2 ml-4">
              <li>✅ All conversions happen directly on your computer</li>
              <li>✅ Files never leave your device</li>
              <li>✅ No internet connection required</li>
              <li>✅ Complete offline functionality</li>
              <li>✅ You control input and output locations</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3">4. Local Storage</h3>
            <p className="text-sm leading-relaxed">
              The Software may store minimal local preferences on your device (such as last used output folder). 
              This data never leaves your computer and can be cleared by uninstalling the application.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3">5. Premium Features (If Applicable)</h3>
            <p className="text-sm leading-relaxed mb-2">
              If you purchase premium features, we collect only:
            </p>
            <ul className="text-sm space-y-1 ml-4">
              <li>📧 Email address (for license activation)</li>
              <li>💳 Payment information (processed securely by Stripe)</li>
              <li>🔑 License key (stored locally on your device)</li>
            </ul>
            <p className="text-sm leading-relaxed mt-2">
              We do NOT store payment details. All transactions are handled by PCI-compliant payment processors.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3">6. Third-Party Services</h3>
            <p className="text-sm leading-relaxed mb-2">
              The Software uses the following open-source libraries (all run locally):
            </p>
            <ul className="text-sm space-y-1 ml-4">
              <li>• FFmpeg (video/audio processing)</li>
              <li>• Sharp (image processing)</li>
              <li>• Electron (application framework)</li>
              <li>• React (user interface)</li>
            </ul>
            <p className="text-sm leading-relaxed mt-2">
              These libraries do not send data externally.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3">7. GDPR Compliance</h3>
            <p className="text-sm leading-relaxed">
              Since we collect no personal data, GDPR requirements are minimal. However, we respect your rights:
            </p>
            <ul className="text-sm space-y-1 ml-4 mt-2">
              <li>✅ Right to access: No data to access</li>
              <li>✅ Right to deletion: Uninstall removes all local data</li>
              <li>✅ Right to portability: All files stay on your device</li>
              <li>✅ Right to object: No data processing to object to</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3">8. Children's Privacy</h3>
            <p className="text-sm leading-relaxed">
              The Software does not target children under 13. We do not knowingly collect information from children.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3">9. Security</h3>
            <p className="text-sm leading-relaxed">
              Your files are processed entirely on your device using industry-standard libraries. We recommend:
            </p>
            <ul className="text-sm space-y-1 ml-4 mt-2">
              <li>🔐 Keep your operating system updated</li>
              <li>🔐 Use antivirus software</li>
              <li>🔐 Download the Software only from official sources</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3">10. Changes to Privacy Policy</h3>
            <p className="text-sm leading-relaxed">
              We may update this Privacy Policy. Continued use after changes constitutes acceptance. Major changes will be announced in the application.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3">11. Contact Us</h3>
            <p className="text-sm leading-relaxed mb-2">
              Questions about privacy? Contact us:
            </p>
            <div className="space-y-1 text-sm">
              <p>📧 Email: <button onClick={() => openLink('mailto:alex.mantello13@gmail.com')} className="text-zedzen-green hover:text-green-400">alex.mantello13@gmail.com</button></p>
              <p>🌐 Website: <button onClick={() => openLink('https://zed-zen.com')} className="text-zedzen-green hover:text-green-400">zed-zen.com</button></p>
              <p>🏢 Fortitudo Vincit SRL</p>
              <p>📍 Bucharest, Romania</p>
            </div>
          </section>

          <div className="bg-zedzen-green bg-opacity-10 border border-zedzen-green border-opacity-30 rounded-xl p-4">
            <p className="text-sm text-center font-semibold text-white mb-2">
              🛡️ Privacy Guarantee
            </p>
            <p className="text-xs text-gray-300 text-center">
              Your files, your data, your privacy. Always.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 p-4 rounded-b-2xl flex justify-between items-center">
          <button
            onClick={() => openLink('https://zed-zen.com/terms')}
            className="text-sm text-zedzen-green hover:text-green-400 transition-colors"
          >
            Terms of Service →
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-zedzen-green hover:bg-green-600 rounded-lg text-gray-900 font-bold transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrivacyModal;