// import { useState, useEffect } from "react";
// import axios from "axios";
// import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";

// const TaskList = () => {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showRemarkModal, setShowRemarkModal] = useState(false);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [remark, setRemark] = useState("");
//   const API_BASE_URL = import.meta.env.VITE_API_URL;

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/admin/GetAllTasks`);
//       console.log(response.data)
//       const formattedTasks = response.data.map(task => ({
//         id: task.id,
//         empid: task.empid,
//         staffName: task.staffname,
//         description: task.task,
//         date: new Date(task.createdAt).toLocaleDateString(),
//         status: task.status || "Pending",
//         remarks: task.remarks || ""
//       }));
//       setTasks(formattedTasks);
//     } catch (err) {
//       setError("Failed to fetch tasks");
//       console.error("Error fetching tasks:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusChange = async (taskId, newStatus) => {
//     try {
//       await axios.put(`${API_BASE_URL}/admin/UpdateTaskStatus`, {
//         taskId,
//         status: newStatus
//       });
//       fetchTasks();
//     } catch (err) {
//       console.error("Error updating status:", err);
//     }
//   };

//   const handleAddRemark = async () => {
//     if (!selectedTask || !remark.trim()) return;

//     try {
//       await axios.put(`${API_BASE_URL}/admin/AddTaskRemark`, {
//         taskId: selectedTask.id,
//         remarks: remark
//       });
//       fetchTasks();
//       setShowRemarkModal(false);
//       setRemark("");
//     } catch (err) {
//       console.error("Error adding remark:", err);
//     }
//   };

//   if (loading) return <div className="text-center py-8">Loading tasks...</div>;
//   if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <h2 className="text-2xl font-bold mb-6">Assigned Tasks</h2>
      
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
//           <thead className="bg-gray-100 dark:bg-gray-700">
//             <tr>
//               <th className="py-3 px-4 text-left">Staff</th>
//               <th className="py-3 px-4 text-left">Task</th>
//               <th className="py-3 px-4 text-left">Date</th>
//               <th className="py-3 px-4 text-left">Status</th>
//               <th className="py-3 px-4 text-left">Remarks</th>
//               <th className="py-3 px-4 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//             {tasks.map(task => (
//               <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
//                 <td className="py-3 px-4">{task.staffName}</td>
//                 <td className="py-3 px-4">{task.description}</td>
//                 <td className="py-3 px-4">{task.date}</td>
//                 <td className="py-3 px-4">
//                   <div className="flex items-center gap-2">
//                     <span className={`px-2 py-1 rounded-full text-xs ${
//                       task.status === "Completed" 
//                         ? "bg-green-100 text-green-800" 
//                         : task.status === "In Progress" 
//                           ? "bg-blue-100 text-blue-800" 
//                           : "bg-yellow-100 text-yellow-800"
//                     }`}>
//                       {task.status}
//                     </span>
//                     <div className="flex gap-1">
//                       <button 
//                         onClick={() => handleStatusChange(task.id, "Completed")}
//                         className="text-green-500 hover:text-green-700"
//                         title="Mark as Completed"
//                       >
//                         <FaCheck size={14} />
//                       </button>
//                       <button 
//                         onClick={() => handleStatusChange(task.id, "In Progress")}
//                         className="text-blue-500 hover:text-blue-700"
//                         title="Mark as In Progress"
//                       >
//                         <FaEdit size={14} />
//                       </button>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="py-3 px-4 max-w-xs truncate">{task.remarks}</td>
//                 <td className="py-3 px-4">
//                   <button
//                     onClick={() => {
//                       setSelectedTask(task);
//                       setRemark(task.remarks);
//                       setShowRemarkModal(true);
//                     }}
//                     className="text-purple-600 hover:text-purple-800 text-sm font-medium"
//                   >
//                     {task.remarks ? "Edit Remark" : "Add Remark"}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Remark Modal */}
//       {showRemarkModal && (
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
//             <h3 className="text-lg font-semibold mb-4">
//               {selectedTask?.remarks ? "Edit Remark" : "Add Remark"} for {selectedTask?.staffName}'s Task
//             </h3>
//             <textarea
//               className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//               value={remark}
//               onChange={(e) => setRemark(e.target.value)}
//               placeholder="Enter your remarks..."
//               rows={4}
//             />
//             <div className="mt-4 flex justify-end gap-3">
//               <button
//                 onClick={() => {
//                   setShowRemarkModal(false);
//                   setRemark("");
//                 }}
//                 className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
//               >
//                 <FaTimes /> Cancel
//               </button>
//               <button
//                 onClick={handleAddRemark}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//               >
//                 Save Remark
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TaskList;