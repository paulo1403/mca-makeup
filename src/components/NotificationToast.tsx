import React from 'react';

interface NotificationProps {
  notification: { message: string; type: 'success' | 'error' } | null;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationProps> = ({ notification, onClose }) => {
  if (!notification) return null;
  return (
    <div className={`fixed bottom-4 right-4 z-50 transform transition-all duration-500 ease-in-out max-w-sm ${
      notification ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
    }`}>
      <div className={`backdrop-blur-sm shadow-lg rounded-lg border border-gray-200 overflow-hidden ${
        notification.type === 'success' ? 'bg-white/90' : 'bg-white/90'
      }`}>
        <div className="p-3">
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <p className="text-sm font-medium text-gray-900 flex-1">
              {notification.message}
            </p>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xs"
            >
              ✕
            </button>
          </div>
        </div>
        <div className={`h-0.5 ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } transition-all duration-4000 ease-linear`}
        style={{
          width: '100%',
          animation: 'shrinkWidth 4s linear forwards'
        }}/>
      </div>
    </div>
  );
};
