export default function Header({ title, doctor, patient }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/20 backdrop-blur-md rounded-xl shadow-md mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>

      {/* Show doctor info if provided */}
      {doctor && (
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-semibold">{doctor.name}</p>
            <p className="text-sm text-gray-600">{doctor.specialty}</p>
          </div>
        </div>
      )}

      {/* Show patient info if provided */}
      {patient && (
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-semibold">{patient.name}</p>
            <p className="text-sm text-gray-600">{patient.email}</p>
          </div>
          <img src={patient.avatar} className="w-10 h-10 rounded-full" />
        </div>
      )}
    </div>
  );
}
