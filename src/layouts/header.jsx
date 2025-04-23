import { useTheme } from "@/hooks/use-theme";
import { Bell, ChevronsLeft, Moon,  Sun, LogOut } from "lucide-react";

import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export const Header = ({ collapsed, setCollapsed }) => {
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("userRole");
        navigate("/login");
    };

    return (
        <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft className={collapsed && "rotate-180"} />
                </button>
            </div>
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                    <Sun
                        size={20}
                        className="dark:hidden"
                    />
                    <Moon
                        size={20}
                        className="hidden dark:block"
                    />
                </button>
             
                <button
                    className="btn-ghost flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={handleLogout}
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};