import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  authCallback,
  loginPassword,
  signout,
} from "@/lib/services/auth.service";

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

      if (status === 200 && data.user && data.token) {
        return { ...data.user, userToken: data.token };
      }
    } catch (error) {
      console.error("Authorize error:", error);
      return null;
    }
    return null;
  },
});

const callbacks = {
  async jwt({ token, user }: any) {
    if (user) {
      const { data } = await authCallback(user.email, user.name, user.image);
      token._id = data.user._id;
      token.role = data.user.role;
      token.client = data.user.client;
      token.userToken = data.token;
    }
    return token;
  },
  async session({ session, token }: any) {
    if (token.userToken) {
      session.userToken = token.userToken;
    }
    if (token._id) {
      session.user = { ...session.user, _id: token._id, role: token.role, client: token.client };
    }

    return session;
  },
};

const events = {
  async signOut({ token }: any) {
    try {
      const ok = await signout(token);
      if (ok) {
        token.userToken = null;
      } else {
        console.log("Failed to sign out");
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
