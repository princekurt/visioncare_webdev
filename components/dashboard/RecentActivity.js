'use client';

import { useState, useEffect } from 'react';
import { FaUserCircle, FaRobot, FaChevronRight, FaFileMedical } from 'react-icons/fa';

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentPatients() {
      try {
        const res = await fetch('/api/checkups');
        if (!res.ok) throw new Error('Failed to fetch');
        
        const data = await res.json();
        
        // Sort by newest first (created_at) and take the top 5
        const latest = data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);
          
        setActivities(latest);
      } catch (error) {
        console.error("Error fetching recent checkups:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecentPatients();
  }, []);

  // Helper function to format the time since checkup
  const formatTime = (dateString) => {
    if (!dateString) return '---';
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now - past;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMins / 60);

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return past.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 animate-pulse">
            <div className="w-11 h-11 bg-slate-100 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-slate-100 rounded w-1/4" />
              <div className="h-2 bg-slate-50 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {activities.length > 0 ? (
        activities.map((visit, index) => (
          <div 
            key={visit.id || index} 
            className={`flex items-center justify-between p-4 transition-all hover:bg-slate-50 group ${
              index !== activities.length - 1 ? 'border-b border-slate-100' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Avatar Icon with AI Indicator */}
              <div className="relative">
                <div className="w-11 h-11 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-[#F17343]/10 group-hover:text-[#F17343] transition-colors">
                  <FaUserCircle size={22} />
                </div>
                {visit.ai_analysis && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 border-2 border-white rounded-lg flex items-center justify-center text-[10px] text-white shadow-sm animate-in zoom-in duration-300">
                    <FaRobot />
                  </div>
                )}
              </div>

              {/* Patient Info */}
              <div>
                <p className="text-sm font-black text-[#6D6E70] uppercase tracking-tight">
                  {/* Robust name check to prevent "Guest Patient" */}
                  {visit.patient_name || visit.fullName || visit.full_name || "Guest Patient"}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[120px] md:max-w-[200px]">
                    {visit.diagnosis || "General Consultation"}
                  </p>
                  {visit.ai_analysis && (
                    <span className="text-[8px] font-black text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                      AI Optimized
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Time and Action */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  {formatTime(visit.created_at || visit.date_prescribed)}
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Checkup</p>
              </div>
              <FaChevronRight className="text-slate-200 group-hover:text-[#F17343] transition-transform group-hover:translate-x-1" size={12} />
            </div>
          </div>
        ))
      ) : (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
             <FaFileMedical size={30} />
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">No Recent Checkups</p>
        </div>
      )}
    </div>
  );
}