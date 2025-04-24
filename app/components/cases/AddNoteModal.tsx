'use client';

import React, { useState } from 'react';

interface AddNoteModalProps {
  id?: string;
  onNoteAdded?: (notes: {id?: string, code: string, title: string, content: string, noteAddedOn: string}) => void;
}

export default function AddNoteModal({ id, onNoteAdded }: AddNoteModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteAddedOn, setNoteAddedOn] = useState(new Date().toISOString());
  
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    
    const newNote = {
      id: '',
      code: `NOTE-${Date.now()}`,
      title: noteTitle,
      content: noteContent,
      noteAddedOn: noteAddedOn == "" ? new Date().toISOString() : noteAddedOn,
      caseId: id
    }

    // In a real app, you would send this data to your API
    console.log('Adding note to case', newNote);

    if(newNote.caseId !== null && newNote.caseId !== undefined && newNote.caseId !== ""){
      try {
        //First, create the case
        const noteResponse = await fetch('/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }, 
          body: JSON.stringify({
            code: newNote.code,
            title: newNote.title,
            content: newNote.content,
            noteAddedOn: newNote.noteAddedOn,
            caseId: newNote.caseId
          }),
        });
  
        if (!noteResponse.ok) {
          const errorData = await noteResponse.json().catch(() => ({}));
          console.error('Server response:', errorData);
          throw new Error(`Failed to create case: ${noteResponse.status} ${noteResponse.statusText}${errorData.error ? ` - ${errorData.error}` : ''}`);
        }
  
        const noteData = await noteResponse.json();
        newNote.id = noteData.id;
      }
      catch (error) {
        console.error('Error creating note:', error);
      }
    }

    if(onNoteAdded){
      onNoteAdded(newNote);
    }
    
    // Reset form and close modal
    setNoteContent('');
    setNoteTitle('');
    setNoteAddedOn('');
    closeModal();
    
    // In a real app, you would refresh the notes list or update the UI
    console.log('Note added successfully!');
  };
  
  return (
    <>
      <button 
        onClick={openModal}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Note
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-lg font-medium text-gray-900">Add Case Note</h3>
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
                <label htmlFor="noteTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  id="noteTitle"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Enter your case title here..."
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-black"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="noteContent" className="block text-sm font-medium text-gray-700 mb-1">
                  Note Content
                </label>
                <textarea
                  id="noteContent"
                  rows={4}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Enter your case note here..."
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
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}