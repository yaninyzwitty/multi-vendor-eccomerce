import {Category, Subcategory} from "@/payload-types";
import configPromise from "@payload-config";
import {CollectionSlug, getPayload} from "payload";
import {Footer} from "./footer";
import {Navbar} from "./navbar";
import {SearchFilters} from "./search-filters";
import {FlattenedCategory} from "@/types";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories" as CollectionSlug,
    depth: 1, //populate subqueries,
    pagination: false,
    where: {
      parent: {
        exists: false,
      },
    },
  });

  const formattedData: FlattenedCategory[] = data.docs.map((doc: unknown) => {
    const typedDoc = doc as Category;
    return {
      ...typedDoc,
      // coz of depth one
      subcategories: (typedDoc.subcategories?.docs ?? []).map(
        (doc: Subcategory) => ({
          ...(doc as Subcategory),
        })
      ),
    };
  });

  return (
    <div className="flex flex-col min-h-screen ">
      <Navbar />
      <SearchFilters data={formattedData} />
      <div className="flex-1 bg-[#f4f4f0]">{children}</div>
      <Footer />
    </div>
  );
}
