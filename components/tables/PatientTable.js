'use client';

export default function PatientTable({ patients }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-white/20 backdrop-blur-md">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Age</th>
            <th className="p-3 text-left">Last Visit</th>
            <th className="p-3 text-left">Next Visit</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p, idx) => (
            <tr key={p.id} className={idx % 2 === 0 ? 'bg-white/10' : ''}>
              <td className="p-3">{p.patient_code || p.id}</td>
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.age}</td>
              <td className="p-3">{p.last_visit}</td>
              <td className="p-3">{p.next_visit || '-'}</td>
              <td className="p-3">{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
