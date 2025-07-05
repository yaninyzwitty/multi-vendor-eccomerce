import {Button} from "@/components/ui/button";
import {generateTenantUrl} from "@/lib/utils";
import Link from "next/link";

export function Navbar({slug}: {slug: string}) {
  return (
    <nav className="h-20 border-b bg-white">
      <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">
        <p className="text-xl">Checkout</p>

        <Button variant={"elevated"} asChild>
          <Link href={generateTenantUrl(slug)}>Continue Shopping</Link>
        </Button>
      </div>
    </nav>
  );
}
