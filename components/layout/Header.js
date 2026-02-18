export default function Header({ title, doctor }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center 
                      bg-white/20 backdrop-blur-md border border-white/30 
                      shadow-xl rounded-xl p-4">
        {/* Page Title */}
        <h1 className="text-2xl font-bold">{title}</h1>

        {/* Doctor Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-semibold">{doctor.name}</p>
            <p className="text-sm text-black-200">{doctor.specialty}</p>
          </div>
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="w-12 h-12 rounded-full border-2 border-white/50 shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
