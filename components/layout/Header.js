export default function Header({ title, doctor }) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="font-semibold">{doctor.name}</div>
          <div className="text-sm text-gray-200">{doctor.specialty}</div>
        </div>
        <img src={doctor.avatar} alt="Doctor Avatar" className="w-12 h-12 rounded-full" />
      </div>
    </div>
  );
}
