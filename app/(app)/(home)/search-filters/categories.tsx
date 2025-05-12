import {FlattenedCategory} from "@/types";
import {CategoryDropdown} from "./category-dropdown";

interface Props {
  data: FlattenedCategory[];
}
export function Categories({data}: Props) {
  return (
    <div className="relative w-full ">
      <div className="flex flex-nowrap items-center">
        {data.map((category) => {
          return (
            <div key={category.id}>
              <CategoryDropdown
                category={category}
                isActive={false}
                isNavigationHovered={false}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
