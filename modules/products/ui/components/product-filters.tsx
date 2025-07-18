"use client";

import {cn} from "@/lib/utils";
import {ChevronDown, ChevronRightIcon} from "lucide-react";
import {ReactNode, useState} from "react";
import {useProductFilters} from "../../hooks/use-product-filters";
import {PriceFilter} from "./price-filter";
import {TagsFilter} from "./tags-filter";

interface ProductFilterProps {
  title: string;
  className?: string;
  children: ReactNode;
}

const ProductFilter = ({children, title, className}: ProductFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = isOpen ? ChevronDown : ChevronRightIcon;

  return (
    <div className={cn(`p-4 border-b flex flex-col gap-2`, className)}>
      <div
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center justify-between cursor-pointer"
      >
        <p className="font-medium">{title}</p>
        <Icon className="size-5" />
      </div>
      {isOpen && children}
    </div>
  );
};
export function ProductFilters() {
  const [filters, setFilters] = useProductFilters();
  const onChange = (key: keyof typeof filters, value: unknown) => {
    setFilters({...filters, [key]: value});
  };
  const hasAnyFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "sort") {
      return false;
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === "string") {
      return value !== "";
    }
    return value !== null;
  });

  const onClear = () => {
    setFilters({
      maxPrice: "",
      minPrice: "",
      tags: [],
    });
  };

  return (
    <div className="border rounded-md bg-white">
      <div className="p-4 border-b flex items-center justify-between">
        <p className="font-medium">Filters</p>
        {hasAnyFilters && (
          <button
            className="underline cursor-pointer"
            onClick={onClear}
            type={"button"}
          >
            Clear
          </button>
        )}
      </div>

      <ProductFilter title="price" className="border-b-0">
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          minPriceAction={(value) => onChange("minPrice", value)}
          maxPriceAction={(value) => onChange("maxPrice", value)}
        />
      </ProductFilter>
      <ProductFilter title="Tags">
        <TagsFilter
          value={filters.tags}
          onChange={(value) => onChange("tags", value)}
        />
      </ProductFilter>
    </div>
  );
}
