"use client";

const steps = ["Draft", "Dispatched", "In Progress", "Completed"];

function statusToStep(status: string): number {
  switch (status) {
    case "DRAFT": return 0;
    case "DISPATCHED": return 1;
    case "IN_PROGRESS": return 2;
    case "COMPLETED": return 3;
    case "CANCELLED": return -1;
    default: return -1;
  }
}

interface TripLifecycleProps {
  currentStep: number;
  tripStatus?: string | null;
}

export function TripLifecycle({ currentStep, tripStatus }: TripLifecycleProps) {
  const displayStep = tripStatus ? statusToStep(tripStatus) : currentStep;
  const showCancelled = tripStatus === "CANCELLED";

  return (
    <div className="flex items-center justify-between max-w-2xl mx-auto py-4">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                i <= displayStep
                  ? "bg-orange-500 border-orange-500 text-white"
                  : showCancelled && i === 0
                    ? "bg-red-50 border-red-300 text-red-400"
                    : "bg-transparent border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-400 dark:text-slate-500"
              }`}
            >
              {showCancelled && i === 0 ? "✕" : i + 1}
            </div>
            <span
              className={`text-xs mt-2 ${
                i <= displayStep ? "text-orange-500" : showCancelled && i === 0 ? "text-red-400" : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-16 h-0.5 mx-2 ${
                i < displayStep ? "bg-orange-500" : "bg-[#E2E8F0]"
              }`}
            />
          )}
        </div>
      ))}
      {showCancelled && (
        <span className="text-xs text-red-400 ml-4 font-medium">Cancelled</span>
      )}
    </div>
  );
}
