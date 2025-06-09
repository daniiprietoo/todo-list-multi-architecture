import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export type Architecture = "monolith" | "layered" | "microservices";

const ARCHITECTURES: { label: string; value: Architecture }[] = [
  { label: "Monolith", value: "monolith" },
  { label: "Layered", value: "layered" },
  { label: "Microservices", value: "microservices" },
];

export function ArchitectureSelector({
  selected,
  onSelect,
  className,
}: {
  selected: Architecture;
  onSelect: (arch: Architecture) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-2", className)}>
      {ARCHITECTURES.map((arch) => (
        <Button
          key={arch.value}
          variant={selected === arch.value ? "default" : "outline"}
          onClick={() => onSelect(arch.value)}
        >
          {arch.label}
        </Button>
      ))}
    </div>
  );
}
