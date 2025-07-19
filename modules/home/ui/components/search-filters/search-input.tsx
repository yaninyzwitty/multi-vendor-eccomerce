"use client";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {BookmarkCheck, ListFilterIcon, SearchIcon} from "lucide-react";
import {useState} from "react";
import {CategoriesSidebar} from "./categories-sidebar";
import {useTRPC} from "@/trpc/client";
import {useQuery} from "@tanstack/react-query";
import Link from "next/link";

interface SearchInputProps {
  disabled?: boolean;
}
export function SearchInput({disabled}: SearchInputProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const trpc = useTRPC();
  const {data: session} = useQuery(trpc.auth.session.queryOptions());
  return (
    <div className="flex items-center gap-2 w-full">
      <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
      <div className="relative w-full ">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
        <Input
          className="pl-8 "
          placeholder="Search products"
          disabled={disabled}
        />
      </div>
      <Button
        variant={"elevated"}
        className="size-12 shrink-0 flex lg:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <ListFilterIcon />
      </Button>
      {session?.user?.id && (
        <Button variant={"elevated"} asChild>
          <Link href={`/library`} prefetch>
            <BookmarkCheck />
            Library
          </Link>
        </Button>
      )}
    </div>
  );
}
