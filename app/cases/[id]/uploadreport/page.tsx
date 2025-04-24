'use client';
import React, { useState, useEffect } from 'react';
import MainLayout from '@/app/components/layout/MainLayout';
import { useParams } from 'next/navigation';
import { Cases } from '@/app/components/interface/types';
import { useAuth } from '@/app/context/AuthContext';
import WithRoleAccess from '@/app/components/auth/withRoleAccess';

export default function CaseDetailPage() {
  const params = useParams();
  const id = params.id;

  const [caseData, setCaseData] = useState<Cases>({});
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchCase() {
      try {
        setLoading(true);
        const res = await fetch(`/api/cases/${id}`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch case: ${res.status}`);
        }
        
        const data = await res.json();
        setCaseData(data);
        
      } catch (err) {
        console.error('Error fetching case:', err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchCase();
    }
  }, [id, refreshKey]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadingReportType, setUploadingReportType] = useState<string | null>(null);

  const handleUpload = async (reportType: string, file: File) => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadingReportType(reportType);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('reportType', reportType);
      formData.append('caseId', id as string);
      
      // Upload the file
      const response = await fetch('/api/reports/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload report');
      }

      // Refresh the case data
      setRefreshKey(prev => prev + 1);
      alert('Report uploaded successfully!');
    } catch (error) {
      console.error('Error uploading report:', error);
      alert('Failed to upload report. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadingReportType(null);
    }
  };

  // Create a ref for the hidden file input
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [currentReportType, setCurrentReportType] = useState<string>('');

  // Function to trigger file input click
  const triggerFileInput = (reportType: string) => {
    setCurrentReportType(reportType);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(currentReportType, e.target.files[0]);
      // Reset the input value so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  return (
    <WithRoleAccess allowedRoles={['AC', 'Mukhtiarkar']}>
      <MainLayout>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        ) : (
          <div className="mb-8">
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-500">Case ID</div>
                    <div className="text-xl font-bold text-gray-800">{caseData.code}</div>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      caseData.status === 'Active' ? 'bg-green-100 text-green-800' :
                      caseData.status === 'Suspended' ? 'bg-red-100 text-black' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {caseData.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">


                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {/* Mukhtiarkar/AC Report */}
                <h3 className="block text-sm font-medium text-gray-700 mb-1">Required Reports</h3>
                {caseData.requiresMukhtiarkarACReport && (
                  <div className="flex items-center justify-between border rounded-lg p-4">
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${caseData.mukhtiarkarACReportUploaded ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {caseData.mukhtiarkarACReportUploaded ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium text-gray-500">Mukhtiarkar/AC Report</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      {caseData.mukhtiarkarACReportUploaded && caseData.mukhtiarkarACReportPath && (
                        <a 
                          href={caseData.mukhtiarkarACReportPath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download
                        </a>
                      )}
                      {(user?.role === 'AC' || user?.role === 'Mukhtiarkar') && (
                        <button 
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => triggerFileInput('mukhtiarkarACReport')}
                          disabled={isUploading}
                        >
                          {isUploading && uploadingReportType === 'mukhtiarkarACReport' ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Uploading...
                            </span>
                          ) : 'Upload'}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Evacuee Property Report */}
                {caseData.requiresEvacueePropertyReport && (
                  <div className="flex items-center justify-between border rounded-lg p-4">
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${caseData.evacueePropertyReportUploaded ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {caseData.evacueePropertyReportUploaded ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium text-gray-500">Evacuee Property Report</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      {caseData.evacueePropertyReportUploaded && caseData.evacueePropertyReportPath && (
                          <a 
                            href={caseData.evacueePropertyReportPath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                          </a>
                      )}
                      {(user?.role === 'AC' || user?.role === 'Mukhtiarkar') && (
                        <button 
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => triggerFileInput('evacueePropertyReport')}
                          disabled={isUploading}
                        >
                          {isUploading && uploadingReportType === 'evacueePropertyReport' ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Uploading...
                            </span>
                          ) : 'Upload'}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Barrage Branch Report */}
                {caseData.requiresBarrageBranchReport && (
                  <div className="flex items-center justify-between border rounded-lg p-4">
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${caseData.barrageBranchReportUploaded ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {caseData.barrageBranchReportUploaded ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium text-gray-500">Barrage Branch Report</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      {caseData.barrageBranchReportUploaded && caseData.barrageBranchReportPath && (
                        <a 
                          href={caseData.barrageBranchReportPath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download
                        </a>
                      )}
                      {(user?.role === 'AC' || user?.role === 'Mukhtiarkar') && (
                        <button 
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => triggerFileInput('barrageBranchReport')}
                          disabled={isUploading}
                        >
                          {isUploading && uploadingReportType === 'barrageBranchReport' ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Uploading...
                            </span>
                          ) : 'Upload'}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Newspaper Publication */}
                {caseData.requiresNewspaperPublication && (
                  <div className="flex items-center justify-between border rounded-lg p-4">
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${caseData.newspaperPublicationUploaded ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {caseData.newspaperPublicationUploaded ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium text-gray-500">Newspaper Publication</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      {caseData.newspaperPublicationUploaded && caseData.newspaperPublicationPath && (
                        <a 
                          href={caseData.newspaperPublicationPath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download
                        </a>
                      )}
                      {(user?.role === 'AC' || user?.role === 'Mukhtiarkar') && (
                        <button 
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => triggerFileInput('newspaperPublication')}
                          disabled={isUploading}
                        >
                          {isUploading && uploadingReportType === 'newspaperPublication' ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Uploading...
                            </span>
                          ) : 'Upload'}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </MainLayout>
    </WithRoleAccess>

  )
};
