import { cookies as getCookies } from "next/headers";

type Props = {
    prefix: string;
    value: string;
}


export const generateAuthCookie = async ({ prefix, value  }: Props) => {
    const cookies = await getCookies();
    cookies.set({
    name: `${prefix}-token`,
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
    domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN
    });

    console.log('cookies set')
                       
}