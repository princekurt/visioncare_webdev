'use client';

import Card from '../../../components/ui/Card';
import DoctorLayoutWrapper from '../../../components/layout/DoctorLayoutWrapper';
import Button from '../../../components/ui/Button';
import { FaFilePdf, FaFileCsv, FaChartLine, FaRobot, FaArrowUp } from 'react-icons/fa';

export default function Reports() {
  return (
    <DoctorLayoutWrapper pageTitle="Reports">
      <div className="flex flex-col gap-6">
        {/* Page Header Area */}
        <div className="mb-2">
          <h2 className="text-2xl font-black text-[#6D6E70] tracking-tight uppercase">
            ANALYTICS & <span className="text-[#F17343]">REPORTS</span>
          </h2>
          <p className="text-sm text-slate-500 font-medium">Review clinic performance and patient trends</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Clinical Reports Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col justify-between transition-all hover:shadow-md">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-100 text-[#F17343] rounded-2xl">
                  <FaChartLine size={20} />
                </div>
                <h3 className="text-xl font-extrabold text-[#6D6E70] tracking-tight">Clinical Reports</h3>
              </div>
              
              {/* Data Visualization Placeholder */}
              <div className="space-y-4 mb-8">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#F17343] w-[70%] rounded-full" />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Patient Volume</p>
                  <span className="text-[#F17343] font-bold flex items-center gap-1">
                    <FaArrowUp size={10} /> 12%
                  </span>
                </div>
                <p className="text-sm text-slate-400 italic">Weekly summary of checkups and diagnostics completed.</p>
              </div>
            </div>

            <button className="flex items-center justify-center gap-2 w-full py-3 bg-[#6D6E70] text-white rounded-xl font-bold hover:bg-[#565759] transition-all shadow-lg shadow-slate-200">
              <FaFilePdf />
              Export PDF Report
            </button>
          </div>

          {/* AI Insights Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col justify-between transition-all hover:shadow-md">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-slate-100 text-[#6D6E70] rounded-2xl">
                  <FaRobot size={20} />
                </div>
                <h3 className="text-xl font-extrabold text-[#6D6E70] tracking-tight">AI Insights</h3>
              </div>

              {/* AI Insight Placeholder */}
              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 mb-8">
                <p className="text-xs font-black text-[#F17343] uppercase mb-1 tracking-tighter">Current Trend</p>
                <p className="text-sm text-[#6D6E70] font-medium leading-relaxed">
                  Based on recent data, there is a 15% increase in Myopia cases among patients aged 8-15.
                </p>
              </div>
            </div>

            <button className="flex items-center justify-center gap-2 w-full py-3 border-2 border-[#F17343] text-[#F17343] rounded-xl font-bold hover:bg-[#F17343] hover:text-white transition-all">
              <FaFileCsv />
              Export CSV Data
            </button>
          </div>
        </div>
      </div>
    </DoctorLayoutWrapper>
  );
}