import {ScrollArea} from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {CategoriesGetManyOutput} from "@/modules/categories/types";
import {useTRPC} from "@/trpc/client";
import {useQuery} from "@tanstack/react-query";
import {ChevronLeft, ChevronRightIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState} from "react";

interface CategoriesSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function CategoriesSidebar({
  open,
  onOpenChange,
}: CategoriesSidebarProps) {
  const trpc = useTRPC();
  const {data} = useQuery(trpc.categories.getMany.queryOptions());
  const [parentCategories, setParentCategories] =
    useState<CategoriesGetManyOutput | null>(null);
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<
    CategoriesGetManyOutput[1] | null
  >(null);

  const handleOpenChange = (open: boolean) => {
    setSelectedCategory(null);
    setParentCategories(null);
    onOpenChange(open);
  };
  const handleCategoryClick = (category: CategoriesGetManyOutput[1]) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(
        category.subcategories as unknown as CategoriesGetManyOutput
      );
      setSelectedCategory(category);
    } else {
      // leaf category
      if (parentCategories && selectedCategory) {
        // this is a sub category
        router.push(`/${selectedCategory.slug}/${category.slug}`);
      } else {
        // this is main category
        if (category.slug === "all") {
          router.push("/");
        } else {
          router.push(`/${category.slug}`);
        }
      }
      handleOpenChange(false);
    }
  };

  const backgroundColor = selectedCategory?.color || "white";

  const handleBackClick = () => {
    if (parentCategories) {
      setParentCategories(null);
      setSelectedCategory(null);
    }
  };

  // if we have parent categories, show them otherwise show root categories
  const currentCategories = parentCategories ?? data ?? [];
  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        className="p-0 transition-none"
        style={{background: backgroundColor}}
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {parentCategories && (
            <button
              onClick={handleBackClick}
              className="w-full text-left cursor-pointer p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
            >
              <ChevronLeft className="suze-4 mr-2" />
              Back
            </button>
          )}

          {currentCategories.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleCategoryClick(category)}
              className="w-full cursor-pointer text-left p-4 hover:bg-black hover:text-white flex items-center text-base justify-between font-medium"
            >
              {category.name}
              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronRightIcon />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
