function Footer({ onTermsClick, onPrivacyClick }) {
  const openLink = (url) => {
    window.electronAPI.openExternal(url);
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left - Developer Credit */}
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-gray-400">
            Developed by{' '}
            <button
              onClick={() => openLink('https://www.linkedin.com/in/alex-mantello-2b166414a/')}
              className="text-zedzen-purple hover:text-zedzen-green font-semibold transition-colors cursor-pointer"
            >
              Alex Mantello
            </button>
          </span>
          <span className="text-gray-600">•</span>
          <button
            onClick={() => openLink('https://fortitudovincit.ro')}
            className="text-gray-500 hover:text-zedzen-purple transition-colors cursor-pointer"
          >
            Fortitudo Vincit SRL
          </button>
        </div>

        {/* Right - Links */}
        <div className="flex items-center space-x-4 text-sm">
          <button
            onClick={() => openLink('https://zed-zen.com')}
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            zed-zen.com
          </button>
          
          <span className="text-gray-700">•</span>
          
          <button
            onClick={() => openLink('mailto:alex.mantello13@gmail.com')}
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Support
          </button>

          <span className="text-gray-700">•</span>
          
          <button
            onClick={onTermsClick}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            Terms
          </button>
          
          <button
            onClick={onPrivacyClick}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            Privacy
          </button>

          <span className="text-gray-700">•</span>

          <span className="text-gray-600 text-xs">
            © 2025 ZED-ZEN
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;