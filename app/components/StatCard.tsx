const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4">
    <div className="bg-gray-100 p-3 rounded-2xl text-xl">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
      <div className="mt-3 h-1 w-20 rounded-full bg-indigo-500" />
    </div>
  </div>
);

export default StatCard;