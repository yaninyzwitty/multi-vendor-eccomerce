export type Subcategory = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  parent: string;
  subcategories: {
    docs: Subcategory[];
    hasNextPage: boolean;
  };
};

export type Category = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  color: string;
  subcategories: Subcategory[];
};

// Flattened version for UI usage
export type FlattenedCategory = Omit<Category, 'subcategories'> & {
  subcategories: Subcategory[];
};