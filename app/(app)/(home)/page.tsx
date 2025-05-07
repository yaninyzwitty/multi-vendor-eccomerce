import configPromise from "@payload-config";
import {CollectionSlug, getPayload} from "payload";

export default async function Home() {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories" as CollectionSlug,
  });

  return <div className="p-4">{JSON.stringify(data, null, 2)}</div>;
}
