import React, { useState, useEffect, useRef } from "react";
import { pendingWorkService } from "../../Api/pendingWorkService";

const PendingWorkPage = () => {
  // User data from localStorage
  const empId = localStorage.getItem('userEmpid');
  const name = localStorage.getItem('userName');
  
  // State management
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [taskToComplete, setTaskToComplete] = useState(null);
  const [showQueryPopup, setShowQueryPopup] = useState(false);
  const [queryText, setQueryText] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [expandedTasks, setExpandedTasks] = useState({});
  const prevTasksRef = useRef([]);

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const response = await pendingWorkService.getTasks(empId);
      
      const apiTasks = response.data.map((task, index) => ({
        id: task.taskId || index,
        name: task.taskName || task.task || "Unnamed Task",
        status: task.status,
        ...task
      }));

      setTasks(apiTasks);
      prevTasksRef.current = apiTasks;
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(err.message || "Failed to load tasks");
      setLoading(false);
    }
  };

  // Set up polling for tasks
  useEffect(() => {
    fetchTasks();
    const intervalId = setInterval(fetchTasks, 5000);
    return () => clearInterval(intervalId);
  }, [empId]);

  // Task completion handlers
  const handleCompleteClick = (task) => {
    setTaskToComplete(task);
    setShowPopup(true);
  };

  const confirmCompletion = async () => {
    try {
      if (!taskToComplete) return;
      
      await pendingWorkService.completeTask({
        id: taskToComplete.id,
        staffname: name,
        empid: taskToComplete.empid || empId,
        task: taskToComplete.task || taskToComplete.name,
        remark: ''
      });

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskToComplete.id 
            ? { ...task, status: "Completed" } 
            : task
        )
      );

      setShowPopup(false);
      setTaskToComplete(null);
    } catch (err) {
      console.error("Error updating task:", err);
      setError(err.message || "Failed to update task status");
    }
  };

  // Task query handlers
  const handleQueryClick = (task) => {
    setSelectedTask(task);
    setShowQueryPopup(true);
  };

  const handleQuerySubmit = async () => {
    try {
      if (!selectedTask || !queryText.trim()) return;
      
      await pendingWorkService.submitQuery({
        id: selectedTask.id,
        staffname: name,
        empid: empId,
        task: selectedTask.name,
        remark: queryText
      });

      setQueryText("");
      setShowQueryPopup(false);
      setSelectedTask(null);
    } catch (err) {
      console.error("Error submitting query:", err);
      setError("Failed to submit query");
    }
  };

  // UI helpers
  const toggleTaskExpansion = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const pendingTasks = tasks.filter(t => 
    t.status.toLowerCase() === "pending" || 
    t.status.toLowerCase() === "reassigned"
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Ongoing Tasks</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {pendingTasks.length} {pendingTasks.length === 1 ? 'task' : 'tasks'} (
            {tasks.filter(t => t.status.toLowerCase() === "pending").length} pending,
            {tasks.filter(t => t.status.toLowerCase() === "reassigned").length} reassigned)
          </p>
        </div>

        {pendingTasks.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No tasks found (pending or reassigned)
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">S.No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Task Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {pendingTasks.map((task, index) => (
                  <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      <div 
                        className={`${task.name.length > 30 && !expandedTasks[task.id] ? 'truncate max-w-xs' : ''} cursor-pointer`}
                        onClick={() => toggleTaskExpansion(task.id)}
                      >
                        {task.name}
                        {task.name.length > 30 && (
                          <span className="text-blue-500 text-xs ml-2">
                            {expandedTasks[task.id] ? 'Show less' : 'Show more'}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        task.status.toLowerCase() === "pending" 
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" 
                          : task.status.toLowerCase() === "reassigned"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      }`}>
                        {task.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleCompleteClick(task)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                      >
                        Mark Complete
                      </button>
                      <button
                        onClick={() => handleQueryClick(task)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                      >
                        Ask Query
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Completion Confirmation Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Confirm Completion
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to mark <span className="font-medium text-green-600 dark:text-green-400">"{taskToComplete?.name}"</span> as completed?
              </p>
            </div>
            <div className="px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmCompletion}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 rounded-md transition-colors"
              >
                Confirm Completion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Query Popup Modal */}
      {showQueryPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Ask Query for Task
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Task Name: <span className="font-medium">{selectedTask?.name}</span>
              </p>
              <textarea
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={5}
                placeholder="Enter your query about this task..."
              />
            </div>
            <div className="px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowQueryPopup(false);
                  setQueryText("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleQuerySubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 rounded-md transition-colors"
              >
                Submit Query
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingWorkPage;