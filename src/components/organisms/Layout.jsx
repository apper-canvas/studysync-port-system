import React, { useContext, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

const navItems = [
    { path: "/", icon: "Home", label: "Dashboard" },
    { path: "/students", icon: "Users", label: "Students" },
    { path: "/courses", icon: "BookOpen", label: "Courses" },
    { path: "/assignments", icon: "FileText", label: "Assignments" },
    { path: "/calendar", icon: "Calendar", label: "Calendar" },
    { path: "/grades", icon: "Award", label: "Grades" }
  ];

  const NavContent = () => (
<nav className="flex flex-col space-y-2">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`
          }
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <ApperIcon name={item.icon} size={20} />
          <span className="font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );

  const LogoutButton = () => {
    const { user } = useSelector((state) => state.user);
    const { logout } = useContext(AuthContext);

    return (
      <div className="space-y-3">
        {user && (
          <div className="text-sm text-gray-600">
            <div className="font-medium">{user.firstName} {user.lastName}</div>
            <div className="text-xs text-gray-500">{user.emailAddress}</div>
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2"
        >
          <ApperIcon name="LogOut" size={16} />
<span>Logout</span>
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white shadow-lg border-r border-gray-200">
          <div className="flex items-center flex-shrink-0 px-6 py-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="GraduationCap" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">StudySync</h1>
                <p className="text-xs text-gray-500">Academic Hub</p>
              </div>
            </div>
          </div>
<div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
            <div className="flex-1 px-4">
              <NavContent />
            </div>
            <div className="px-4 pt-4 border-t border-gray-200">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between px-4 py-4 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" size={20} className="text-white" />
            </div>
            <h1 className="text-lg font-bold gradient-text">StudySync</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <ApperIcon name="Menu" size={24} />
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 flex z-40">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl transform transition-transform duration-300">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-gray-200"
                >
                  <ApperIcon name="X" size={24} />
                </Button>
              </div>
              <div className="flex-shrink-0 flex items-center px-6 py-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center">
                    <ApperIcon name="GraduationCap" size={24} className="text-white" />
                  </div>
<div className="flex-1">
                    <h1 className="text-xl font-bold gradient-text">StudySync</h1>
                    <p className="text-xs text-gray-500">Academic Hub</p>
                  </div>
                  <LogoutButton />
                </div>
              </div>
              <div className="flex-1 h-0 pt-6 pb-4 overflow-y-auto">
                <div className="px-4">
                  <NavContent />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;