'use client';

import React, { useState } from 'react';

interface AddEvidenceModalProps {
  id?: string;
  onEvidenceAdded?: (evidence: { id?: string, code: string, type: string, description: string, dateCollected: string }) => void;
}

export default function AddEvidenceModal({ id, onEvidenceAdded }: AddEvidenceModalProps) {
  const getCurrentLocalDatetime = (): string => {
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 16);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [evidenceType, setEvidenceType] = useState('Photograph');
  const [description, setDescription] = useState('');
  const [dateCollected, setDateCollected] = useState(getCurrentLocalDatetime());
  
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a simple ID for the new evidence
    const newEvidence = {
      id: '',
      code: `EVD-${Date.now()}`,
      type: evidenceType,
      description: description,
      dateCollected: dateCollected == "" ? getCurrentLocalDatetime() : dateCollected,
      caseId: id
    };

    // In a real app, you would send this data to your API
    console.log('Adding evidence to case', newEvidence);

    if(newEvidence.caseId !== null && newEvidence.caseId !== undefined && newEvidence.caseId !== ""){
      try {
        //First, create the case
        const evidenceResponse = await fetch('/api/evidences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }, 
          body: JSON.stringify({
            code: newEvidence.code,
            type: newEvidence.type,
            description: newEvidence.description,
            dateCollected: new Date(newEvidence.dateCollected).toISOString(),
            caseId: newEvidence.caseId,
          }),
        });
  
        if (!evidenceResponse.ok) {
          const errorData = await evidenceResponse.json().catch(() => ({}));
          console.error('Server response:', errorData);
          throw new Error(`Failed to create case: ${evidenceResponse.status} ${evidenceResponse.statusText}${errorData.error ? ` - ${errorData.error}` : ''}`);
        }
  
        const evidenceData = await evidenceResponse.json();
        newEvidence.id = evidenceData.id;

      }
      catch (error) {
        console.error('Error creating case:', error);
      }
    }
    
    // Call the callback if provided
    if (onEvidenceAdded) {
      onEvidenceAdded(newEvidence);
    }
    
    // Reset form and close modal
    setEvidenceType('Photograph');
    setDescription('');
    setDateCollected(getCurrentLocalDatetime());
    closeModal();
    
    // In a real app, you would refresh the evidence list or update the UI
    console.log('Evidence added successfully!');
  };
  
  return (
    <>
      <button 
        type="button"
        onClick={openModal}
        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Evidence
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-lg font-medium text-gray-900">Add Evidence to Case</h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-5">
              <div className="mb-4">
                <label htmlFor="evidenceType" className="block text-sm font-medium text-gray-700 mb-1">
                  Evidence Type
                </label>
                <select
                  id="evidenceType"
                  value={evidenceType}
                  onChange={(e) => setEvidenceType(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-black"
                  required
                >
                  <option value="Photograph">Photograph</option>
                  <option value="Video">Video</option>
                  <option value="Audio">Audio</option>
                  <option value="Document">Document</option>
                  <option value="Fingerprint">Fingerprint</option>
                  <option value="Physical Item">Physical Item</option>
                  <option value="Digital">Digital</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the evidence..."
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-black"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="dateCollected" className="block text-sm font-medium text-gray-700 mb-1">
                  Date Collected
                </label>
                <input
                  type="datetime-local"
                  id="dateCollected"
                  value={dateCollected}
                  onChange={(e) => setDateCollected(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-black"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add Evidence
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}