import React, { useState } from 'react';

function PdfSplitPanel({ onClose }) {
  const [pdfFile, setPdfFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pagesPerSplit, setPagesPerSplit] = useState(128);
  const [outputFolder, setOutputFolder] = useState('');
  const [isSplitting, setIsSplitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleSelectPdf = async () => {
    const filePath = await window.electronAPI.selectPdfFile();
    if (filePath) {
      setPdfFile(filePath);
      setResult(null);
      const pageInfo = await window.electronAPI.getPdfPageCount(filePath);
      if (pageInfo.success) {
        setPageCount(pageInfo.pageCount);
      }
    }
  };

  const handleSelectOutputFolder = async () => {
    const folder = await window.electronAPI.selectFolder();
    if (folder) {
      setOutputFolder(folder);
    }
  };

  const handleSplit = async () => {
    if (!pdfFile || !outputFolder) {
      alert('Please select a PDF file and output folder!');
      return;
    }

    setIsSplitting(true);
    setResult(null);

    try {
      const splitResult = await window.electronAPI.splitPdf({
        inputPath: pdfFile,
        outputFolder: outputFolder,
        pagesPerSplit: parseInt(pagesPerSplit)
      });

      if (splitResult.success) {
        setResult(splitResult);
      } else {
        alert(`Split failed: ${splitResult.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }

    setIsSplitting(false);
  };

  const expectedParts = pageCount > 0 ? Math.ceil(pageCount / pagesPerSplit) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-lg mx-4 border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6 text-zedzen-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF Split
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Select PDF */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select PDF File
          </label>
          <button
            onClick={handleSelectPdf}
            className="w-full p-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-left transition-colors flex items-center justify-between"
          >
            <span className="text-sm text-gray-400 truncate">
              {pdfFile ? pdfFile.split(/[/\\]/).pop() : 'Click to select PDF...'}
            </span>
            <svg className="w-5 h-5 text-gray-500 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          {pageCount > 0 && (
            <p className="mt-2 text-xs text-zedzen-green">
              Total pages: {pageCount}
            </p>
          )}
        </div>

        {/* Pages per split */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Pages per split
          </label>
          <input
            type="number"
            min="1"
            max={pageCount || 1000}
            value={pagesPerSplit}
            onChange={(e) => setPagesPerSplit(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-zedzen-purple focus:outline-none"
          />
          <div className="flex gap-2 mt-2">
            {[50, 100, 128, 200].map((preset) => (
              <button
                key={preset}
                onClick={() => setPagesPerSplit(preset)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  pagesPerSplit === preset
                    ? 'bg-zedzen-purple text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
          {pageCount > 0 && (
            <p className="mt-2 text-xs text-gray-400">
              Will create {expectedParts} file{expectedParts !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Output Folder */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Output Folder
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleSelectOutputFolder}
              className="flex-1 p-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-left transition-colors flex items-center justify-between"
            >
              <span className="text-sm text-gray-400 truncate">
                {outputFolder || 'Click to select folder...'}
              </span>
              <svg className="w-5 h-5 text-gray-500 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </button>
            {outputFolder && (
              <button
                onClick={async () => {
                  await window.electronAPI.openFolder(outputFolder);
                }}
                className="p-3 bg-zedzen-purple hover:bg-purple-600 rounded-lg transition-colors"
                title="Open folder"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="mb-4 p-3 bg-green-900 bg-opacity-30 border border-green-600 rounded-lg">
            <p className="text-sm text-green-400 font-medium mb-2">
              Split completed successfully!
            </p>
            <p className="text-xs text-gray-300">
              Created {result.partsCreated} files from {result.totalPages} pages
            </p>
            <div className="mt-2 max-h-32 overflow-y-auto">
              {result.parts.map((part, index) => (
                <p key={index} className="text-xs text-gray-400">
                  Part {part.part}: pages {part.pages}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Split Button */}
        <button
          onClick={handleSplit}
          disabled={isSplitting || !pdfFile || !outputFolder}
          className={`
            w-full py-3 rounded-lg font-semibold transition-all
            ${isSplitting || !pdfFile || !outputFolder
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-zedzen-purple to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white'
            }
          `}
        >
          {isSplitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Splitting...
            </span>
          ) : (
            `Split PDF into ${expectedParts || '?'} parts`
          )}
        </button>
      </div>
    </div>
  );
}

export default PdfSplitPanel;
