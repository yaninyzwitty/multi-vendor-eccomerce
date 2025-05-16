"use client";
import {FlattenedCategory} from "@/types";
import {CategoryDropdown} from "./category-dropdown";
import {useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {ListFilterIcon} from "lucide-react";
import {CategoriesSidebar} from "./categories-sidebar";

interface Props {
  data: FlattenedCategory[];
}

export function Categories({data}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState(data.length);
  const [isAnyHover, setIsAnyHover] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // mock active category
  const activeCategory = "all";
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
    <div className="relative w-full">
      {/* render categories sidebar */}

      <CategoriesSidebar
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        data={data}
      />
      {/* Hidden div to measure all items */}
      <div
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none flex"
        style={{position: "fixed", top: -9999, left: -9999}}
      >
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

      {/* Sidebar for all categories when "View All" is clicked
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute right-0 top-0 h-full w-64 bg-white p-4 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">All Categories</h3>
              <button onClick={() => setIsSidebarOpen(false)}>×</button>
            </div>
            <div className="space-y-2">
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
          </div>
        </div>
      )} */}
    </div>
  );
}
