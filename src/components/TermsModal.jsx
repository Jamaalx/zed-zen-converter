import React from 'react';

function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const openLink = (url) => {
    require('electron').shell.openExternal(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-zedzen-purple shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-zedzen-purple to-purple-700 p-6 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Terms of Service</h2>
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
        <div className="p-6 space-y-6 text-gray-300">
          <div className="bg-zedzen-purple bg-opacity-10 border border-zedzen-purple border-opacity-30 rounded-lg p-4">
            <p className="text-sm">
              <strong className="text-white">Last Updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <section>
            <h3 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h3>
            <p className="text-sm leading-relaxed">
              By downloading, installing, or using ZED-ZEN Media Converter ("the Software"), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, do not use the Software.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3">2. License Grant</h3>
            <p className="text-sm leading-relaxed mb-2">
              ZED-ZEN Media Converter is provided as <strong className="text-zedzen-green">free software</strong>. We grant you a non-exclusive, 
              non-transferable, revocable license to use the Software for personal and commercial purposes.
            </p>
            <ul className="text-sm space-y-1 ml-4">
              <li>✅ Use for personal projects</li>
              <li>✅ Use for commercial projects</li>
              <li>✅ Install on multiple devices</li>
              <li>✅ Convert unlimited files</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3">3. Restrictions</h3>
            <p className="text-sm leading-relaxed">You agree NOT to:</p>
            <ul className="text-sm space-y-1 ml-4 mt-2">
              <li>❌ Reverse engineer or decompile the Software</li>
              <li>❌ Remove or modify any copyright notices</li>
              <li>❌ Redistribute the Software as your own</li>
              <li>❌ Use the Software for illegal purposes</li>
              <li>❌ Claim ownership of the Software</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3">4. Open Source Components</h3>
            <p className="text-sm leading-relaxed">
              This Software uses open-source libraries including FFmpeg (LGPL/GPL), Sharp (Apache 2.0), and others. 
              We comply with all respective licenses. Full attribution available in the About section.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3">5. Privacy & Data</h3>
            <p className="text-sm leading-relaxed mb-2">
              <strong className="text-zedzen-green">We respect your privacy:</strong>
            </p>
            <ul className="text-sm space-y-1 ml-4">
              <li>🔒 All conversions happen locally on your device</li>
              <li>🔒 No files are uploaded to our servers</li>
              <li>🔒 No tracking or analytics</li>
              <li>🔒 No personal data collection</li>
              <li>🔒 100% offline operation</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3">6. No Warranty</h3>
            <p className="text-sm leading-relaxed">
              THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. We do not guarantee that the Software will be error-free, 
              secure, or continuously available. Use at your own risk.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3">7. Limitation of Liability</h3>
            <p className="text-sm leading-relaxed">
              To the maximum extent permitted by law, ZED-ZEN and Fortitudo Vincit SRL shall not be liable for any damages arising from 
              the use or inability to use the Software, including but not limited to data loss, corrupted files, or business interruption.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3">8. Updates & Changes</h3>
            <p className="text-sm leading-relaxed">
              We may update the Software and these Terms at any time. Continued use of the Software after updates constitutes acceptance of new terms.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3">9. Premium Features</h3>
            <p className="text-sm leading-relaxed">
              Premium features (if purchased) are subject to additional terms and subscription agreements. Free tier remains free forever.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3">10. Governing Law</h3>
            <p className="text-sm leading-relaxed">
              These Terms are governed by the laws of Romania. Any disputes shall be resolved in the courts of Bucharest, Romania.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3">11. Contact</h3>
            <p className="text-sm leading-relaxed">
              For questions about these Terms, contact us at:
            </p>
            <div className="mt-2 space-y-1 text-sm">
              <p>📧 Email: <button onClick={() => openLink('mailto:alex.mantello13@gmail.com')} className="text-zedzen-purple hover:text-zedzen-green">alex.mantello13@gmail.com</button></p>
              <p>🌐 Website: <button onClick={() => openLink('https://zed-zen.com')} className="text-zedzen-purple hover:text-zedzen-green">zed-zen.com</button></p>
              <p>🏢 Company: Fortitudo Vincit SRL, Romania</p>
            </div>
          </section>

          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-xs text-gray-400 text-center">
              By using ZED-ZEN Media Converter, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 p-4 rounded-b-2xl flex justify-between items-center">
          <button
            onClick={() => openLink('https://zed-zen.com/privacy')}
            className="text-sm text-zedzen-purple hover:text-zedzen-green transition-colors"
          >
            Privacy Policy →
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-zedzen-purple hover:bg-purple-600 rounded-lg text-white font-medium transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}

export default TermsModal;