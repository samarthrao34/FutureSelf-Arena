import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";

export function SparkleIcon({
  icon: Icon,
  className,
  ...props
}: { icon: React.ElementType<LucideProps> } & LucideProps) {
  return (
    <Icon
      className={cn(
        "text-accent drop-shadow-[0_0_5px_hsl(var(--accent))] shrink-0",
        className
      )}
      {...props}
    />
  );
}
