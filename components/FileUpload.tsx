
import React from 'react';

interface FileUploadProps {
  onFilesSelect: (files: File[]) => void;
  isLoading: boolean;
  progressMessage?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelect, isLoading, progressMessage }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const filesArray = Array.from(selectedFiles) as File[];
      const allowedTypes = ['application/pdf', 'video/mp4', 'video/quicktime', 'video/x-m4v'];
      const validFiles = filesArray.filter(file => allowedTypes.includes(file.type));
      
      if (validFiles.length !== filesArray.length) {
        alert("Some files were skipped. Please upload PDF or Video (MP4) files only.");
      }
      
      if (validFiles.length > 0) {
        onFilesSelect(validFiles);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <label className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-xl transition-all duration-200 ${isLoading ? 'cursor-not-allowed bg-gray-50' : 'cursor-pointer bg-white hover:bg-gray-50'}`}>
        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-10 w-10 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-sm text-gray-700 font-semibold mb-1">Processing your files...</p>
              <p className="text-xs text-gray-500">{progressMessage || "Analyzing content..."}</p>
            </div>
          ) : (
            <>
              <div className="flex gap-4 mb-4">
                <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="mb-2 text-sm text-gray-700">
                <span className="font-semibold">Upload PDFs or Screen Recordings</span>
              </p>
              <p className="text-xs text-gray-500">Drop your files here to extract workout data</p>
            </>
          )}
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="application/pdf,video/mp4,video/quicktime" 
          onChange={handleFileChange}
          disabled={isLoading}
          multiple
        />
      </label>
    </div>
  );
};

export default FileUpload;
