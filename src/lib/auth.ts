import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  authCallback,
  loginPassword,
  signout,
} from "@/lib/services/auth-actions";

const credentialsProvider = CredentialsProvider({
  name: "Credentials",
  credentials: {
    email: { label: "email", type: "email" },
    password: { label: "password", type: "password" },
  },
  async authorize(credentials) {
    try {
      const { status, data } = await loginPassword(
        credentials.email,
        credentials.password
      );

      if ((status === 200 || status === 201) && data?.user && data?.token) {
        return { ...data.user, userToken: data.token };
      }
      return null;
    } catch (error) {
      console.error("Authorize error:", error);
      return null;
    }
  },
});

const callbacks = {
  async jwt({ token, user }: any) {
    const syncBackendToken = async (email: string, name?: string, image?: string) => {
      try {
        const result = await authCallback(email, name || email, image || "");
        const { status, data } = result;

        if ((status === 200 || status === 201) && data?.user && data?.token) {
          token._id = data.user._id;
          token.role = data.user.role;
          token.client = data.user.client;
          token.userToken = data.token;
          token.userTokenSyncedAt = Date.now();
        } else {
          console.error("Auth callback failed or returned incomplete data", { status, data });
        }
      } catch (error) {
        console.error("Error in authCallback (JWT):", error);
      }
    };

    if (user) {
      await syncBackendToken(user.email, user.name, user.image);
    } else if (token?.email && shouldRefreshBackendToken(token)) {
      await syncBackendToken(token.email, token.name, token.picture);
    }

    // Force admin role for these specific emails in the frontend (Persistent)
    const ADMIN_EMAILS = ["khaledahmedhaggagy@gmail.com", "xappeeteamegypt@gmail.com"];
    if (token?.email && ADMIN_EMAILS.includes(token.email)) {
      token.role = "admin";
    }

    return token;
  },
  async session({ session, token }: any) {
    if (token.userToken) {
      session.userToken = token.userToken;
    }

    // Initialize session.user if it doesn't exist
    if (!session.user) session.user = {};

    // Copy data from token if available
    if (token._id) session.user._id = token._id;
    if (token.role) session.user.role = token.role;
    if (token.client) session.user.client = token.client;

    // Force admin role for these specific emails (Persistent Fix)
    const ADMIN_EMAILS = ["khaledahmedhaggagy@gmail.com", "xappeeteamegypt@gmail.com"];
    if (session.user?.email && ADMIN_EMAILS.includes(session.user.email)) {
      session.user.role = "admin";
    }

    return session;
  },
};

const events = {
  async signOut({ token }: any) {
    try {
      if (token?.userToken) {
        const ok = await signout(token.userToken);
        if (ok) {
          token.userToken = null;
        } else {
          console.log("Failed to sign out");
        }
      }
    } catch (error) {
      console.error("Sign out error:", error);
    }
  },
};

const providers: any[] = [credentialsProvider];

// Only add Google provider when credentials are configured
if (process.env.GOOGLE_OAUTH_CLIENT_ID && process.env.GOOGLE_OAUTH_CLIENT_SECRET) {
  providers.unshift(
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
        },
      },
    })
  );
}

export const AuthPages = {
  signIn: "/login",
};

export const AuthOptions = {
  providers,
  pages: AuthPages,
  callbacks,
  events,
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthOptions;

export const getCurrentSession = async () =>
  await getServerSession(AuthOptions);

const decodeJwtPayload = (jwt?: string | null) => {
  if (!jwt || typeof jwt !== "string") return null;

  const payload = jwt.split(".")[1];
  if (!payload) return null;

  try {
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(Buffer.from(normalizedPayload, "base64").toString("utf8"));
  } catch {
    return null;
  }
};

const isBackendTokenExpired = (jwt?: string | null) => {
  const payload = decodeJwtPayload(jwt);
  if (!payload?.exp) return true;

  const refreshSkewInSeconds = 60;
  return payload.exp <= Math.floor(Date.now() / 1000) + refreshSkewInSeconds;
};

const shouldRefreshBackendToken = (token: any) => {
  if (!token?.userToken || isBackendTokenExpired(token.userToken)) return true;
  if (!token.userTokenSyncedAt) return true;

  const refreshAgeInMs = 12 * 60 * 60 * 1000;
  return Date.now() - Number(token.userTokenSyncedAt) >= refreshAgeInMs;
};

export const refreshBackendToken = async (session: any) => {
  const email = session?.user?.email;
  if (!email) return null;

  const result = await authCallback(
    email,
    session?.user?.name || email,
    session?.user?.image || ""
  );

  if ((result.status === 200 || result.status === 201) && result.data?.token) {
    return result.data.token;
  }

  return null;
};

