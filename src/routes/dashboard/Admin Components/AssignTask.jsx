import { useState } from "react";
import apiService from "../../Api/apiService"; // Update the path as needed
import { FaTimes } from "react-icons/fa";
import PropTypes from "prop-types";

const AssignTask = ({ staff, fetchTasks, closeModal }) => {
  const [taskDescription, setTaskDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAssignTask = async (e) => {
    e.preventDefault();
    
    if (!staff) {
      setErrorMessage("No staff member selected");
      return;
    }
    
    if (!taskDescription.trim()) {
      setErrorMessage("Task description cannot be empty");
      return;
    }

    const taskData = {
      empid: staff.empid,
      staffname: staff.username,
      task: taskDescription.trim(),
    };

    setLoading(true);
    setErrorMessage("");

    try {
      await apiService.addTask(taskData);
      await fetchTasks();
      closeModal();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error assigning task. Please try again.");
      console.error("Error assigning task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    if (errorMessage) setErrorMessage("");
    setTaskDescription(e.target.value);
  };

  if (!staff) {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md">
          <p className="text-red-600">No staff member selected</p>
          <button
            onClick={closeModal}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assign-task-title"
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md">
        <h2 id="assign-task-title" className="text-xl font-semibold mb-4">
          Assign Task to {staff.username}
        </h2>
        
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          value={taskDescription}
          onChange={handleInputChange}
          placeholder="Task description"
          aria-label="Task description"
          disabled={loading}
        />
        
        {errorMessage && (
          <p className="text-red-600 mt-2" role="alert">
            {errorMessage}
          </p>
        )}
        
        <div className="mt-4 flex justify-end gap-4">
          <button
            onClick={closeModal}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center gap-2"
            disabled={loading}
            aria-label="Cancel"
          >
            <FaTimes /> Cancel
          </button>
          <button
            onClick={handleAssignTask}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            disabled={loading}
            aria-label="Assign task"
          >
            {loading ? "Assigning..." : "Assign Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

AssignTask.propTypes = {
  staff: PropTypes.shape({
    empid: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired
  }),
  fetchTasks: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired
};

export default AssignTask;