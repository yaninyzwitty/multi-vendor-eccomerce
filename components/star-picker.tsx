import {cn} from "@/lib/utils";
import {StarIcon} from "lucide-react";
import React, {useState} from "react";

interface StarPickerProps {
  value?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}
export function StarPicker({
  onChange,
  className,
  disabled,
  value = 0,
}: StarPickerProps) {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div
      className={cn(
        "flex items-center",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          className={cn(
            "p-0.5 hover:scale-110 transition",
            !disabled && "cursor-pointer hover:scale-100"
          )}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
        >
          <StarIcon
            className={cn(
              "size-5",
              (hoverValue || (value as number)) >= star
                ? "fill-black stroke-black"
                : "stroke-black"
            )}
          />
        </button>
      ))}
    </div>
  );
}
