import { useState, useEffect, useCallback } from "react";
import apiService from "../../Api/apiService";
import AssignTask from "./AssignTask";
import StaffReports from "./StaffReports";
import { FaSpinner, FaUserPlus, FaTimes, FaTrash } from "react-icons/fa";

const AssignTaskMain = () => {
  // Loading states
  const [loading, setLoading] = useState({
    staff: false,
    tasks: false,
    reports: false,
    deleting: false,
    reassigning: false
  });
  
  // Data states
  const [data, setData] = useState({
    staff: [],
    assignedTasks: [],
    staffReports: []
  });
  
  // Modal state
  const [modal, setModal] = useState({ 
    type: "", // 'assign', 'confirm-delete', 'confirm-reassign'
    isOpen: false,
    staff: null, // For assign modal
    task: null   // For confirmation modals
  });

  // UI state
  const [activeTab, setActiveTab] = useState("tasks");

  // Open modal with type and data
  const openModal = (type, data = null) => {
    setModal({
      type,
      isOpen: true,
      staff: type === "assign" ? data : null,
      task: type.includes("confirm") ? data : null
    });
  };

  // Close any modal
  const closeModal = () => {
    setModal({ type: "", isOpen: false, staff: null, task: null });
  };

  // Fetch staff data
  const fetchStaff = useCallback(async () => {
    setLoading(prev => ({...prev, staff: true}));
    try {
      const response = await apiService.getAllStaff();
      setData(prev => ({
        ...prev, 
        staff: response.data.map(staff => ({
          ...staff,
          username: staff.name // Ensure consistent property name
        }))
      }));
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(prev => ({...prev, staff: false}));
    }
  }, []);

  // Fetch assigned tasks
  const fetchAssignedTasks = useCallback(async () => {
    setLoading(prev => ({...prev, tasks: true}));
    try {
      const response = await apiService.getAllTasks();
      const tasks = response.data.map(task => ({
        id: task.id,
        staffName: task.staffname,
        description: task.task,
        status: task.status || "Pending",
        remark: task.remark || "-",
        empid: task.empid
      }));
      setData(prev => ({...prev, assignedTasks: tasks}));
    } catch (error) {
      console.error("Error fetching assigned tasks:", error);
    } finally {
      setLoading(prev => ({...prev, tasks: false}));
    }
  }, []);

  // Fetch staff reports
  const fetchStaffReports = useCallback(async () => {
    setLoading(prev => ({...prev, reports: true}));
    try {
      const response = await apiService.getStaffReports();
      setData(prev => ({...prev, staffReports: response.data}));
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(prev => ({...prev, reports: false}));
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchStaff();
    fetchAssignedTasks();
    fetchStaffReports();
  }, [fetchStaff, fetchAssignedTasks, fetchStaffReports]);

  // Handle task deletion
  const handleDeleteTask = async () => {
    if (!modal.task) return;
    
    setLoading(prev => ({...prev, deleting: true}));
    try {
      await apiService.deleteTask(modal.task.id);
      await fetchAssignedTasks();
      closeModal();
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setLoading(prev => ({...prev, deleting: false}));
    }
  };

  // Handle task reassignment
  const handleReassignTask = async () => {
    if (!modal.task) return;
    
    setLoading(prev => ({...prev, reassigning: true}));
    try {
      const reassignData = {
        id: modal.task.id, 
        staffname: modal.task.staffName, 
        task: modal.task.description, 
        status: modal.task.status, 
        remark: modal.task.remark, 
        empid: modal.task.empid
      };
      
      await apiService.reassignTask(reassignData);
      await fetchAssignedTasks();
      closeModal();
    } catch (error) {
      console.error("Error reassigning task:", error);
    } finally {
      setLoading(prev => ({...prev, reassigning: false}));
    }
  };

  // Confirmation Modal Component
  const ConfirmationModal = ({ action, onConfirm, onCancel }) => {
    const actionColors = {
      delete: "bg-red-600 hover:bg-red-700",
      reassign: "bg-green-600 hover:bg-green-700"
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Confirm {action}</h3>
            <button 
              onClick={onCancel} 
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close confirmation modal"
            >
              <FaTimes />
            </button>
          </div>
          
          <p className="mb-6">Are you sure you want to {action} this task?</p>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-md ${actionColors[action]}`}
              disabled={loading[action === 'delete' ? 'deleting' : 'reassigning']}
            >
              {loading[action === 'delete' ? 'deleting' : 'reassigning'] ? (
                <FaSpinner className="animate-spin inline-block" />
              ) : (
                action.charAt(0).toUpperCase() + action.slice(1)
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto relative">
      <div className="dark:bg-gray-900 dark:text-white bg-gray-50 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <button
            onClick={fetchAssignedTasks}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            disabled={loading.tasks}
            aria-label="Refresh tasks"
          >
            {loading.tasks ? (
              <FaSpinner className="animate-spin" />
            ) : (
              "Refresh Tasks"
            )}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'tasks' ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}
            onClick={() => setActiveTab('tasks')}
            aria-current={activeTab === 'tasks' ? 'page' : undefined}
          >
            Task Management
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'reports' ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}
            onClick={() => setActiveTab('reports')}
            aria-current={activeTab === 'reports' ? 'page' : undefined}
          >
            Staff Reports
          </button>
        </div>

        {activeTab === 'tasks' && (
          <>
            {/* Staff Members Table */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Staff Members</h2>
                <span className="text-sm text-gray-500">
                  {data.staff.length} staff members
                </span>
              </div>
              {loading.staff ? (
                <div className="flex justify-center items-center py-8">
                  <FaSpinner className="animate-spin text-2xl" />
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg shadow-sm border dark:border-gray-700">
                  <table className="w-full">
                    <thead className="dark:bg-gray-800 bg-gray-100">
                      <tr>
                        <th className="p-4 text-left">No</th>
                        <th className="p-4 text-left">Name</th>
                        <th className="p-4 text-left">Employee ID</th>
                        <th className="p-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.staff.filter(s => s.role !== 'admin').map((staff, index) => (
                        <tr 
                          key={staff.empid} 
                          className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <td className="p-4">{index + 1}</td>
                          <td className="p-4">{staff.name}</td>
                          <td className="p-4 font-mono text-sm">{staff.empid}</td>
                          <td className="p-4">
                            <button
                              onClick={() => openModal("assign", staff)}
                              className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm"
                              disabled={loading.reassigning}
                              aria-label={`Assign task to ${staff.name}`}
                            >
                              Assign Task
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Assigned Tasks Table */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Assigned Tasks</h2>
                <span className="text-sm text-gray-500">
                  {data.assignedTasks.length} tasks assigned
                </span>
              </div>
              {loading.tasks ? (
                <div className="flex justify-center items-center py-8">
                  <FaSpinner className="animate-spin text-2xl" />
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg shadow-sm border dark:border-gray-700">
                  <table className="w-full">
                    <thead className="dark:bg-gray-800 bg-gray-100">
                      <tr>
                        <th className="p-4 text-left">No</th>
                        <th className="p-4 text-left">Staff Name</th>
                        <th className="p-4 text-left">Task Description</th>
                        <th className="p-4 text-left">Status</th>
                        <th className="p-4 text-left">Remark</th>
                        <th className="p-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.assignedTasks.length > 0 ? (
                        data.assignedTasks.map((task, index) => (
                          <tr 
                            key={task.id} 
                            className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <td className="p-4">{index + 1}</td>
                            <td className="p-4">{task.staffName}</td>
                            <td className="p-4 max-w-xs truncate" title={task.description}>
                              {task.description}
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                task.status === "Completed" 
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              }`}>
                                {task.status}
                              </span>
                            </td>
                            <td className="p-4 max-w-xs truncate" title={task.remark}>
                              {task.remark}
                            </td>
                            <td className="p-4 flex gap-4 items-center">
                              <button 
                                onClick={() => openModal("confirm-reassign", task)}
                                disabled={loading.reassigning}
                                className="text-green-700 dark:text-green-400 disabled:opacity-50"
                                aria-label={`Reassign task to ${task.staffName}`}
                              >
                                {loading.reassigning ? (
                                  <FaSpinner className="animate-spin" />
                                ) : (
                                  <FaUserPlus />
                                )}
                              </button>
                              <button 
                                onClick={() => openModal("confirm-delete", task)}
                                disabled={loading.deleting}
                                className="text-red-700 dark:text-red-400 disabled:opacity-50"
                                aria-label={`Delete task for ${task.staffName}`}
                              >
                                {loading.deleting ? (
                                  <FaSpinner className="animate-spin" />
                                ) : (
                                  <FaTrash />
                                )}
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td 
                            colSpan="6" 
                            className="p-4 text-center text-gray-500 dark:text-gray-400"
                          >
                            No tasks assigned yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'reports' && (
          <StaffReports 
            loading={loading.reports} 
            reports={data.staffReports} 
          />
        )}

        {/* Assign Task Modal */}
        {modal.type === "assign" && (
          <AssignTask
            staff={modal.staff}
            closeModal={closeModal}
            fetchTasks={fetchAssignedTasks}
          />
        )}

        {/* Delete Confirmation Modal */}
        {modal.type === "confirm-delete" && (
          <ConfirmationModal
            action="delete"
            onConfirm={handleDeleteTask}
            onCancel={closeModal}
          />
        )}

        {/* Reassign Confirmation Modal */}
        {modal.type === "confirm-reassign" && (
          <ConfirmationModal
            action="reassign"
            onConfirm={handleReassignTask}
            onCancel={closeModal}
          />
        )}
      </div>
    </div>
  );
};

export default AssignTaskMain;