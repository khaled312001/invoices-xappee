import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

const ADMINS: any = {
  "zashobky4@gmail.com": true,
  "shobkyy@gmail.com": false,
  "teamxappee@gmail.com": true,
  "xappeedt@gmail.com": true,
  "xappee@gmail.com": true,
  "mh@xappee.com": true,
  "fa@xappee.com": true,
  "mashukxappee@gmail.com": true,
  "jakirxappee@gmail.com": true,
  "rodainaxappee@gmail.com": true,
  "nadaxappee@gmail.com": true,
  "kdxappee@gmail.com": true,
  "hadeerelnaghy2@gmail.com": true,
  "hadeerxappee@gmail.com": true,
  "khaledahmedhaggagy@gmail.com": true,
  "xappeeteamegypt@gmail.com": true,
};

export default withAuth(
  function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    // Allow access to images in the public folder
    if (pathname.startsWith("/images/") || pathname.startsWith("/public/")) {
      return NextResponse.next();
    }
  },
  {
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized: async ({ req, token }: any) => {
        const pathname = req.nextUrl.pathname;
        if (pathname === "/login" || pathname === "/signup") {
          return true;
        }
        // if (token && ADMINS[token.email]) {
        if (token) {
          return true;
        }
        return false;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
