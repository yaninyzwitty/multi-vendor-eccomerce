"use client";

import {useTRPC} from "@/trpc/client";
import {useMutation} from "@tanstack/react-query";
import {LoaderIcon} from "lucide-react";
import {useEffect} from "react";

export default function StripeVerify() {
  const trpc = useTRPC();
  const {mutate: verify} = useMutation(
    trpc.checkout.verifyProcedure.mutationOptions({
      onSuccess(data) {
        window.location.href = data.url;
      },
      onError() {
        window.location.href = "/";
      },
    })
  );

  useEffect(() => {
    verify();
  }, [verify]);
  return (
    <div className="flex items-center min-h-screen justify-center">
      <LoaderIcon className="animate-spin text-muted-foreground" />
    </div>
  );
}
