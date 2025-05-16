import {FlattenedCategory} from "@/types";
import Link from "next/link";

interface SubcategoryMenuProps {
  category: FlattenedCategory;
  isOpen: boolean;
  position: {top: number; left: number};
}
export default function SubcategoryMenu({
  category,
  isOpen,
  position,
}: SubcategoryMenuProps) {
  if (
    !isOpen ||
    !category.subcategories ||
    category.subcategories.length === 0
  ) {
    return null;
  }

  const bgColor = category.color || `#f5f5f5`;

  return (
    <div
      className="fixed z-100"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {/* add invisible bridge to maintain hover */}
      <div className="h-3 w-60" />
      <div
        style={{backgroundColor: bgColor}}
        className="w-60 text-black rounded-md overflow-hidden border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[2px] -translate-y-[2px] "
      >
        <div>
          {category.subcategories.map((subCategory) => (
            <Link
              href={`/${category.slug}/${subCategory.slug}`}
              key={subCategory.slug}
              className=" w-full p-4 hover:bg-black hover:text-white flex items-center justify-between text-left underline font-medium"
            >
              <p>{subCategory.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
