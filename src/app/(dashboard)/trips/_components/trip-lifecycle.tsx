"use client";

const steps = ["Draft", "Dispatched", "In Progress", "Completed"];

interface TripLifecycleProps {
  currentStep: number;
}

export function TripLifecycle({ currentStep }: TripLifecycleProps) {
  return (
    <div className="flex items-center justify-between max-w-2xl mx-auto py-4">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                i <= currentStep
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "bg-transparent border-[#2A2A3E] text-gray-500"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-xs mt-2 ${
                i <= currentStep ? "text-orange-500" : "text-gray-500"
              }`}
            >
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-16 h-0.5 mx-2 ${
                i < currentStep ? "bg-orange-500" : "bg-[#2A2A3E]"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
