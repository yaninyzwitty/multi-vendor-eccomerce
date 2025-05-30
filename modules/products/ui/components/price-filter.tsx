"use client";

import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {formatAsCurrency} from "@/lib/utils";
import {ChangeEvent} from "react";

interface Props {
  minPrice?: string | null;
  maxPrice?: string | null;
  minPriceAction: (value: string) => void;
  maxPriceAction: (value: string) => void;
}

export function PriceFilter({
  maxPriceAction,
  minPriceAction,
  maxPrice,
  minPrice,
}: Props) {
  const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    // the raw input value and extract only numeric values
    const numericValue = e.target.value.replace(/[^0-9.]/g, "");
    minPriceAction(numericValue);
  };
  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    // the raw input value and extract only numeric values
    const numericValue = e.target.value.replace(/[^0-9.]/g, "");
    maxPriceAction(numericValue);
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Label className="font-medium text-base">Minimum price</Label>
        <Input
          type="text"
          placeholder="$0"
          value={minPrice ? formatAsCurrency(minPrice) : ""}
          onChange={handleMinPriceChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="font-medium text-base">Maximum price</Label>
        <Input
          type="text"
          placeholder="∞"
          value={maxPrice ? formatAsCurrency(maxPrice) : ""}
          onChange={handleMaxPriceChange}
        />
      </div>
    </div>
  );
}
