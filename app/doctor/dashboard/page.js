'use client';

import { useState, useEffect } from 'react';
import { FaUserInjured, FaClipboardCheck, FaCheckCircle, FaChartLine, FaRobot } from 'react-icons/fa';
import RecentActivity from '../../../components/dashboard/RecentActivity';
import DoctorLayoutWrapper from '../../../components/layout/DoctorLayoutWrapper';

export default function Dashboard() {
  const [counts, setCounts] = useState({
    totalPatients: 0,
    checkupsToday: 0,
    completedOverall: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const pRes = await fetch('/api/patients');
        const pData = await pRes.json();
        
        const cRes = await fetch('/api/checkups');
        const cData = await cRes.json();

        const today = new Date().toISOString().split('T')[0];
        // Checks date_prescribed for today's count
        const todayCount = cData.filter(visit => visit.date_prescribed === today).length;

        setCounts({
          totalPatients: pData.length || 0,
          checkupsToday: todayCount,
          completedOverall: cData.length || 0,
        });
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  // Stats array reduced to 3 items
  const stats = [
    { title: "Total Patients", value: counts.totalPatients, icon: <FaUserInjured />, color: "text-[#6D6E70]", bg: "bg-slate-50" },
    { title: "Checkups Today", value: counts.checkupsToday, icon: <FaClipboardCheck />, color: "text-[#F17343]", bg: "bg-orange-50" },
    { title: "Completed Overall", value: counts.completedOverall, icon: <FaCheckCircle />, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <DoctorLayoutWrapper pageTitle="Dashboard">
      <div className="flex flex-col gap-8">
        
        {/* Welcome Section */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-[#6D6E70] tracking-tight uppercase leading-none">
              Welcome back, <span className="text-[#F17343]">Dr. Jane</span>
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-2">Your clinic's diagnostic performance at a glance.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live Sync Active
          </div>
        </div>

        {/* Updated Stats Grid: Changed to md:grid-cols-3 for balance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-all duration-500 group-hover:bg-[#6D6E70] group-hover:text-white group-hover:rotate-12`}>
                  {stat.icon}
                </div>
                {loading ? (
                   <div className="w-8 h-4 bg-slate-100 animate-pulse rounded-full" />
                ) : (
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest group-hover:text-[#F17343]">Realtime</span>
                )}
              </div>
              <div>
                <p className="text-4xl font-black text-[#6D6E70] tracking-tighter">
                  {loading ? "..." : stat.value}
                </p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-7 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
              <h3 className="font-black text-[#6D6E70] uppercase text-xs tracking-widest flex items-center gap-2">
                <FaChartLine className="text-[#F17343]" />
                Recent Clinical Activity
              </h3>
              <button className="text-[10px] font-black text-[#F17343] uppercase hover:underline tracking-tighter">Database Logs</button>
            </div>
            <div className="p-4">
              <RecentActivity />
            </div>
          </div>

          <div className="bg-[#6D6E70] rounded-[2.5rem] p-8 text-white shadow-2xl flex flex-col justify-between relative overflow-hidden group">
            <FaRobot className="absolute -right-4 -bottom-4 text-white/5 text-9xl group-hover:scale-110 transition-transform duration-700" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-2">System Status</p>
              <h3 className="text-xl font-black uppercase leading-tight">AI Pilot <br/><span className="text-[#F17343]">Engine</span></h3>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/5">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <p className="text-[10px] font-bold uppercase tracking-wider">Vision Analysis Online</p>
                </div>
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/5">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <p className="text-[10px] font-bold uppercase tracking-wider">Gemini 1.5 Pro Linked</p>
                </div>
              </div>
            </div>
            <p className="text-[9px] font-medium text-white/40 leading-relaxed mt-8">
              AI Pilot is currently assisting in diagnostic trends for {counts.totalPatients} patients.
            </p>
          </div>
        </div>

      </div>
    </DoctorLayoutWrapper>
  );
}