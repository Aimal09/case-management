// 'use client';
// import React, { useState } from 'react';
// import { Dialog, Transition } from '@headlessui/react';
// import { Persons } from '../interface/types';

// type EditPersonModalProps = {
//   person: Persons;
//   onPersonUpdated: (updatedPerson: Persons) => void;
// };

// export default function EditPersonModal({ person, onPersonUpdated }: EditPersonModalProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [formData, setFormData] = useState<Persons>({...person});

//   function closeModal() {
//     setIsOpen(false);
//   }

//   function openModal() {
//     setFormData({...person});
//     setIsOpen(true);
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     try {
//       const response = await fetch(`/api/persons/${formData.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to update person');
//       }
      
//       const updatedPerson = await response.json();
      
//       onPersonUpdated({...updatedPerson});
//       closeModal();
//     } catch (error) {
//       console.error('Error updating person:', error);
//     }
//   };

//   return (
//     <>
//       <button
//         type="button"
//         onClick={openModal}
//         className="text-indigo-600 hover:text-indigo-900 ml-3"
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//         </svg>
//       </button>

//       <Transition appear show={isOpen} as={React.Fragment}>
//         <Dialog as="div" className="relative z-10" onClose={closeModal}>
//           <Transition.Child
//             as={React.Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm" />
//           </Transition.Child>

//           <div className="fixed inset-0 overflow-y-auto">
//             <div className="flex min-h-full items-center justify-center p-4 text-center">
//               <Transition.Child
//                 as={React.Fragment}
//                 enter="ease-out duration-300"
//                 enterFrom="opacity-0 scale-95"
//                 enterTo="opacity-100 scale-100"
//                 leave="ease-in duration-200"
//                 leaveFrom="opacity-100 scale-100"
//                 leaveTo="opacity-0 scale-95"
//               >
//                 <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
//                   <Dialog.Title
//                     as="h3"
//                     className="text-lg font-medium leading-6 text-gray-900"
//                   >
//                     Edit Person
//                   </Dialog.Title>
                  
//                   <div className="mt-4">
//                     <div className="space-y-4">
//                       <div>
//                         <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
//                         <input
//                           type="text"
//                           name="name"
//                           id="name"
//                           value={formData.name}
//                           onChange={handleChange}
//                           className="mt-1 block w-full rounded-md border-gray-300 text-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                           required
//                         />
//                       </div>
                      
//                       <div>
//                         <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
//                         <select
//                           name="role"
//                           id="role"
//                           value={formData.role}
//                           onChange={handleChange}
//                           className="mt-1 block w-full rounded-md border-gray-300 text-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                           required
//                         >
//                           <option value="Victim">Victim</option>
//                           <option value="Suspect">Suspect</option>
//                           <option value="Witness">Witness</option>
//                           <option value="Reporting Party">Reporting Party</option>
//                           <option value="Other">Other</option>
//                         </select>
//                       </div>
                      
//                       <div>
//                         <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact</label>
//                         <input
//                           type="text"
//                           name="contact"
//                           id="contact"
//                           value={formData.contact}
//                           onChange={handleChange}
//                           className="mt-1 block w-full rounded-md border-gray-300 text-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                         />
//                       </div>
//                     </div>

//                     <div className="mt-6 flex justify-end space-x-3">
//                       <button
//                         type="button"
//                         className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                         onClick={closeModal}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="submit"
//                         onClick={handleSubmit}
//                         className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                       >
//                         Save Changes
//                       </button>
//                     </div>
//                   </div>
//                 </Dialog.Panel>
//               </Transition.Child>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>
//     </>
//   );
// }