import React, { useState } from 'react';
import { AuroraBackground } from "../ui/aurora-background.tsx";
import { useNavigate } from 'react-router-dom';
import { postToBackend } from '../../store/fetchdata';
import { baseUrl } from '@/urls.jsx';

const LongLeaveForm = () => {
  const navigate = useNavigate();
  const [dateOfLeaving, setDateOfLeaving] = useState('');
  const [dateOfReturn, setDateOfReturn] = useState('');
  const [reason, setReason] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dateOfLeaving || !dateOfReturn || !reason || !roomNumber || !address) {
      setError('All fields are required.');
      return;
    }

    const applicationData = [
      {
        dateOfLeaving,
        dateOfReturn,
        reason,
        roomNumber,
        address,
      },
    ];

    try {
      const result = await postToBackend(`${baseUrl}/api/leaves/long-leaves/`, applicationData);
      console.log(`application data`, applicationData, result);
      navigate('/LongLeavesView');
    } catch (error) {
      console.error('Error submitting leave request:', error);
      setError('There was an error submitting the leave request.');
    }
  };

  return (
    <div className="relative min-h-screen mt-3">
      <AuroraBackground className="fixed inset-0 pointer-events-none z-0" />

      <div className="relative z-10 flex items-center justify-center min-h-screen mt-2">
      <div className="flex items-center justify-center min-h-screen mt-8">
        <div className=" max-w-3xl bg-white p-8 shadow-lg rounded-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Create Long Leave Request</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {error && <p className="text-red-500 mb-4 col-span-2">{error}</p>}

            <div>
              <label htmlFor="dateOfLeaving" className="block text-sm font-medium text-gray-700">
                Date of Leaving
              </label>
              <input
                type="date"
                id="dateOfLeaving"
                value={dateOfLeaving}
                onChange={(e) => setDateOfLeaving(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="dateOfReturn" className="block text-sm font-medium text-gray-700">
                Date of Return
              </label>
              <input
                type="date"
                id="dateOfReturn"
                value={dateOfReturn}
                onChange={(e) => setDateOfReturn(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                Reason
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="3"
              ></textarea>
            </div>

            <div>
              <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">
                Room No.
              </label>
              <input
                type="text"
                id="roomNumber"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address of Visiting Place
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="col-span-2">
              <button
                type="submit"
                className="w-full bg-violet-500 hover:bg-violet-700 text-white font-semibold py-2 px-4 rounded-md shadow-md"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
};

export default LongLeaveForm;