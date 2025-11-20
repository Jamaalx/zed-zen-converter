import React, { useState } from 'react';
import Header from './components/Header';
import FileDropzone from './components/FileDropzone';
import ConversionPanel from './components/ConversionPanel';
import FileList from './components/FileList';
import Footer from './components/Footer';
import AboutModal from './components/AboutModal';
import TermsModal from './components/TermsModal';
import PrivacyModal from './components/PrivacyModal';
import PopupManager from './components/PopupManager';
import PremiumFeatureCard from './components/PremiumFeatureCard';
import analytics from './utils/analytics';

function App() {
  const [files, setFiles] = useState([]);
  const [outputFormat, setOutputFormat] = useState('webp');
  const [quality, setQuality] = useState(85);
  const [outputFolder, setOutputFolder] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [showPremiumFeatures, setShowPremiumFeatures] = useState(false);
  const [compressionMode, setCompressionMode] = useState(false);

  // Resize state
  const [resizeEnabled, setResizeEnabled] = useState(false);
  const [resizeWidth, setResizeWidth] = useState(null);
  const [resizeHeight, setResizeHeight] = useState(null);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

  const handleFilesAdded = async (newFiles) => {
    const fileInfoPromises = newFiles.map(async (filePath) => {
      const info = await window.electronAPI.getFileInfo(filePath);
      return {
        ...info,
        status: 'pending',
        progress: 0
      };
    });
    
    const fileInfos = await Promise.all(fileInfoPromises);
    setFiles(prev => [...prev, ...fileInfos]);
  };

  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setFiles([]);
  };

  const handleSelectOutputFolder = async () => {
    const folder = await window.electronAPI.selectFolder();
    if (folder) {
      setOutputFolder(folder);
    }
  };

  const handleStartConversion = async () => {
    if (files.length === 0) {
      alert('Please add files first!');
      return;
    }
    
    if (!outputFolder) {
      alert('Please select output folder!');
      return;
    }

    setIsConverting(true);
    
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Update to converting
      setFiles(prev => prev.map((f, index) => 
        index === i ? { ...f, status: 'converting', progress: 50 } : f
      ));
      
      try {
        // Determine output format
        const finalFormat = compressionMode 
          ? file.ext.replace('.', '') // Keep same format when compressing
          : outputFormat;

        // Real conversion!
        const result = await window.electronAPI.convertFile({
          inputPath: file.path,
          outputFolder: outputFolder,
          format: finalFormat,
          quality: quality,
          fileName: file.name,
          compressionOnly: compressionMode,
          resize: resizeEnabled ? {
            width: resizeWidth,
            height: resizeHeight,
            maintainAspectRatio: maintainAspectRatio
          } : null
        });
        
        if (result.success) {
          // Success!
          setFiles(prev => prev.map((f, index) => 
            index === i ? { ...f, status: 'completed', progress: 100 } : f
          ));
          successCount++;
          
          // Track conversion for analytics
          analytics.incrementConversion();
        } else {
          // Error
          setFiles(prev => prev.map((f, index) => 
            index === i ? { ...f, status: 'error', progress: 0, error: result.error } : f
          ));
          errorCount++;
          console.error('Conversion failed:', result.error);
        }
      } catch (error) {
        // Error
        setFiles(prev => prev.map((f, index) => 
          index === i ? { ...f, status: 'error', progress: 0, error: error.message } : f
        ));
        errorCount++;
        console.error('Conversion error:', error);
      }
    }

    setIsConverting(false);
    
    // Show completion message
    const action = compressionMode ? 'compressed' : 'converted';
    if (errorCount === 0) {
      alert(`🎉 ${successCount} file${successCount > 1 ? 's' : ''} ${action} successfully!\n\nCheck your output folder: ${outputFolder}`);
    } else {
      alert(`⚠️ Completed with errors!\n✅ Success: ${successCount}\n❌ Failed: ${errorCount}`);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-zedzen-black">
      <Header onAboutClick={() => setIsAboutOpen(true)} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - File Management */}
        <div className="w-2/3 flex flex-col p-6 border-r border-gray-800">
          <FileDropzone onFilesAdded={handleFilesAdded} />
          
          {/* Premium Features Teaser */}
          <button
            onClick={() => setShowPremiumFeatures(!showPremiumFeatures)}
            className="mt-4 p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg text-gray-900 font-bold hover:scale-105 transition-transform flex items-center justify-between"
          >
            <span>✨ Unlock Premium Features</span>
            <svg 
              className={`w-5 h-5 transition-transform ${showPremiumFeatures ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Premium Features Grid */}
          {showPremiumFeatures && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <PremiumFeatureCard
                feature="AI Background Removal"
                icon="🎨"
                description="Remove backgrounds instantly with AI"
              />
              <PremiumFeatureCard
                feature="Google Drive"
                icon="☁️"
                description="Save and load directly from cloud"
              />
              <PremiumFeatureCard
                feature="Batch Templates"
                icon="⚡"
                description="Save and reuse conversion settings"
              />
              <PremiumFeatureCard
                feature="Watermarks"
                icon="©️"
                description="Add custom watermarks to images"
              />
            </div>
          )}
          
          <div className="flex-1 mt-6 overflow-hidden">
            <FileList 
              files={files}
              onRemove={handleRemoveFile}
              onClearAll={handleClearAll}
            />
          </div>
        </div>

        {/* Right Panel - Conversion Settings */}
        <div className="w-1/3 flex flex-col">
          <ConversionPanel
            outputFormat={outputFormat}
            setOutputFormat={setOutputFormat}
            quality={quality}
            setQuality={setQuality}
            outputFolder={outputFolder}
            onSelectFolder={handleSelectOutputFolder}
            onStartConversion={handleStartConversion}
            isConverting={isConverting}
            fileCount={files.length}
            files={files}
            compressionMode={compressionMode}
            setCompressionMode={setCompressionMode}
            resizeEnabled={resizeEnabled}
            setResizeEnabled={setResizeEnabled}
            resizeWidth={resizeWidth}
            setResizeWidth={setResizeWidth}
            resizeHeight={resizeHeight}
            setResizeHeight={setResizeHeight}
            maintainAspectRatio={maintainAspectRatio}
            setMaintainAspectRatio={setMaintainAspectRatio}
          />
        </div>
      </div>

      {/* Footer */}
      <Footer 
        onTermsClick={() => setIsTermsOpen(true)}
        onPrivacyClick={() => setIsPrivacyOpen(true)}
      />
      
      {/* Modals */}
      <AboutModal 
        isOpen={isAboutOpen} 
        onClose={() => setIsAboutOpen(false)} 
      />
      
      <TermsModal 
        isOpen={isTermsOpen} 
        onClose={() => setIsTermsOpen(false)} 
      />
      
      <PrivacyModal 
        isOpen={isPrivacyOpen} 
        onClose={() => setIsPrivacyOpen(false)} 
      />

      {/* Strategic Popups */}
      <PopupManager conversionsThisSession={analytics.conversionsThisSession} />
    </div>
  );
}

export default App;