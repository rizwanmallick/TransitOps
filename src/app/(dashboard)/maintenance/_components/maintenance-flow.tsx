"use client";

const states = [
  { label: "Available", color: "bg-green-500" },
  { label: "In Shop", color: "bg-red-500" },
  { label: "Available", color: "bg-green-500" },
];

export function MaintenanceFlow() {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {states.map((state, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${state.color}`}>
            {state.label}
          </div>
          {i < states.length - 1 && (
            <span className="text-gray-500">&rarr;</span>
          )}
        </div>
      ))}
    </div>
  );
}
