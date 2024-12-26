import React, { useState, useEffect } from 'react';
import { getFromBackend, patchToBackend } from '../../store/fetchdata';

const LongLeavesApprove = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [timeFrame, setTimeFrame] = useState('1 week');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  useEffect(() => {
    fetchApplications(timeFrame);
  }, [timeFrame]);

  const fetchApplications = (time) => {
    console.log('Fetching applications for time:', time); // Debug log
    getFromBackend(`http://127.0.0.1:5090/api/warden/long-leaves/${time}`)
      .then(response => {
        console.log('Response from backend:', response); 
        setApplications(response.data || []);
      })
      .catch(error => {
        console.error('Error fetching leave applications:', error.response ? error.response.data : error.message);
        alert('Failed to fetch applications. Check the console for details.');
      });
  };

  const handleApplicationClick = (longLeaveId) => {
    setSelectedApplication(prev => (prev === longLeaveId ? null : longLeaveId));
  };

  const handleAction = (parentId, sid, action) => {
    const longLeaveId = applications.find(app => app.sid === sid)?.longLeaves._id;

    if (action === 'decline') {
      patchToBackend(`http://127.0.0.1:5090/api/warden/long-leaves/delete/`, { sid, object_id: longLeaveId })
        .then(() => {
          alert('Application declined and removed successfully!');
          setApplications(prev => prev.filter(app => app.longLeaves._id !== longLeaveId));
        })
        .catch(error => {
          console.error('Error declining application:', error.response ? error.response.data : error.message);
          alert('Failed to decline application.');
        });
    } else if (action === 'approve') {
      patchToBackend(`http://127.0.0.1:5090/api/warden/long-leaves/approve/`, { sid, object_id: longLeaveId })
        .then(() => {
          alert('Application approved successfully!');
          setApplications(prev =>
            prev.map(app =>
              app.longLeaves._id === longLeaveId
                ? { ...app, longLeaves: { ...app.longLeaves, approved: true } }
                : app
            )
          );
        })
        .catch(error => {
          console.error('Error approving application:', error.response ? error.response.data : error.message);
          alert('Failed to approve application.');
        });
    }
  };

  const handleTimeFrameChange = (event) => {
    setTimeFrame(event.target.value);
  };

  // Pagination logic
  const totalPages = Math.ceil(applications.length / itemsPerPage);
  const currentApplications = applications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return; // Prevent going out of bounds
    setCurrentPage(page);
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-20 pb-6">
      <h1 className="text-2xl font-bold text-center mb-6">Long Leave Applications</h1>

      <div className="max-w-4xl mx-auto mb-6">
        <label htmlFor="time-frame" className="block text-gray-700 font-semibold mb-2">
          Select Time Frame:
        </label>
        <div className="flex items-center gap-4">
          <select
            id="time-frame"
            value={timeFrame}
            onChange={handleTimeFrameChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="1 week">1 Week</option>
            <option value="2 weeks">2 Weeks</option>
            <option value="3 weeks">3 Weeks</option>
            <option value="4 weeks">4 Weeks</option>
          </select>
          <button
            onClick={() => fetchApplications(timeFrame)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Apply Filter
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        {currentApplications.length > 0 ? (
          currentApplications.map(application => {
            const uniqueKey = application.longLeaves._id.toString();

            return (
              <div key={uniqueKey} className="border-b border-gray-200">
                <div
                  className="flex justify-between items-center p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleApplicationClick(application.longLeaves._id)}
                >
                  <div>
                    <p className="text-lg font-semibold">{application.name}</p>
                    <p className="text-sm text-gray-600">
                      SID: {application.sid} | Branch: {application.branch}
                    </p>
                  </div>
                  <span className="text-gray-500">{selectedApplication === application.longLeaves._id ? '▲' : '▼'}</span>
                </div>
                {selectedApplication === application.longLeaves._id && (
                  <div className="p-4 bg-gray-50">
                    <p><strong>Reason:</strong> {application.longLeaves.reason}</p>
                    <p><strong>Start Date:</strong> {application.longLeaves.dateOfLeaving}</p>
                    <p><strong>End Date:</strong> {application.longLeaves.dateOfReturn}</p>
                    <p><strong>Room No.:</strong> {application.longLeaves.roomNumber}</p>
                    <p><strong>Address:</strong> {application.longLeaves.address}</p>
                    <p><strong>Status:</strong> {application.longLeaves.approved ? 'Approved' : 'Pending'}</p>
                    <div className="flex gap-4 mt-4">
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        onClick={() => handleAction(application._id, application.sid, 'approve')}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={() => handleAction(application._id, application.sid, 'decline')}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center p-6 text-gray-500">No long leave applications available.</p>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center gap-4 p-4">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-300 text-gray-700 px-3 py-1 text-sm rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-lg">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-gray-300 text-gray-700 px-3 py-1 text-sm rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default LongLeavesApprove;
