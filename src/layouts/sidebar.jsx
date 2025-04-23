// import { useState } from "react";
// import { NavLink } from "react-router-dom";
// import { navbarLinks } from "@/constants";
// import logo from '../assets/image.png';
// import { ChevronDown } from "lucide-react";
// import { cn } from "@/utils/cn";
// import PropTypes from "prop-types";

// export const Sidebar = ({ collapsed }) => {
//     const [openDropdown, setOpenDropdown] = useState(null);

//     // Retrieve the user role from localStorage
//     const userRole = localStorage.getItem("userRole") || "staff"; // Default to "staff" if no role is set

//     // Filter navbarLinks based on the user role
//     const filteredNavbarLinks = navbarLinks[userRole] || [];

//     const toggleDropdown = (event, label) => {
//         event.preventDefault(); // Prevent navigation when clicking dropdown
//         if (!collapsed) { // Ensure dropdown only works when sidebar is expanded
//             setOpenDropdown(openDropdown === label ? null : label);
//         }
//     };

//     return (
//         <aside className={cn(
//             "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900",
//             collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
//             collapsed ? "max-md:-left-full" : "max-md:left-0",
//         )}>
//             {/* Logo Section */}
//             <div className="flex gap-x-3 p-3">
//                 <img src={logo} alt="" />
//             </div>

//             {/* Sidebar Links */}
//             <div className="flex w-full flex-col gap-y-4 overflow-y-auto p-3">
//                 {filteredNavbarLinks.map((navbarLink) => (
//                     <nav key={navbarLink.title} className={cn("sidebar-group", collapsed && "md:items-center")}>
//                         <p className={cn("sidebar-group-title", collapsed && "md:w-[45px]")}>{navbarLink.title}</p>

//                         {navbarLink.links.map((link) => (
//                             <div key={link.label} className="w-full">
//                                 {/* Parent Link */}
//                                 <div className="flex items-center">
//                                     <NavLink
//                                         to={link.sublinks ? "#" : link.path} // Prevents navigation for dropdown
//                                         className={({ isActive }) =>
//                                             cn(
//                                                 "sidebar-item flex justify-between",
//                                                 collapsed && "md:w-[45px]",
//                                                 !link.sublinks && isActive && "bg-green-600 text-white", // Apply active class only if it's not a dropdown
//                                                 link.sublinks && openDropdown === link.label && "bg-gray-200 dark:bg-gray-800" // Highlight open dropdown
//                                             )
//                                         }
//                                         onClick={(event) => link.sublinks && toggleDropdown(event, link.label)}
//                                         aria-expanded={openDropdown === link.label} // Accessibility fix
//                                     >
//                                         <div className="flex items-center gap-2">
//                                             <link.icon size={22} className="flex-shrink-0" />
//                                             {!collapsed && <p className="whitespace-nowrap">{link.label}</p>}
//                                         </div>
//                                         {link.sublinks && !collapsed && (
//                                             <ChevronDown size={18} className={cn("transition-transform", openDropdown === link.label && "rotate-180")} />
//                                         )}
//                                     </NavLink>
//                                 </div>

//                                 {/* Dropdown Sublinks */}
//                                 {!collapsed && link.sublinks && openDropdown === link.label && (
//                                     <div className="ml-6 flex flex-col space-y-2">
//                                         {link.sublinks.map((sublink) => (
//                                             <NavLink
//                                                 key={sublink.label}
//                                                 to={sublink.path}
//                                                 className={({ isActive }) =>
//                                                     cn(
//                                                         "sidebar-subitem p-2 rounded-lg transition text-gray-800 dark:text-gray-200 flex items-center gap-2",
//                                                         isActive && "bg-green-600 text-white dark:bg-green-700",
//                                                         !isActive && "hover:bg-gray-200 dark:hover:bg-gray-700"
//                                                     )
//                                                 }
//                                             >
//                                                 {sublink.icon && <sublink.icon size={18} />}
//                                                 {sublink.label}
//                                             </NavLink>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </nav>
//                 ))}
//             </div>
//         </aside>
//     );
// };

// Sidebar.propTypes = {
//     collapsed: PropTypes.bool,
// };






import { useState } from "react";
import { NavLink } from "react-router-dom";
import { navbarLinks } from "@/constants";
import logo from '../assets/image.png';
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import PropTypes from "prop-types";

export const Sidebar = ({ collapsed, setCollapsed, closeSidebar }) => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const userRole = localStorage.getItem("userRole") || "staff";
    const filteredNavbarLinks = navbarLinks[userRole] || [];

    const toggleDropdown = (event, label) => {
        event.preventDefault();
        if (!collapsed) {
            setOpenDropdown(openDropdown === label ? null : label);
        }
    };

    const handleNavigation = () => {
        if (!collapsed) {
            closeSidebar?.();
        }
    };

    return (
        <aside className={cn(
            "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900",
            collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
            collapsed ? "max-md:-left-full" : "max-md:left-0",
        )}>
            {/* Logo Section */}
            <div className="flex gap-x-3 p-3">
                <img src={logo} alt="" />
            </div>

            {/* Sidebar Links */}
            <div className="flex w-full flex-col gap-y-4 overflow-y-auto p-3">
                {filteredNavbarLinks.map((navbarLink) => (
                    <nav key={navbarLink.title} className={cn("sidebar-group", collapsed && "md:items-center")}>
                        <p className={cn("sidebar-group-title", collapsed && "md:w-[45px]")}>{navbarLink.title}</p>

                        {navbarLink.links.map((link) => (
                            <div key={link.label} className="w-full">
                                {/* Parent Link */}
                                <div className="flex items-center">
                                    <NavLink
                                        to={link.sublinks ? "#" : link.path}
                                        className={({ isActive }) =>
                                            cn(
                                                "sidebar-item flex justify-between",
                                                collapsed && "md:w-[45px]",
                                                !link.sublinks && isActive && "bg-green-600 text-white",
                                                link.sublinks && openDropdown === link.label && "bg-gray-200 dark:bg-gray-800"
                                            )
                                        }
                                        onClick={(event) => {
                                            if (link.sublinks) {
                                                toggleDropdown(event, link.label);
                                            } else {
                                                handleNavigation();
                                            }
                                        }}
                                        aria-expanded={openDropdown === link.label}
                                    >
                                        <div className="flex items-center gap-2">
                                            <link.icon size={22} className="flex-shrink-0" />
                                            {!collapsed && <p className="whitespace-nowrap">{link.label}</p>}
                                        </div>
                                        {link.sublinks && !collapsed && (
                                            <ChevronDown size={18} className={cn("transition-transform", openDropdown === link.label && "rotate-180")} />
                                        )}
                                    </NavLink>
                                </div>

                                {/* Dropdown Sublinks */}
                                {!collapsed && link.sublinks && openDropdown === link.label && (
                                    <div className="ml-6 flex flex-col space-y-2">
                                        {link.sublinks.map((sublink) => (
                                            <NavLink
                                                key={sublink.label}
                                                to={sublink.path}
                                                className={({ isActive }) =>
                                                    cn(
                                                        "sidebar-subitem p-2 rounded-lg transition text-gray-800 dark:text-gray-200 flex items-center gap-2",
                                                        isActive && "bg-green-600 text-white dark:bg-green-700",
                                                        !isActive && "hover:bg-gray-200 dark:hover:bg-gray-700"
                                                    )
                                                }
                                                onClick={closeSidebar}
                                            >
                                                {sublink.icon && <sublink.icon size={18} />}
                                                {sublink.label}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                ))}
            </div>
        </aside>
    );
};

Sidebar.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
    closeSidebar: PropTypes.func,
};