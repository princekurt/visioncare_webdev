'use client';

import Card from '../../../components/ui/Card';
import { FaUserInjured, FaClipboardCheck, FaClock, FaCheckCircle } from 'react-icons/fa';
import RecentActivity from '../../../components/dashboard/RecentActivity';
import DoctorLayoutWrapper from '../../../components/layout/DoctorLayoutWrapper';

export default function Dashboard() {
  return (
    <DoctorLayoutWrapper pageTitle="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Patients" value="125" icon={<FaUserInjured />} />
        <Card title="Checkups Today" value="8" icon={<FaClipboardCheck />} />
        <Card title="Pending Records" value="5" icon={<FaClock />} />
        <Card title="Completed This Month" value="72" icon={<FaCheckCircle />} />
      </div>

      <div className="mt-8">
        <RecentActivity />
      </div>
    </DoctorLayoutWrapper>
  );
}
