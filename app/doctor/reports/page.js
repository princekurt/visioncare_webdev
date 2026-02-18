'use client';

import Card from '../../../components/ui/Card';
import DoctorLayoutWrapper from '../../../components/layout/DoctorLayoutWrapper';
import Button from '../../../components/ui/Button';

export default function Reports() {
  return (
    <DoctorLayoutWrapper pageTitle="Reports">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-semibold mb-4">Clinical Reports</h3>
          <p className="text-gray-600">Report charts and data placeholders</p>
          <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Export PDF</Button>
        </Card>
        <Card>
          <h3 className="text-xl font-semibold mb-4">AI Insights</h3>
          <p className="text-gray-600">AI-generated insights placeholder</p>
          <Button className="mt-4 bg-purple-600 hover:bg-purple-700">Export CSV</Button>
        </Card>
      </div>
    </DoctorLayoutWrapper>
  );
}
