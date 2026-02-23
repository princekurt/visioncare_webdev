'use client';

import { FaUserPlus, FaFileMedical, FaCalendarCheck, FaClock } from 'react-icons/fa';

export default function RecentActivity() {
  // Mock data - replace with your actual data fetching logic if needed
  const activities = [
    {
      id: 1,
      type: 'registration',
      patient: 'Juan Dela Cruz',
      action: 'Registered as new patient',
      time: '2 mins ago',
      icon: <FaUserPlus />,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 2,
      type: 'checkup',
      patient: 'Maria Santos',
      action: 'Completed eye examination',
      time: '45 mins ago',
      icon: <FaFileMedical />,
      color: 'bg-[#F17343]/10 text-[#F17343]',
    },
    {
      id: 3,
      type: 'appointment',
      patient: 'Robert Wilson',
      action: 'Scheduled follow-up visit',
      time: '2 hours ago',
      icon: <FaCalendarCheck />,
      color: 'bg-green-100 text-green-600',
    },
    {
      id: 4,
      type: 'update',
      patient: 'Elena Smith',
      action: 'Updated medical prescription',
      time: '5 hours ago',
      icon: <FaClock />,
      color: 'bg-amber-100 text-amber-600',
    },
  ];

  return (
    <div className="flex flex-col">
      {activities.map((activity, index) => (
        <div 
          key={activity.id} 
          className={`flex items-center justify-between p-4 transition-colors hover:bg-slate-50 ${
            index !== activities.length - 1 ? 'border-b border-slate-100' : ''
          }`}
        >
          <div className="flex items-center gap-4">
            {/* Activity Icon Badge */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${activity.color}`}>
              {activity.icon}
            </div>

            {/* Activity Text */}
            <div>
              <p className="text-sm font-bold text-[#6D6E70]">
                {activity.patient}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                {activity.action}
              </p>
            </div>
          </div>

          {/* Time Stamp */}
          <div className="text-right">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              {activity.time}
            </span>
          </div>
        </div>
      ))}

      {/* Empty State Footer */}
      {activities.length === 0 && (
        <div className="p-8 text-center text-slate-400 text-sm italic">
          No recent activity found.
        </div>
      )}
    </div>
  );
}