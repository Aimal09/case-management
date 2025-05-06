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
  
  // Add state for Mukhtiarkar users and selection
  const [mukhtiarkarUsers, setMukhtiarkarUsers] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedMukhtiarkar, setSelectedMukhtiarkar] = useState<string>('');
  const [isForwarding, setIsForwarding] = useState(false);
  const [forwardedTo, setForwardedTo] = useState<{id: string, name: string} | null>(null);

  const [reports, setReports] = useState<any[]>([]);
  const [isForwardingReport, setIsForwardingReport] = useState<string | null>(null);

  // Fetch Mukhtiarkar users
  useEffect(() => {
    async function fetchMukhtiarkarUsers() {
      try {
        const response = await fetch('/api/users?role=Mukhtiarkar');
        if (!response.ok) {
          throw new Error('Failed to fetch Mukhtiarkar users');
        }
        const data = await response.json();
        setMukhtiarkarUsers(data);
      } catch (error) {
        console.error('Error fetching Mukhtiarkar users:', error);
      }
    }
    
    fetchMukhtiarkarUsers();
  }, []);

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch(`/api/reports/${id}`);
        if (response.ok) {
          const data = await response.json();
          setReports(data);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    }

    if (id) {
      fetchReports();
    }
    
    async function fetchCase() {
      try {
        setLoading(true);
        const res = await fetch(`/api/cases/${id}`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch case: ${res.status}`);
        }
        
        const data = await res.json();
        setCaseData(data);
        
        // Check if case is already forwarded
        if (data.forwardedToMukhtiarkarId) {
          // Fetch the Mukhtiarkar user details
          const userRes = await fetch(`/api/users/${data.forwardedToMukhtiarkarId}`);
          if (userRes.ok) {
            const userData = await userRes.json();
            setForwardedTo(userData);
          }
        }
        
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

  // Handle forwarding case to Mukhtiarkar
  const handleForwardCase = async () => {
    if (!selectedMukhtiarkar) {
      alert('Please select a Mukhtiarkar to forward the case to.');
      return;
    }
    
    setIsForwarding(true);
    
    try {
      const response = await fetch('/api/cases/forward', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caseId: id,
          userId: user?.id, // Current user ID
          userName: user?.name, // Current user name
          assignedToUserId: selectedMukhtiarkar // Selected Mukhtiarkar ID
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to forward case');
      }

      // Refresh the case data
      setRefreshKey(prev => prev + 1);
      alert('Case forwarded successfully!');
      setSelectedMukhtiarkar('');
    } catch (error) {
      console.error('Error forwarding case:', error);
      alert('Failed to forward case. Please try again.');
    } finally {
      setIsForwarding(false);
    }
  };

  // Add this function to handle report forwarding
  const handleForwardReport = async (reportType: string) => {
    setIsForwardingReport(reportType);
    
    try {
      const response = await fetch('/api/reports/forward', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType,
          userRole: user?.role,
          caseId: id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to forward report');
      }

      // Refresh the reports data
      setRefreshKey(prev => prev + 1);
      alert('Report forwarded successfully!');
    } catch (error) {
      console.error('Error forwarding report:', error);
      alert('Failed to forward report. Please try again.');
    } finally {
      setIsForwardingReport(null);
    }
  };

  // Helper function to check if a report is forwarded
  const isReportForwarded = (reportType: string) => {
    const report = reports.find(r => r.reportType === reportType);
    if (!report) return false;
    
    return user?.role === 'Mukhtiarkar' 
      ? report.forwardedByMukhiarkar 
      : report.forwardedByAC;
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
                {/* Forward to Mukhtiarkar section */}
                {user?.role === 'AC' && (
                  <div className="mb-6 p-4 border rounded-lg bg-blue-50">
                    <h3 className="text-lg font-medium text-gray-700 mb-3">Forward Case to Mukhtiarkar</h3>
                    
                    {forwardedTo ? (
                      <div className="flex items-center text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Case forwarded to <strong>{forwardedTo.name}</strong></span>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-grow">
                          <label htmlFor="mukhtiarkar" className="block text-sm font-medium text-gray-700 mb-1">
                            Select Mukhtiarkar
                          </label>
                          <select
                            id="mukhtiarkar"
                            value={selectedMukhtiarkar}
                            onChange={(e) => setSelectedMukhtiarkar(e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-black"
                          >
                            <option value="">-- Select Mukhtiarkar --</option>
                            {mukhtiarkarUsers.map((mukhtiarkar) => (
                              <option key={mukhtiarkar.id} value={mukhtiarkar.id}>
                                {mukhtiarkar.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={handleForwardCase}
                            disabled={isForwarding || !selectedMukhtiarkar}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isForwarding ? (
                              <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Forwarding...
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                                Forward Case
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Case forwarded status for Mukhtiarkar view */}
                {user?.role === 'Mukhtiarkar' && forwardedTo && forwardedTo.id === user.id && (
                  <div className="mb-6 p-4 border rounded-lg bg-green-50">
                    <div className="flex items-center text-green-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>This case has been forwarded to you by <strong>{caseData.forwardedByName || 'AC'}</strong></span>
                    </div>
                  </div>
                )}

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
                    {((user?.role === 'AC' || user?.role === 'Mukhtiarkar') && caseData.mukhtiarkarACReportUploaded) && (
                      <button 
                        className={`px-3 py-1 text-sm rounded flex items-center ${
                          isReportForwarded('mukhtiarkarACReport') 
                            ? 'bg-gray-300 text-gray-700 cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                        onClick={() => handleForwardReport('mukhtiarkarACReport')}
                        disabled={isForwardingReport === 'mukhtiarkarACReport' || isReportForwarded('mukhtiarkarACReport')}
                      >
                        {isForwardingReport === 'mukhtiarkarACReport' ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Forwarding...
                          </span>
                        ) : isReportForwarded('mukhtiarkarACReport') ? (
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Forwarded to {user.role === 'Mukhtiarkar'? 'AC' : 'DD'}
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            Forward to {user.role === 'Mukhtiarkar'? 'AC' : 'DD'}
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Evacuee Property Report */}
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
                    {((user?.role === 'AC' || user?.role === 'Mukhtiarkar') && caseData.evacueePropertyReportUploaded) && (
                      <button 
                        className={`px-3 py-1 text-sm rounded flex items-center ${
                          isReportForwarded('evacueePropertyReport') 
                            ? 'bg-gray-300 text-gray-700 cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                        onClick={() => handleForwardReport('evacueePropertyReport')}
                        disabled={isForwardingReport === 'evacueePropertyReport' || isReportForwarded('evacueePropertyReport')}
                      >
                        {isForwardingReport === 'evacueePropertyReport' ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Forwarding...
                          </span>
                        ) : isReportForwarded('evacueePropertyReport') ? (
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Forwarded to {user.role === 'Mukhtiarkar'? 'AC' : 'DD'}
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            Forward to {user.role === 'Mukhtiarkar'? 'AC' : 'DD'}
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Barrage Branch Report */}
                
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
                    {((user?.role === 'AC' || user?.role === 'Mukhtiarkar') && caseData.barrageBranchReportUploaded) && (
                      <button 
                        className={`px-3 py-1 text-sm rounded flex items-center ${
                          isReportForwarded('barrageBranchReport') 
                            ? 'bg-gray-300 text-gray-700 cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                        onClick={() => handleForwardReport('barrageBranchReport')}
                        disabled={isForwardingReport === 'barrageBranchReport' || isReportForwarded('barrageBranchReport')}
                      >
                        {isForwardingReport === 'barrageBranchReport' ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Forwarding...
                          </span>
                        ) : isReportForwarded('barrageBranchReport') ? (
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Forwarded to {user.role === 'Mukhtiarkar'? 'AC' : 'DD'}
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            Forward to {user.role === 'Mukhtiarkar'? 'AC' : 'DD'}
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </div>


                {/* Newspaper Publication */}
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
                      {((user?.role === 'AC' || user?.role === 'Mukhtiarkar') && caseData.newspaperPublicationUploaded) && (
                      <button 
                        className={`px-3 py-1 text-sm rounded flex items-center ${
                          isReportForwarded('newspaperPublication') 
                            ? 'bg-gray-300 text-gray-700 cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                        onClick={() => handleForwardReport('newspaperPublication')}
                        disabled={isForwardingReport === 'newspaperPublication' || isReportForwarded('newspaperPublication')}
                      >
                        {isForwardingReport === 'newspaperPublication' ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Forwarding...
                          </span>
                        ) : isReportForwarded('newspaperPublication') ? (
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Forwarded to {user.role === 'Mukhtiarkar'? 'AC' : 'DD'}
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            Forward to {user.role === 'Mukhtiarkar'? 'AC' : 'DD'}
                          </span>
                        )}
                      </button>
                    )}
                    </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </MainLayout>
    </WithRoleAccess>

  )
};
