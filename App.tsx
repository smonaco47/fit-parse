
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import PreviewTable from './components/PreviewTable';
import { WorkoutSet, ProcessingState } from './types';
import { extractWorkoutData } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<ProcessingState>({
    isLoading: false,
    error: null,
    data: null,
  });
  const [progress, setProgress] = useState<string>("");

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFilesSelect = async (files: File[]) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, data: null }));
    const allExtractedData: WorkoutSet[] = [];
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(`Processing ${file.name} (${i + 1}/${files.length})...`);
        
        const base64 = await convertFileToBase64(file);
        const fileData = await extractWorkoutData(base64, file.type);
        allExtractedData.push(...fileData);
      }

      // Sort combined data by date descending
      const sortedData = allExtractedData.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setState({
        isLoading: false,
        error: null,
        data: sortedData,
      });
    } catch (err: any) {
      console.error("Extraction error:", err);
      setState({
        isLoading: false,
        error: err.message || "An unexpected error occurred during processing. Large videos may take longer or fail if they exceed token limits.",
        data: null,
      });
    } finally {
      setProgress("");
    }
  };

  const handleDownloadCSV = useCallback(() => {
    if (!state.data) return;

    const headers = ['date', 'exercise', 'weight', 'reps', 'set_number', 'notes'];
    const csvContent = [
      headers.join(','),
      ...state.data.map(set => [
        `"${set.date}"`,
        `"${set.exercise}"`,
        `"${set.weight}"`,
        set.reps,
        set.set_number,
        `"${(set.notes || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `workout_batch_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [state.data]);

  const handleReset = () => {
    setState({
      isLoading: false,
      error: null,
      data: null,
    });
    setProgress("");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {!state.data && !state.isLoading && (
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                From PDF or Video to Spreadsheet
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload PDFs or <strong>screen recordings</strong> of your workout app. Gemini will watch the recording, identify exercises across different dates, and structure everything for you.
              </p>
            </div>
          )}

          {state.error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 max-w-2xl mx-auto flex items-start gap-3 shadow-sm">
              <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold">Processing Error</p>
                <p className="text-sm opacity-90">{state.error}</p>
                <button onClick={handleReset} className="mt-2 text-xs font-bold uppercase tracking-wider underline hover:no-underline transition-all">Reset & Try again</button>
              </div>
            </div>
          )}

          {!state.data ? (
            <FileUpload 
              onFilesSelect={handleFilesSelect} 
              isLoading={state.isLoading}
              progressMessage={progress}
            />
          ) : (
            <PreviewTable 
              data={state.data} 
              onDownload={handleDownloadCSV}
              onReset={handleReset}
            />
          )}

          {/* Detailed Features */}
          {!state.data && !state.isLoading && (
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Video Understanding</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Simply record yourself scrolling through your workout history. Gemini analyzes the footage to extract every set and rep.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 text-green-600">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Multi-Date Logic</h3>
                <p className="text-gray-600 text-sm leading-relaxed">If your recording or PDF covers multiple dates (e.g. Dec 9 and Dec 12), they are correctly timestamped and grouped.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4 text-amber-600">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Structured CSV</h3>
                <p className="text-gray-600 text-sm leading-relaxed">All data is cleaned and formatted into a single CSV, compatible with Google Sheets, Excel, or specialized trackers.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} FitParse. Using Gemini 3 Flash Multimodal Analysis.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
