import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "green" | "blue" | "purple" | "red" | "gray" | "orange";

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-500/20 text-gray-400",
  green: "bg-green-500/20 text-green-400",
  blue: "bg-blue-500/20 text-blue-400",
  purple: "bg-purple-500/20 text-purple-400",
  red: "bg-red-500/20 text-red-400",
  gray: "bg-gray-500/20 text-gray-400",
  orange: "bg-orange-500/20 text-orange-400",
};

function getStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case "AVAILABLE":
      return "green";
    case "ON_TRIP":
      return "blue";
    case "IN_PROGRESS":
      return "blue";
    case "DISPATCHED":
      return "purple";
    case "IN_SHOP":
    case "IN_REPAIR":
      return "red";
    case "SUSPENDED":
      return "red";
    case "RETIRED":
      return "gray";
    case "OFF_DUTY":
      return "gray";
    case "DRAFT":
      return "gray";
    case "COMPLETED":
      return "green";
    case "CANCELLED":
      return "gray";
    case "ACTIVE":
      return "red";
    default:
      return "default";
  }
}

function getStatusLabel(status: string): string {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const computedVariant = variant || getStatusVariant(status);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        variantStyles[computedVariant],
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          computedVariant === "green" && "bg-green-400",
          computedVariant === "blue" && "bg-blue-400",
          computedVariant === "purple" && "bg-purple-400",
          computedVariant === "red" && "bg-red-400",
          computedVariant === "gray" && "bg-gray-400",
          computedVariant === "orange" && "bg-orange-400"
        )}
      />
      {getStatusLabel(status)}
    </span>
  );
}
