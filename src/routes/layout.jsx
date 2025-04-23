import { Outlet } from "react-router-dom";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useClickOutside } from "@/hooks/use-click-outside";
import { Sidebar } from "@/layouts/sidebar";
import { Header } from "@/layouts/header";
import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";

const Layout = () => {
    const isDesktopDevice = useMediaQuery("(min-width: 768px)");
    const [collapsed, setCollapsed] = useState(!isDesktopDevice);
    const sidebarRef = useRef(null);

    // Close sidebar on mobile when navigating
    const closeSidebar = () => {
        if (!isDesktopDevice) {
            setCollapsed(true);
        }
    };

    useEffect(() => {
        setCollapsed(!isDesktopDevice);
    }, [isDesktopDevice]);

    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            if (!isDesktopDevice && !collapsed) {
                setCollapsed(true);
            }
        }
    };

    useClickOutside([sidebarRef], handleClickOutside);

    // Retrieve user role from localStorage
    const userRole = localStorage.getItem("userRole") || "staff";

    return (
        <div className="min-h-screen bg-slate-100 transition-colors dark:bg-slate-950">
            {/* Overlay for mobile sidebar */}
            <div
                className={cn(
                    "pointer-events-none fixed inset-0 -z-10 bg-black opacity-0 transition-opacity",
                    !collapsed && "max-md:pointer-events-auto max-md:z-50 max-md:opacity-30",
                )}
            />

            {/* Conditionally render Sidebar based on user role */}
            {userRole && (
                <Sidebar
                    ref={sidebarRef}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    closeSidebar={closeSidebar}
                />
            )}

            {/* Main content area */}
            <div className={cn("transition-[margin] duration-300", collapsed ? "md:ml-[70px]" : "md:ml-[240px]")}>
                {/* Conditionally render Header based on user role */}
                {userRole && (
                    <Header
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}
                    />
                )}

                {/* Outlet for nested routes */}
                <div className="h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;