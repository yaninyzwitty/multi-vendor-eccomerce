import {Checkbox} from "@/components/ui/checkbox";
import {DEFAULT_LIMIT} from "@/modules/tags/constants";
import {useTRPC} from "@/trpc/client";
import {useInfiniteQuery} from "@tanstack/react-query";
import {LoaderIcon} from "lucide-react";

interface TagsFilterProps {
  value?: string[] | null;
  onChange?: (value: string[]) => void;
}

export function TagsFilter({onChange, value}: TagsFilterProps) {
  const trpc = useTRPC();

  const {data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage} =
    useInfiniteQuery(
      trpc.tags.getMany.infiniteQueryOptions(
        {limit: DEFAULT_LIMIT},
        {
          getNextPageParam: (lastPage) =>
            lastPage.docs.length > 0 ? lastPage.nextPage : undefined,
        }
      )
    );

  const onClick = (tag: string) => {
    if (value?.includes(tag)) {
      onChange?.(value.filter((t) => t !== tag) || []); //remove tag
    } else {
      onChange?.([...(value || []), tag]); //add tag
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <LoaderIcon className="size-4 animate-spin" />
        </div>
      ) : (
        data?.pages.map((page) =>
          page.docs.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between cursor-pointer"
              onClick={() => onClick(tag.name)}
            >
              <p className="font-medium">{tag.name}</p>
              <Checkbox
                checked={value?.includes(tag.name)}
                onCheckedChange={() => onClick(tag.name)}
              />
            </div>
          ))
        )
      )}
      {hasNextPage && (
        <button
          className="underline cursor-pointer font-medium justify-start text-start disabled:opacity-50"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}
