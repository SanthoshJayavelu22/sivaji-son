import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/theme-context';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import axios from 'axios'; // Added missing import
import Layout from '@/routes/layout';
import LoginPage from '@/routes/authentication/Page';
import StaffManagement from './routes/dashboard/Admin Components/StaffManagement';
import StaffAttendancePage from './routes/dashboard/Admin Components/StaffAttendancePage';
import MonthlyAttendancePage from './routes/dashboard/Admin Components/MonthlyAttendancepage';
import CustomerDashboard from './routes/dashboard/CustomerComponents/CustomerDashboard';
import AdminResources from './routes/dashboard/Admin Components/AdminResources';
import AssignTaskMain from './routes/dashboard/Admin Components/AssignTaskMain';
import AviationManagement from './routes/dashboard/AviationManagement';
import DailyReportPage from './routes/dashboard/Staff Components/DailyReportPage'; // Fixed path
import ToastNotification from './routes/ToastNotification';
import OthersCustomerPage from './routes/dashboard/OthersCustomerPage';
import CustomMailPage from './routes/dashboard/CustomMailPage';
import Others from './routes/dashboard/Staff Components/Others';

// Fixed lazy-loaded component paths (removed stray apostrophes)
const AttendancePage = lazy(() => import("@/routes/dashboard/Staff Components/AttendancePage"));
const PendingWorkPage = lazy(() => import("@/routes/dashboard/Staff Components/PendingWorkPage"));
const RemindingCustomerPage = lazy(() => import('@/routes/dashboard/RemindingCustomerPage'));
const FlightsPage = lazy(() => import("@/routes/dashboard/Staff Components/FlightsPage"));
const HotelsPage = lazy(() => import("@/routes/dashboard/Staff Components/HotelsPage"));
const FlightCustomerPage = lazy(() => import("@/routes/dashboard/FlightCustomerPage"));
const HotelCustomerPage = lazy(() => import("@/routes/dashboard/HotelCustomerPage"));

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem('userRole');
  
  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const API_BASE_URL = import.meta.env.VITE_API_URL;

function App() {
  const [staffempid, setStaffEmpid] = useState('');
  const [notification, setNotification] = useState({
    message: null,
    type: 'success',
    duration: 5000
  });
  const [tasks, setTasks] = useState([]);
  const prevTasksRef = useRef([]);
  const empId = localStorage.getItem('userEmpid');

  const checkForNewTasks = async () => {
    try {
      const userToken = localStorage.getItem('userToken');
      const userRole = localStorage.getItem('userRole');
      
      if (!userToken || userRole !== 'staff') return;
      
      const response = await axios.get(
        `${API_BASE_URL}/staff/ViewTask/${empId}`,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data && Array.isArray(response.data)) {
        const apiTasks = response.data.map((task, index) => ({
          id: task.taskId || index,
          name: task.taskName || task.task || "Unnamed Task",
          status: task.status || "pending",
          ...task
        }));

        if (prevTasksRef.current.length > 0 && apiTasks.length > prevTasksRef.current.length) {
          const newTasks = apiTasks.filter(newTask => 
            !prevTasksRef.current.some(oldTask => oldTask.id === newTask.id)
          );
          
          if (newTasks.length > 0) {
            setNotification({
              message: `New task assigned: "${newTasks[0].name}"`,
              type: 'success',
              duration: 6000
            });
          }
        }

        setTasks(apiTasks);
        prevTasksRef.current = apiTasks;
      }
    } catch (err) {
      console.error("Error checking tasks:", err);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('userRole') === 'staff') {
      checkForNewTasks();
      const taskInterval = setInterval(checkForNewTasks, 5000);
      return () => clearInterval(taskInterval);
    }
  }, [empId]);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <LoginPage />,
    },
    {
      path: '/customer',
      element: (
        <Suspense fallback={
          <div className="flex h-screen items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent dark:border-green-400" />
          </div>
        }>
          <CustomerDashboard />
        </Suspense>
      ),
    },
    {
      path: '/staff',
      element: (
        <ProtectedRoute allowedRoles={['staff']}>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Navigate to="/staff/attendance" replace /> },
        { path: '/staff/attendance', element: <AttendancePage /> },
        {
          path: '/staff/dataentry',
          children: [
            { index: true, element: <FlightsPage /> },
            { path: '/staff/dataentry/flights', element: <FlightsPage /> },
            { path: '/staff/dataentry/hotels', element: <HotelsPage /> },
            { path: '/staff/dataentry/other', element: <Others /> }, // Fixed typo (HotelsPage)
          ],
        },
        { path: '/staff/pendingwork', element: <PendingWorkPage /> },
        { path: '/staff/remindercustomer', element: <RemindingCustomerPage /> },
        { path: '/staff/flightcustomers', element: <FlightCustomerPage /> },
        { path: '/staff/hotelcustomers', element: <HotelCustomerPage /> },
        { path: '/staff/othercustomers', element: <OthersCustomerPage /> },
        { path: '/staff/dropdowndatas', element: <AviationManagement /> },
        { path: '/staff/dailyreport', element: <DailyReportPage /> },
        { path: '/staff/custommail', element: <CustomMailPage /> },
      ],
    },
    {
      path: '/admin',
      element: (
        <ProtectedRoute allowedRoles={['admin']}>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Navigate to="/admin/staffattendance" replace /> },
        { path: '/admin/managestaff', element: <StaffManagement /> },
        { path: '/admin/staffattendance', element: <StaffAttendancePage staffempid={staffempid} setStaffEmpid={setStaffEmpid} /> },
        { path: '/admin/assigntask', element: <AssignTaskMain /> },
        { path: '/admin/monthlyattendance/:staffId', element: <MonthlyAttendancePage staffempid={staffempid} setStaffEmpid={setStaffEmpid} /> },
        { path: '/admin/remindercustomer', element: <RemindingCustomerPage /> },
        { path: '/admin/flightcustomers', element: <FlightCustomerPage /> },
        { path: '/admin/hotelcustomers', element: <HotelCustomerPage /> },
        { path: '/admin/othercustomers', element: <OthersCustomerPage /> },
        { path: '/admin/resources', element: <AdminResources /> },
        { path: '/admin/dropdowndatas', element: <AviationManagement /> },
        { path: '/admin/custommail', element: <CustomMailPage /> },
      ],
    },
    {
      path: '/',
      element: <Navigate to="/" replace />,
    },
  ]);

  return (
    <ThemeProvider storageKey="theme">
      {/* Notification for staff only */}
      {localStorage.getItem('userRole') === 'staff' && notification.message && (
        <ToastNotification 
          message={notification.message}
          onClose={() => setNotification(prev => ({...prev, message: null}))}
          type={notification.type}
          duration={notification.duration}
          position="top-right"
        />
      )}
      
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent dark:border-green-400" />
        </div>
      }>
        <RouterProvider router={router} />
      </Suspense>
    </ThemeProvider>
  );
}

export default App;