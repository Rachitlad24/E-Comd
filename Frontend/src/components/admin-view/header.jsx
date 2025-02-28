import React, { useEffect, useState } from "react";
import { AlignJustify, LogOut, Bell } from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";



const AdminHeader = ({ setOpen }) => {
  const dispatch = useDispatch();
  const [notificationCount, setNotificationCount] = useState(0);
  const BASEURL = import.meta.env.VITE_BACKEND_API_ROUTE;
  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND_API_ROUTE);
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${BASEURL}/api/admin/notifications`);
        const data = await response.json();
        if (data.success) {
          const unreadCount = data.data.filter((notification) => !notification.read).length;
          setNotificationCount(unreadCount);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    socket.on("receiveNotification", () => {
      setNotificationCount((prev) => prev + 1);
    });

    socket.on("notificationRead", () => {
      setNotificationCount((prev) => (prev > 0 ? prev - 1 : 0));
    });

    return () => {
      socket.off("receiveNotification");
      socket.off("notificationRead");
    };
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle-menu</span>
      </Button>

      <div className="flex items-center gap-10 ml-auto">
        <div className="relative">
          <Link to="/admin/notification"> 
            <Bell className="w-8 h-7 cursor-pointer" />
            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-0 bg-red-500 text-white text-xs font-bold px-1.5 pt-0 rounded-full">
                {notificationCount}
              </span>
            )}
          </Link>
        </div>

        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 font-medium shadow-md"
        >
          <LogOut /> Log out
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;