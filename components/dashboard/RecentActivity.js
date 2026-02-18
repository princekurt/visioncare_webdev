export default function RecentActivity() {
  const activities = [
    { id: 1, action: 'Checked up patient Alice Smith', time: '2 hours ago' },
    { id: 2, action: 'Added new patient Bob Johnson', time: '5 hours ago' },
    { id: 3, action: 'Updated prescription for Charlie Lee', time: '1 day ago' },
  ];

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-xl p-6">
      <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
      <ul className="flex flex-col gap-3">
        {activities.map((act) => (
          <li key={act.id} className="p-3 rounded-lg bg-white/10 hover:bg-white/30 transition">
            <p className="text-gray-800">{act.action}</p>
            <span className="text-gray-500 text-sm">{act.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
