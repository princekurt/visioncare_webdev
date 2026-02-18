// components/tables/PatientRecordsTable.js
'use client';

export default function PatientRecordsTable({ records }) {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-white/20 backdrop-blur-md">
          <th className="p-3">ID</th>
          <th className="p-3">Date</th>
          <th className="p-3">Doctor</th>
          <th className="p-3">Diagnosis</th>
          <th className="p-3">Prescription</th>
        </tr>
      </thead>
      <tbody>
        {records.map((r) => (
          <tr key={r.id} className="hover:bg-white/10">
            <td className="p-3">{r.id}</td>
            <td className="p-3">{r.date}</td>
            <td className="p-3">{r.doctor}</td>
            <td className="p-3">{r.diagnosis}</td>
            <td className="p-3">{r.prescription}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
