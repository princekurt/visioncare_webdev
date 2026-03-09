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

  const stats = [
    { title: "Total Patients", value: counts.totalPatients, icon: <FaUserInjured />, color: "text-[#6D6E70]", bg: "bg-slate-50" },
    { title: "Checkups Today", value: counts.checkupsToday, icon: <FaClipboardCheck />, color: "text-[#F17343]", bg: "bg-orange-50" },
    { title: "Completed Overall", value: counts.completedOverall, icon: <FaCheckCircle />, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <DoctorLayoutWrapper pageTitle="Dashboard">
      <div className="flex flex-col gap-6 md:gap-8 px-1 md:px-0">
        
        {/* Responsive Welcome Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-[#6D6E70] tracking-tight uppercase leading-tight">
              Welcome back, <br className="md:hidden" />
              <span className="text-[#F17343]">Dr. Jane</span>
            </h2>
            <p className="text-[10px] md:text-sm text-slate-500 font-bold md:font-medium mt-1 uppercase md:normal-case tracking-wider md:tracking-normal italic md:not-italic">
              Clinic performance at a glance.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-4 py-3 md:py-2.5 rounded-xl border border-slate-100 shadow-sm self-start md:self-auto">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live Sync Active
          </div>
        </div>

        {/* Stats Grid - Optimized for Mobile View */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white p-6 md:p-7 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group active:scale-95"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3.5 md:p-4 rounded-2xl ${stat.bg} ${stat.color} transition-all duration-500 group-hover:bg-[#6D6E70] group-hover:text-white group-hover:rotate-12`}>
                  {stat.icon}
                </div>
                {loading ? (
                   <div className="w-8 h-4 bg-slate-100 animate-pulse rounded-full" />
                ) : (
                  <span className="text-[8px] md:text-[9px] font-black text-slate-300 uppercase tracking-widest group-hover:text-[#F17343]">Realtime</span>
                )}
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-black text-[#6D6E70] tracking-tighter">
                  {loading ? "..." : stat.value}
                </p>
                <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section: Activity and AI Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Recent Activity Card */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 md:p-7 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
              <h3 className="font-black text-[#6D6E70] uppercase text-[10px] md:text-xs tracking-widest flex items-center gap-2">
                <FaChartLine className="text-[#F17343]" />
                Recent Activity
              </h3>
              <button className="text-[9px] md:text-[10px] font-black text-[#F17343] uppercase hover:underline tracking-tighter">View Logs</button>
            </div>
            <div className="p-2 md:p-4 overflow-x-auto">
              <RecentActivity />
            </div>
          </div>

          {/* AI Status Card - Stacks on bottom */}
          <div className="bg-[#6D6E70] rounded-[2rem] md:rounded-[2.5rem] p-7 md:p-8 text-white shadow-2xl flex flex-col justify-between relative overflow-hidden group min-h-[300px] md:min-h-auto">
            <FaRobot className="absolute -right-6 -bottom-6 text-white/5 text-8xl md:text-9xl group-hover:scale-110 transition-transform duration-700" />
            <div>
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-3 md:mb-2">System Status</p>
              <h3 className="text-xl md:text-2xl font-black uppercase leading-tight tracking-tight">AI Pilot <br/><span className="text-[#F17343]">Engine</span></h3>
              
              <div className="mt-6 space-y-3 relative z-10">
                <div className="flex items-center gap-3 bg-white/10 p-3.5 rounded-2xl border border-white/5 hover:bg-white/20 transition-colors cursor-default">
                  <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                  <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider">Analysis Online</p>
                </div>
                <div className="flex items-center gap-3 bg-white/10 p-3.5 rounded-2xl border border-white/5 hover:bg-white/20 transition-colors cursor-default">
                  <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                  <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider">Gemini Linked</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 relative z-10">
              <p className="text-[9px] font-bold text-white/40 leading-relaxed uppercase tracking-widest border-t border-white/5 pt-6">
                Assisting {counts.totalPatients} patients.
              </p>
            </div>
          </div>
        </div>

      </div>
    </DoctorLayoutWrapper>
  );
}