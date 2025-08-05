import {SignInView} from "@/modules/auth/ui/views/sign-in-view";
import config from "@payload-config";
import {redirect} from "next/navigation";

import {headers as getHeaders} from "next/headers";
import {getPayload} from "payload";

export default async function SignInPage() {
  const headers = await getHeaders();
  const payload = await getPayload({config});

  const session = await payload.auth({headers});

  if (session.user) {
    redirect("/");
  }

  return <SignInView />;
}
