import { NextResponse, NextRequest } from "next/server";

export const config = {
    matcher: [
        "/((?!api/|_next/|_static/|_vercel|media/|[\w-]+\.\w+).*)"
    ]
};

export default async function middleware(request:NextRequest) {
    const url  = request.nextUrl;
    const hostName = request.headers.get('host') || '';

    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "";
    if (hostName.endsWith(`.${rootDomain}`)){
        const tenantSlug = hostName.replace(`.${rootDomain}`, "");
        return NextResponse.rewrite(new URL(`/tenants/${tenantSlug}${url.pathname}`, request.url))
    }

    return NextResponse.next()
    
}