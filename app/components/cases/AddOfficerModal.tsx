// 'use client';

// import React, { useState } from 'react';

// interface AddOfficerModalProps {
//   id?: string;
//   onOfficerAdded?: (officer: { id?: string, code: string, name: string, badge: string }) => void;
// }

// export default function AddOfficerModal({ id, onOfficerAdded }: AddOfficerModalProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [officerName, setOfficerName] = useState('');
//   const [badgeNumber, setBadgeNumber] = useState('');
  
//   const openModal = () => setIsOpen(true);
//   const closeModal = () => setIsOpen(false);
  
//   const handleSubmit = async(e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Generate a simple ID for the new officer
//     const newOfficer = {
//       id: '',
//       code: `OFF-${Date.now()}`,
//       name: officerName,
//       badge: badgeNumber,
//       caseId: id,
//     };
    
//     // In a real app, you would send this data to your API
//     console.log('Adding officer to case', newOfficer);
    
//     if(newOfficer.caseId !== null && newOfficer.caseId !== undefined && newOfficer.caseId !== ""){
//       try {
//         //First, create the case
//         const officerResponse = await fetch('/api/officers', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           }, 
//           body: JSON.stringify({
//             code: newOfficer.code,
//             name: newOfficer.name,
//             badge: newOfficer.badge,
//             caseId: newOfficer.caseId,
//           }),
//         });
  
//         if (!officerResponse.ok) {
//           const errorData = await officerResponse.json().catch(() => ({}));
//           console.error('Server response:', errorData);
//           throw new Error(`Failed to create case: ${officerResponse.status} ${officerResponse.statusText}${errorData.error ? ` - ${errorData.error}` : ''}`);
//         }
  
//         const officerData = await officerResponse.json();
//         newOfficer.id = officerData.id;
//       }
//       catch (error) {
//         console.error('Error creating officer:', error);
//       }
//     }

//     // Call the callback if provided
//     if (onOfficerAdded) {
//       onOfficerAdded(newOfficer);
//     }
    
//     // Reset form and close modal
//     setOfficerName('');
//     setBadgeNumber('');
//     closeModal();
    
//     // In a real app, you would refresh the officers list or update the UI
//     console.log('Officer added successfully!');
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
//         Assign Officer
//       </button>
      
//       {isOpen && (
//         <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
//           <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
//             <div className="flex justify-between items-center p-5 border-b">
//               <h3 className="text-lg font-medium text-gray-900">Assign Officer to Case</h3>
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
//                 <label htmlFor="officerName" className="block text-sm font-medium text-gray-700 mb-1">
//                   Officer Name
//                 </label>
//                 <input
//                   type="text"
//                   id="officerName"
//                   value={officerName}
//                   onChange={(e) => setOfficerName(e.target.value)}
//                   placeholder="Enter officer's full name"
//                   className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-black"
//                   required
//                 />
//               </div>
              
//               <div className="mb-4">
//                 <label htmlFor="badgeNumber" className="block text-sm font-medium text-gray-700 mb-1">
//                   Badge Number
//                 </label>
//                 <input
//                   type="text"
//                   id="badgeNumber"
//                   value={badgeNumber}
//                   onChange={(e) => setBadgeNumber(e.target.value)}
//                   placeholder="Enter badge number"
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
//                   Add Officer
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }