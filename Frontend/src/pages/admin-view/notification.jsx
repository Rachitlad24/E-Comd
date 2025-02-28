import React, { useEffect, useState } from "react";
import moment from "moment";
import { io } from "socket.io-client";
import { X } from "lucide-react";

// const socket = io(import.meta.env.VITE_BACKEND_APIS_ROUTE);

const AdminNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const BASEURL = import.meta.env.VITE_BACKEND_API_ROUTE;

  useEffect(() => {
    const socket = io(BASEURL);
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${BASEURL}/api/admin/notifications`);
        const data = await response.json();
        if (data.success) {
          setNotifications(data.data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    socket.on("receiveNotification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    socket.on("notificationRead", ({ id }) => {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === id ? { ...notification, read: true } : notification
        )
      );
    });

    socket.on("notificationDelete", ({ id }) => {
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      console.log(notifications);
    });

    return () => {
      socket.off("receiveNotification");
      socket.off("notificationRead");
      socket.off("notificationDelete");
    };
  }, []);

  const markAsRead = (id) => {
    const socket = io(BASEURL);
    socket.emit("markNotificationAsRead", { id });

    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification._id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const deleteNotification = (id)=> {
    const socket = io(BASEURL);
    socket.emit("deleteNotification", { id });
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  return (
    <div className="mt-5 p-4">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      <ul className="bg-white shadow-md rounded-lg p-4">
        {notifications.length === 0 ? (
          <li className="text-gray-500 text-center py-4">No notifications</li>
        ) : (
          notifications.map((notification) => (
            <li
              key={notification._id}
              onClick={() => markAsRead(notification._id)}
              className={`flex items-center justify-between border-b py-3 px-4 rounded-md transition duration-200 ${
                !notification.read ? "bg-green-200 font-semibold" : "bg-gray-100 text-gray-600"
              } hover:bg-gray-200`}
            >
              <div className="flex flex-col">
                <span className="text-base">📢 {notification.message}</span>
                <span className="text-xs text-gray-500">{moment(notification.createdAt).fromNow()}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent marking as read
                  deleteNotification(notification._id);
                }}
                className="text-gray-600 hover:text-red-600"
              >
                <X size={20} />
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AdminNotification;