import React from 'react';

function ConversionPanel({ 
  outputFormat, 
  setOutputFormat, 
  quality, 
  setQuality, 
  outputFolder, 
  onSelectFolder, 
  onStartConversion,
  isConverting,
  fileCount,
  files = [] // Add files prop to detect file types
}) {
  // All available formats with categories
  const allFormats = [
    // Images
    { value: 'webp', label: 'WebP', desc: 'Best for web', category: 'image' },
    { value: 'jpg', label: 'JPG', desc: 'Universal', category: 'image' },
    { value: 'png', label: 'PNG', desc: 'Lossless', category: 'image' },
    { value: 'avif', label: 'AVIF', desc: 'Best compression', category: 'image' },
    { value: 'svg', label: 'SVG', desc: 'Vector', category: 'image' },
    { value: 'bmp', label: 'BMP', desc: 'Uncompressed', category: 'image' },
    
    // Videos
    { value: 'mp4', label: 'MP4', desc: 'Universal video', category: 'video' },
    { value: 'webm', label: 'WebM', desc: 'Web video', category: 'video' },
    { value: 'avi', label: 'AVI', desc: 'Windows video', category: 'video' },
    { value: 'mkv', label: 'MKV', desc: 'HD video', category: 'video' },
    { value: 'mov', label: 'MOV', desc: 'QuickTime', category: 'video' },
    { value: 'gif', label: 'GIF', desc: 'Animated', category: 'video' },
    
    // Documents
    { value: 'pdf', label: 'PDF', desc: 'Document', category: 'document' },
    { value: 'docx', label: 'DOCX', desc: 'Word', category: 'document' },
    { value: 'txt', label: 'TXT', desc: 'Plain text', category: 'document' },
  ];

  // Detect what types of files are in the queue
  const detectFileTypes = () => {
    if (!files || files.length === 0) return ['all'];
    
    const extensions = files.map(f => f.ext.toLowerCase());
    
    const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff', '.svg'];
    const videoExts = ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv', '.wmv'];
    const docExts = ['.pdf', '.docx', '.doc', '.txt'];
    
    const hasImages = extensions.some(ext => imageExts.includes(ext));
    const hasVideos = extensions.some(ext => videoExts.includes(ext));
    const hasDocs = extensions.some(ext => docExts.includes(ext));
    
    const types = [];
    if (hasImages) types.push('image');
    if (hasVideos) types.push('video');
    if (hasDocs) types.push('document');
    
    return types.length > 0 ? types : ['all'];
  };

  // Filter formats based on file types
  const availableTypes = detectFileTypes();
  const formats = availableTypes.includes('all') 
    ? allFormats 
    : allFormats.filter(f => availableTypes.includes(f.category));

  // Auto-select first available format if current is not available
  React.useEffect(() => {
    if (formats.length > 0 && !formats.find(f => f.value === outputFormat)) {
      setOutputFormat(formats[0].value);
    }
  }, [formats, outputFormat, setOutputFormat]);

  return (
    <div className="h-full flex flex-col p-6 bg-gray-900 overflow-y-auto">
      <h2 className="text-xl font-bold text-white mb-6">
        Conversion Settings
      </h2>

      {/* Output Format */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Output Format
          {files.length > 0 && (
            <span className="ml-2 text-xs text-gray-500">
              (showing compatible formats)
            </span>
          )}
        </label>
        <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto">
          {formats.map((format) => (
            <button
              key={format.value}
              onClick={() => setOutputFormat(format.value)}
              className={`
                p-2 rounded-lg border-2 text-left transition-all text-sm
                ${outputFormat === format.value
                  ? 'border-zedzen-purple bg-purple-900 bg-opacity-20 text-white'
                  : 'border-gray-700 hover:border-gray-600 text-gray-400 hover:text-white'
                }
              `}
            >
              <div className="font-semibold text-xs">{format.label}</div>
              <div className="text-[10px] opacity-75">{format.desc}</div>
            </button>
          ))}
        </div>
        
        {files.length === 0 && (
          <p className="mt-2 text-xs text-gray-500">
            💡 Add files to see compatible formats
          </p>
        )}
      </div>

      {/* Quality Slider */}
      {['webp', 'jpg', 'avif', 'png', 'mp4', 'webm', 'avi', 'mkv', 'mov'].includes(outputFormat) && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Quality: {quality}%
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={quality}
            onChange={(e) => setQuality(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-zedzen-purple"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Lower size</span>
            <span>Higher quality</span>
          </div>
        </div>
      )}

      {/* Output Folder */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Output Folder
        </label>
        <div className="flex gap-2">
          <button
            onClick={onSelectFolder}
            className="flex-1 min-w-0 p-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-left transition-colors flex items-center justify-between group overflow-hidden"
          >
            <span className="text-sm text-gray-400 truncate block max-w-full">
              {outputFolder || 'Click to select folder...'}
            </span>
            <svg className="w-5 h-5 text-gray-500 group-hover:text-zedzen-purple transition-colors flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </button>
          
          {/* Open Folder Button */}
          {outputFolder && (
            <button
              onClick={async () => {
                await window.electronAPI.openFolder(outputFolder);
              }}
              className="p-3 bg-zedzen-purple hover:bg-purple-600 rounded-lg transition-colors flex items-center justify-center group"
              title="Open folder in Explorer"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          )}
        </div>
        
        {outputFolder && (
          <p className="mt-2 text-xs text-gray-500 truncate" title={outputFolder}>
            📁 {outputFolder}
          </p>
        )}
      </div>

      {/* Quick Presets */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Quick Presets
        </label>
        <div className="space-y-2">
          <button
            onClick={() => {
              setOutputFormat('webp');
              setQuality(85);
            }}
            className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors"
            disabled={!availableTypes.includes('image') && !availableTypes.includes('all')}
          >
            <div className="font-medium text-white">Restaurant Menu</div>
            <div className="text-xs text-gray-400">WebP, 85% quality</div>
          </button>
          <button
            onClick={() => {
              setOutputFormat('webp');
              setQuality(75);
            }}
            className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors"
            disabled={!availableTypes.includes('image') && !availableTypes.includes('all')}
          >
            <div className="font-medium text-white">Delivery App</div>
            <div className="text-xs text-gray-400">WebP, 75% quality</div>
          </button>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Convert Button */}
      <button
        onClick={onStartConversion}
        disabled={isConverting || fileCount === 0 || !outputFolder}
        className={`
          w-full py-4 rounded-lg font-semibold text-lg transition-all
          ${isConverting || fileCount === 0 || !outputFolder
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-zedzen-purple to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
          }
        `}
      >
        {isConverting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Converting...
          </span>
        ) : (
          `Convert ${fileCount} ${fileCount === 1 ? 'File' : 'Files'}`
        )}
      </button>

      {/* Info */}
      <div className="mt-4 p-3 bg-zedzen-purple bg-opacity-10 border border-zedzen-purple border-opacity-30 rounded-lg">
        <div className="flex items-center justify-between">
          <p className="text-xs text-center text-zedzen-purple flex-1">
            Powered by FFmpeg & Sharp
          </p>
          <button
            onClick={() => {
              window.electronAPI.openExternal('https://zed-zen.com');
            }}
            className="text-xs text-zedzen-green hover:text-zedzen-yellow transition-colors cursor-pointer font-semibold"
          >
            Learn More →
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConversionPanel;