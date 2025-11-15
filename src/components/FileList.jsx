import React from 'react';

function FileList({ files, onRemove, onClearAll }) {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-gray-400';
      case 'converting': return 'text-zedzen-yellow';
      case 'completed': return 'text-zedzen-green';
      case 'error': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
          </svg>
        );
      case 'converting':
        return (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      case 'completed':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">
          Files ({files.length})
        </h2>
        {files.length > 0 && (
          <button
            onClick={onClearAll}
            className="px-3 py-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-900 hover:bg-opacity-20 rounded transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {files.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No files added yet</p>
          </div>
        ) : (
          files.map((file, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-lg p-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className={`${getStatusColor(file.status)}`}>
                  {getStatusIcon(file.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    {formatFileSize(file.size)} • {file.ext}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onRemove(index)}
                className="ml-2 p-2 text-gray-400 hover:text-red-400 hover:bg-red-900 hover:bg-opacity-20 rounded transition-colors"
                disabled={file.status === 'converting'}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FileList;
