"use client";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {CategoriesGetManyOutput} from "@/modules/categories/types";
import {ListFilterIcon} from "lucide-react";
import {useParams} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import {CategoriesSidebar} from "./categories-sidebar";
import {CategoryDropdown} from "./category-dropdown";

interface Props {
  data: CategoriesGetManyOutput;
}

export function Categories({data}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);
  const params = useParams();

  const [visibleCount, setVisibleCount] = useState(data.length);
  const [isAnyHover, setIsAnyHover] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const categoryParam = params.category as string | undefined;
  const activeCategory = categoryParam || "all";
  const activeCategoryIndex = data.findIndex(
    (category) => category.slug === activeCategory
  );
  const isActiveCategoryHidden =
    activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

  useEffect(() => {
    const calculateVisible = () => {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current) {
        return;
      }

      const containerWidth = containerRef.current.offsetWidth;
      const viewAllWidth = viewAllRef.current.offsetWidth;
      const availableWidth = containerWidth - viewAllWidth;

      const items = Array.from(measureRef.current.children);

      let totalWidth = 0;
      let visible = 0;
      for (const item of items) {
        const width = item.getBoundingClientRect().width;

        if (totalWidth + width > availableWidth) break;
        totalWidth += width;
        visible++;
      }

      setVisibleCount(visible);
    };

    const resizeObserver = new ResizeObserver(calculateVisible);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [data.length]);

  return (
    <div className="relative w-full mt-1">
      {/* render categories sidebar */}

      <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
      {/* Hidden div to measure all items */}
      <div
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none flex"
        style={{position: "fixed", top: -9999, left: -9999}}
      >
        {/* TODO-add all categories */}
        {data.map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={activeCategory === category.slug}
              isNavigationHovered={false}
            />
          </div>
        ))}
      </div>

      {/* Visible categories container */}
      <div
        ref={containerRef}
        className="flex flex-nowrap items-center overflow-hidden"
        onMouseEnter={() => setIsAnyHover(true)}
        onMouseLeave={() => setIsAnyHover(false)}
      >
        {/* Visible categories */}
        {data.slice(0, visibleCount).map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={activeCategory === category.slug}
              isNavigationHovered={isAnyHover}
            />
          </div>
        ))}
        {/* "View All" dropdown for hidden categories */}
        <div ref={viewAllRef} className="shrink-0">
          <Button
            variant={"elevated"}
            className={cn(
              "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
              isActiveCategoryHidden && !isAnyHover && "bg-white border-primary"
            )}
            onClick={() => setIsSidebarOpen(true)}
          >
            View All
            <ListFilterIcon className="ml-2" />
          </Button>
        </div>
        {/* Make sure active category is always visible even if it would be hidden */}
        {isActiveCategoryHidden && activeCategoryIndex !== -1 && (
          <div className="ml-2">
            <CategoryDropdown
              category={data[activeCategoryIndex]}
              isActive={true}
              isNavigationHovered={isAnyHover}
            />
          </div>
        )}
      </div>
    </div>
  );
}
