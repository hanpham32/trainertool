import { Badge } from "./ui/badge";

export type StatType =
  | "HP"
  | "Attack"
  | "Defense"
  | "Sp. Attack"
  | "Sp. Defense"
  | "Speed";

interface StatBadgeProps {
  type: StatType;
  value: number;
  className?: string;
}

export default function EffortBadge({ type, value, className = "" }: StatBadgeProps) {
  // Map stat types to appropriate colors
  const colors = {
    "HP": "bg-green-400",
    "Attack": "bg-yellow-400",
    "Defense": "bg-orange-400",
    "Sp. Attack": "bg-blue-400",
    "Sp. Defense": "bg-purple-400",
    "Speed": "bg-pink-400"
  };

  // Get the appropriate background color for this stat type
  const bgColor = colors[type] || "bg-gray-500";

  return (
    <Badge className={`${bgColor} text-black ${className}`}>
      {value} {type}
    </Badge>
  );
}
