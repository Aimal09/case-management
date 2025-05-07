// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';

// interface AddPersonModalProps {
//   id?: string;
//   onPersonAdded?: (person: { id?: string, code: string, name: string, role: string, contact: string, addedOn: string }) => void;
// }

// export default function AddPersonModal({ id, onPersonAdded }: AddPersonModalProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [personName, setPersonName] = useState('');
//   const [personRole, setPersonRole] = useState('Witness');
//   const [contactInfo, setContactInfo] = useState('');
//   const [addedOn, setAddedOn] = useState(new Date().toISOString());
  
//   const router = useRouter();
//   const openModal = () => setIsOpen(true);
//   const closeModal = () => setIsOpen(false);
  
//   const handleSubmit = async(e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Generate a simple ID for the new person
//     const newPerson = {
//       id: '',
//       code: `PER-${Date.now()}`,
//       name: personName,
//       role: personRole,
//       contact: contactInfo,
//       addedOn: addedOn == "" ? new Date().toISOString() : addedOn,
//       caseId: id,
//     };
    
//     // In a real app, you would send this data to your API
//     console.log('Adding person to case', newPerson);
    
//     if(newPerson.caseId !== null && newPerson.caseId !== undefined && newPerson.caseId !== ""){
//       try {
//         //First, create the case
//         const personResponse = await fetch('/api/persons', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           }, 
//           body: JSON.stringify({
//             code: newPerson.code,
//             name: newPerson.name,
//             role: newPerson.role,
//             contact: newPerson.contact,
//             addedOn: newPerson.addedOn,
//             caseId: newPerson.caseId,
//           }),
//         });
  
//         if (!personResponse.ok) {
//           const errorData = await personResponse.json().catch(() => ({}));
//           console.error('Server response:', errorData);
//           throw new Error(`Failed to create case: ${personResponse.status} ${personResponse.statusText}${errorData.error ? ` - ${errorData.error}` : ''}`);
//         }
  
//         const evidenceData = await personResponse.json();
//         newPerson.id = evidenceData.id;

//       }
//       catch (error) {
//         console.error('Error creating person:', error);
//       }
//     }

    
//     // Call the callback if provided
//     if (onPersonAdded) {
//       onPersonAdded(newPerson);
//     }
    
//     // Reset form and close modal
//     setPersonName('');
//     setPersonRole('Witness');
//     setContactInfo('');
//     setAddedOn('');
//     closeModal();
    
//     // In a real app, you would refresh the persons list or update the UI
//     console.log('Person added successfully!');
//   };
  
//   return (
//     <>
//       <button 
//         type="button"
//         onClick={openModal}
//         className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//         </svg>
//         Add Person
//       </button>
      
//       {isOpen && (
//         <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
//           <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
//             <div className="flex justify-between items-center p-5 border-b">
//               <h3 className="text-lg font-medium text-gray-900">Add Person to Case</h3>
//               <button 
//                 onClick={closeModal}
//                 className="text-gray-400 hover:text-gray-500"
//               >
//                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
            
//             <div className="p-5">
//               <div className="mb-4">
//                 <label htmlFor="personName" className="block text-sm font-medium text-gray-700 mb-1">
//                   Person Name
//                 </label>
//                 <input
//                   type="text"
//                   id="personName"
//                   value={personName}
//                   onChange={(e) => setPersonName(e.target.value)}
//                   placeholder="Enter person's full name"
//                   className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-black"
//                   required
//                 />
//               </div>
              
//               <div className="mb-4">
//                 <label htmlFor="personRole" className="block text-sm font-medium text-gray-700 mb-1">
//                   Role
//                 </label>
//                 <select
//                   id="personRole"
//                   value={personRole}
//                   onChange={(e) => setPersonRole(e.target.value)}
//                   className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-black"
//                   required
//                 >
//                   <option value="Witness">Witness</option>
//                   <option value="Victim">Victim</option>
//                   <option value="Suspect">Suspect</option>
//                   <option value="Reporting Party">Reporting Party</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
              
//               <div className="mb-4">
//                 <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-1">
//                   Contact Information
//                 </label>
//                 <input
//                   type="text"
//                   id="contactInfo"
//                   value={contactInfo}
//                   onChange={(e) => setContactInfo(e.target.value)}
//                   placeholder="Phone number or email"
//                   className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-black"
//                   required
//                 />
//               </div>
              
//               <div className="flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   onClick={handleSubmit}
//                   className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
//                 >
//                   Add Person
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }