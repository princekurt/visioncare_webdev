'use client';

export default function HeaderPatient({ title, patient }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-semibold">{patient?.name}</p>
          <p className="text-sm text-gray-600">{patient?.email}</p>
        </div>
        <img
          src={patient?.avatar || '/patient-avatar.png'}
          alt="Patient"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </div>
  );
}
