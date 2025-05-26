import React from "react";
interface CategoryPageProps {
  params: Promise<{category: string; subcategory: string}>;
}
export default async function CategoryPage({params}: CategoryPageProps) {
  const {subcategory: subCategory, category} = await params;
  return <div>{`${category}: ${subCategory}`}</div>;
}
