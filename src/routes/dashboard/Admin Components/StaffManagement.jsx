import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import { staffApi } from "../../Api/staffApi";

const StaffManagement = () => {
  // State management
  const [staff, setStaff] = useState([]);
  const [modal, setModal] = useState({ type: "", isOpen: false, staff: null });
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    empid: "",
    number: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    username: "",
    password: "",
    empid: "",
    number: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, staffId: null });

  // Fetch staff on component mount
  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const staffData = await staffApi.getAll();
      setStaff(staffData);
    } catch (err) {
      console.error("Error fetching staff:", err);
      setError(typeof err === 'string' ? err : "Failed to load staff data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) return "Name is required";
    if (name.length < 3) return "Name must be at least 3 characters";
    return "";
  };

  const validateUsername = (username) => {
    if (!username.trim()) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    return "";
  };

  const validatePassword = (password, isEdit) => {
    if (!isEdit && !password) return "Password is required";
    if (password && password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validateEmpId = (empid) => {
    if (!empid.trim()) return "Employee ID is required";
    if (!/^\d+$/.test(empid)) return "Employee ID must be numeric";
    return "";
  };

  const validatePhoneNumber = (number) => {
    if (!number.trim()) return "Phone number is required";
    if (!/^\d{10}$/.test(number)) return "Phone number must be 10 digits";
    return "";
  };

  const validateForm = (isEdit = false) => {
    const errors = {
      name: validateName(formData.name),
      username: validateUsername(formData.username),
      password: validatePassword(formData.password, isEdit),
      empid: validateEmpId(formData.empid),
      number: validatePhoneNumber(formData.number),
    };
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  // Modal handlers
  const openModal = (type, staff = null) => {
    setFormErrors({
      name: "",
      username: "",
      password: "",
      empid: "",
      number: "",
    });
    
    if (type === "edit" && staff) {
      setFormData({
        name: staff.name || "",
        username: staff.username,
        password: "",
        empid: staff.empid,
        number: staff.number,
      });
    } else {
      setFormData({ name: "", username: "", password: "", empid: "", number: "" });
    }
    setModal({ type, isOpen: true, staff });
  };

  const closeModal = () => {
    setModal({ type: "", isOpen: false, staff: null });
    setShowPassword(false);
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isValid = validateForm(modal.type === "edit");
    if (!isValid) return;

    try {
      setLoading(true);
      setError("");
      
      const dataToSend = {
        name: formData.name,
        empid: formData.empid,
        username: formData.username,
        number: formData.number,
      };

      if (formData.password) {
        dataToSend.password = formData.password;
      }

      if (modal.type === "add") {
        const newStaff = await staffApi.register(dataToSend);
        setStaff([...staff, newStaff]);
      } else if (modal.type === "edit" && modal.staff?.id) {
        const updatedStaff = await staffApi.update(modal.staff.id, dataToSend);
        setStaff(staff.map((s) => (s.id === modal.staff.id ? updatedStaff : s)));
      }

      closeModal();
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(typeof err === 'string' ? err : "Failed to submit staff details. Please try again.");
    } finally {
      setLoading(false);
      fetchStaff();
    }
  };

  // Delete handlers
  const handleDelete = async (staffId) => {
    try {
      setLoading(true);
      await staffApi.delete(staffId);
      setStaff(staff.filter((s) => s.id !== staffId));
      closeDeleteModal();
    } catch (err) {
      console.error("Error deleting staff:", err);
      setError(typeof err === 'string' ? err : "Failed to delete staff. Please try again.");
    } finally {
      setLoading(false);
      fetchStaff();
    }
  };

  const openDeleteModal = (staffId) => {
    setDeleteModal({ isOpen: true, staffId });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, staffId: null });
  };

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      <div className="dark:bg-gray-900 dark:text-white bg-gray-50 p-6 rounded-lg shadow-lg">
        {/* Header and Add Staff Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <button
            onClick={() => openModal("add")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Add New Staff
          </button>
        </div>

        {/* Error and Loading States */}
        {loading && <div className="p-4 text-center">Loading...</div>}
        {error && (
          <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Staff Table */}
        <div className="overflow-x-auto rounded-lg shadow-sm">
          <table className="w-full">
            <thead className="dark:bg-gray-800 bg-gray-100">
              <tr>
                <th className="p-4">S.No</th>
                <th className="p-4">Name</th>
                <th className="p-4">Username</th>
                <th className="p-4">Password</th>
                <th className="p-4">Employee ID</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
            {staff.filter(s => s.role !== 'admin').map((s, index) => (

                <tr
                  key={s.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="p-4 text-center">{index + 1}</td>
                  <td className="p-4 text-center">{s.name || "-"}</td>
                  <td className="p-4 text-center">{s.username}</td>
                  <td className="p-4 text-center">••••••••</td>
                  <td className="p-4 text-center">{s.empid}</td>
                  <td className="p-4 text-center">{s.number}</td>
                  <td className="p-4 flex space-x-2 ">
                    <button
                      onClick={() => openModal("edit", s)}
                      className="text-green-600 hover:text-green-800"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => openDeleteModal(s.empid)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModal.isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="dark:bg-gray-800 bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Delete Staff</h2>
                <button
                  onClick={closeDeleteModal}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <FaTimes />
                </button>
              </div>
              <p className="mb-4">Are you sure you want to delete this staff member?</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={closeDeleteModal}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal.staffId)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Staff Modal */}
        {modal.isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="dark:bg-gray-800 bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold capitalize">{modal.type} Staff</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <FaTimes />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                {/* Name Field */}
                <div className="mb-3">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className={`w-full p-3 border rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-900 ${
                      formErrors.name ? "border-red-500" : "border-gray-400 dark:border-gray-600"
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Username Field */}
                <div className="mb-3">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Username"
                    className={`w-full p-3 border rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-900 ${
                      formErrors.username ? "border-red-500" : "border-gray-400 dark:border-gray-600"
                    }`}
                  />
                  {formErrors.username && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="mb-3">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={modal.type === "edit" ? "New Password (leave blank to keep current)" : "Password"}
                      className={`w-full p-3 border rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-900 ${
                        formErrors.password ? "border-red-500" : "border-gray-400 dark:border-gray-600"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                  )}
                </div>

                {/* Employee ID Field */}
                <div className="mb-3">
                  <input
                    type="text"
                    name="empid"
                    value={formData.empid}
                    onChange={handleInputChange}
                    placeholder="Employee ID"
                    className={`w-full p-3 border rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-900 ${
                      formErrors.empid ? "border-red-500" : "border-gray-400 dark:border-gray-600"
                    }`}
                  />
                  {formErrors.empid && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.empid}</p>
                  )}
                </div>

                {/* Phone Number Field */}
                <div className="mb-4">
                  <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    className={`w-full p-3 border rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-900 ${
                      formErrors.number ? "border-red-500" : "border-gray-400 dark:border-gray-600"
                    }`}
                  />
                  {formErrors.number && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.number}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffManagement;