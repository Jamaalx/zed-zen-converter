import React, { useState, useCallback } from 'react';

function FileDropzone({ onFilesAdded }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const filePaths = files.map(file => file.path);
    onFilesAdded(filePaths);
  }, [onFilesAdded]);

  const handleClick = async () => {
    const filePaths = await window.electronAPI.selectFiles();
    if (filePaths && filePaths.length > 0) {
      onFilesAdded(filePaths);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`
        border-4 border-dashed rounded-xl p-12 
        transition-all duration-200 cursor-pointer
        flex flex-col items-center justify-center
        ${isDragging 
          ? 'border-zedzen-purple bg-purple-900 bg-opacity-10' 
          : 'border-gray-700 hover:border-zedzen-purple hover:bg-gray-900'
        }
      `}
    >
      <svg 
        className="w-20 h-20 mb-4 text-zedzen-purple" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
        />
      </svg>
      
      <h3 className="text-xl font-semibold text-white mb-2">
        {isDragging ? 'Drop files here' : 'Drag & Drop Files'}
      </h3>
      
      <p className="text-gray-400 text-center">
        or click to browse
      </p>
      
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400">
          JPG
        </span>
        <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400">
          PNG
        </span>
        <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400">
          WebP
        </span>
        <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400">
          MP4
        </span>
        <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400">
          AVI
        </span>
      </div>
    </div>
  );
}

export default FileDropzone;
