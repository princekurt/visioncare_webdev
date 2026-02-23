'use client';

import { FaUserInjured, FaClipboardCheck, FaClock, FaCheckCircle, FaChartLine } from 'react-icons/fa';
import RecentActivity from '../../../components/dashboard/RecentActivity';
import DoctorLayoutWrapper from '../../../components/layout/DoctorLayoutWrapper';

export default function Dashboard() {
  const stats = [
    { title: "Total Patients", value: "125", icon: <FaUserInjured />, color: "text-[#6D6E70]", bg: "bg-slate-50" },
    { title: "Checkups Today", value: "8", icon: <FaClipboardCheck />, color: "text-[#F17343]", bg: "bg-orange-50" },
    { title: "Pending Records", value: "5", icon: <FaClock />, color: "text-amber-500", bg: "bg-amber-50" },
    { title: "Completed This Month", value: "72", icon: <FaCheckCircle />, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <DoctorLayoutWrapper pageTitle="Dashboard">
      <div className="flex flex-col gap-8">
        
        {/* Welcome Section */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-[#6D6E70] tracking-tight uppercase">
              Welcome back, <span className="text-[#F17343]">Dr. Jane</span>
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Here is what is happening with your clinic today.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-white px-4 py-2 rounded-lg border border-slate-100 shadow-sm">
            <FaChartLine className="text-[#F17343]" />
            Live Updates
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-colors group-hover:bg-[#6D6E70] group-hover:text-white`}>
                  {stat.icon}
                </div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Live</span>
              </div>
              <div>
                <p className="text-3xl font-black text-[#6D6E70] tracking-tight">{stat.value}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-[#6D6E70] uppercase text-sm tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 bg-[#F17343] rounded-full animate-pulse" />
                Recent Activity
              </h3>
              <button className="text-[10px] font-bold text-[#F17343] uppercase hover:underline">View All</button>
            </div>
            <div className="p-2">
              <RecentActivity />
            </div>
          </div>
        </div>

      </div>
    </DoctorLayoutWrapper>
  );
}