export default function Card({ title, value, icon, children }) {
  return (
    <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-xl p-6 hover:shadow-2xl transition">
      {title && <div className="text-lg font-semibold mb-2">{title}</div>}
      {value && <div className="text-3xl font-bold flex items-center gap-2">{icon}{value}</div>}
      {children}
    </div>
  );
}
