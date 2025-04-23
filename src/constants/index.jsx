import { 
  CalendarCheck,
  ClipboardList,
  Bell,
  ClipboardCheck,
  UserCog,
  Plane,
  Hotel,
  FolderArchive,
  FileText,
  Users,
  ClipboardEdit,
  Mail,
  Settings,
  FileArchive
} from "lucide-react";

export const navbarLinks = {
  staff: [
    {
      title: "Staff Panel",
      links: [
        { 
          label: "Attendance Page", 
          icon: CalendarCheck, 
          path: "/staff/attendance" 
        },
        {
          label: "Data Entry Page", 
          icon: ClipboardList, 
          path: "/staff/dataentry", 
          sublinks: [
            { label: "Flights", icon: Plane, path: "/staff/dataentry/flights" },
            { label: "Hotels", icon: Hotel, path: "/staff/dataentry/hotels" },
            { label: "Others", icon: Hotel, path: "/staff/dataentry/other" },
          ],
        },
        { 
          label: "Pending Works", 
          icon: ClipboardCheck, 
          path: "/staff/pendingwork" 
        },
        // { 
        //   label: "Customer Reminders", 
        //   icon: Bell, 
        //   path: "/staff/remindercustomer" 
        // },
        {
          label: "Customer Details",
          icon: UserCog,
          path: "#",
          sublinks: [
            { label: "Flight Customers", icon: Plane, path: "/staff/flightcustomers" },
            { label: "Hotel Customers", icon: Hotel, path: "/staff/hotelcustomers" },
            { label: "Customers Database", icon: Users, path: "/staff/othercustomers" },
          ],
        },
        {
          label: "AddingDetails",
          icon: Settings,
          path: "/staff/dropdowndatas",
        },
        {
          label: "Daily Report",
          icon: FileText,
          path: "/staff/dailyreport",
        },
        {
          label: "Custom Mails",
          icon: Mail,
          path: "/staff/custommail",
        },
      ],
    },
  ],
  admin: [
    {
      title: "Admin Panel",
      links: [
        {
          label: "Staff attendance",
          icon: CalendarCheck,
          path: "/admin/staffattendance",
        },
        {
          label: "Manage Staff",
          icon: Users,
          path: "/admin/managestaff",
        },
        {
          label: "Assign Task",
          icon: ClipboardEdit,
          path: "/admin/assigntask",
        },
        // { 
        //   label: "Customer Reminders", 
        //   icon: Bell, 
        //   path: "/admin/remindercustomer" 
        // },
        {
          label: "Customer Details",
          icon: UserCog,
          path: "#",
          sublinks: [
            { label: "Flight Customers", icon: Plane, path: "/admin/flightcustomers" },
            { label: "Hotel Customers", icon: Hotel, path: "/admin/hotelcustomers" },
            { label: "Customers Database", icon: Users, path: "/admin/othercustomers" },
          ],
        },
        {
          label: "Admin Resources",
          icon: FileArchive,
          path: "/admin/resources",
        },
        {
          label: "AddingDetails",
          icon: Settings,
          path: "/admin/dropdowndatas",
        },
        {
          label: "Custom Mails",
          icon: Mail,
          path: "/admin/custommail",
        },
      ],
    },
  ],
};