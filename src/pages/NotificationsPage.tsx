import React, { useEffect, useCallback, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectNotifications,
  selectLastVisibleNotification,
  selectHasMoreNotifications,
  addNotifications,
  setLastVisibleNotification,
  setHasMoreNotifications,
  clearNotifications,
  setNotificationsLoading,
} from "../store/notificationsSlice";
import { selectUserGlobalData } from "../store/orbitSlice";
import orbitProvider from "../backend/OrbitProvider";
import { AppDispatch, RootState } from "../store/store";
import { Link } from "react-router-dom";
import { Bell, Zap, CheckCircle } from "lucide-react";

const NotificationsPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const userGlobalData = useSelector(selectUserGlobalData);
  const notifications = useSelector(selectNotifications);
  const lastVisible = useSelector(selectLastVisibleNotification);
  const hasMore = useSelector(selectHasMoreNotifications);
  const loading = useSelector((state: RootState) => state.notifications.loading);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (loading || !hasMore || !userGlobalData?.user?.uid) return;

    dispatch(setNotificationsLoading(true));
    try {
      const {
        notifications: newNotifications,
        lastVisible: newLastVisible,
      } = await orbitProvider.getNotifications(
        userGlobalData.user.uid,
        lastVisible
      );
      dispatch(addNotifications(newNotifications as any));
      dispatch(setLastVisibleNotification(newLastVisible));
      if (newNotifications.length < 15) {
        dispatch(setHasMoreNotifications(false));
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      dispatch(setNotificationsLoading(false));
    }
  }, [loading, hasMore, userGlobalData?.user?.uid, lastVisible, dispatch]);

  useEffect(() => {
    dispatch(clearNotifications());
    fetchNotifications();
  }, [dispatch, userGlobalData?.user?.uid]);

  const lastNotificationElementRef = useCallback(
    (node: HTMLLIElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchNotifications();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchNotifications]
  );

  const getIcon = (type: string) => {
    switch (type) {
      case "post_published":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "automation_run":
        return <Zap className="w-6 h-6 text-yellow-500" />;
      default:
        return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center mb-6">
          <Bell className="w-8 h-8 text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          {notifications.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {notifications.map((notification, index) => {
                const isLastElement = index === notifications.length - 1;
                return (
                  <li
                    ref={isLastElement ? lastNotificationElementRef : null}
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      notification.read ? "opacity-60" : ""
                    }`}
                  >
                    <Link to={notification.link} className="flex items-start space-x-4">
                       <div className="flex-shrink-0 mt-1">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                           <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                           <p className="text-xs text-gray-500">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            !loading && (
              <div className="text-center py-16">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">No Notifications Yet</h2>
                <p className="text-gray-500 mt-2">We'll let you know when something important happens.</p>
              </div>
            )
          )}
           {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading notifications...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;