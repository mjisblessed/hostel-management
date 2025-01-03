import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkWarden } from '../../store/fetchdata';

const WardenDash = () => {
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const message = await checkWarden(); // Await the result of checkWarden
        if (message === "access denied!") {
          navigate('/AccessDenied'); // Redirect if access is denied
        }
      } catch (error) {
        console.error("Error while checking access:", error);
        navigate('/AccessDenied'); // Redirect on any error
      }
    };

    verifyAccess(); // Call the async function
  }, [navigate]);

  const handleLeavesRedirect = () => {
    setDropdownVisible(!dropdownVisible); // Toggle the dropdown visibility
  };

  const handleLongLeaveRedirect = () => {
    navigate('/LongLeavesApprove'); // Redirect to Long Leave page
  };

  const handleLateLeaveRedirect = () => {
    navigate('/LateLeavesApprove'); // Redirect to Late Leave page
  };

  const handleComplaintsRedirect = () => {
    navigate('/complaintsviewwarden'); // Redirect to Complaints page
  };

  const handleMessScheduleRedirect = () => {
    navigate('/mess-schedule-warden')
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('../../Photos/hostel-dashboard.jpg')" }}>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-green-600 mb-6">Warden Dashboard</h1>
        
        <div className="space-y-4">
          <button
            onClick={handleLeavesRedirect}
            className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Leaves
          </button>
          
          {/* Dropdown Menu for Leaves */}
          {dropdownVisible && (
            <div className="space-y-2 mt-4 transition-all duration-300 ease-in-out transform translate-y-0">
              <button
                onClick={handleLongLeaveRedirect}
                className="w-full py-3 bg-blue-300 text-white rounded-md hover:bg-blue-400 focus:outline-none"
              >
                Long Leaves
              </button>
              <button
                onClick={handleLateLeaveRedirect}
                className="w-full py-3 bg-blue-300 text-white rounded-md hover:bg-blue-400 focus:outline-none"
              >
                Late Leave
              </button>
            </div>
          )}
          
          <button
          onClick={handleMessScheduleRedirect}
          className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
          Mess Schedule
          </button>
          
          <button
            onClick={handleComplaintsRedirect}
            className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Complaints
          </button>
        </div>
      </div>
    </div>
  );
};

export default WardenDash;
