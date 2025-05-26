import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

interface BreadCrumbNavigationProps {
  activeCategoryName?: string | null;
  activeCategory?: string | null;
  activeSubcategoryName?: string | null;
}
export default function BredCrumbNavigation({
  activeCategory,
  activeCategoryName,
  activeSubcategoryName,
}: BreadCrumbNavigationProps) {
  if (!activeCategory || activeCategoryName == "all") return;
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {activeSubcategoryName && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild
                className="text-xl font-medium underline text-primary"
              >
                <Link href={`/${activeCategory}`}>{activeCategoryName}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator className="text-primary font-medium text-xl">
              /
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xl font-medium ">
                {activeSubcategoryName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
        <BreadcrumbItem>
          <BreadcrumbPage className="text-xl font-medium ">
            {activeCategoryName}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
