export default function Input({ ...props }) {
  return (
    <input
      {...props}
      className="p-3 rounded-lg bg-white/20 backdrop-blur-md shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
    />
  );
}
