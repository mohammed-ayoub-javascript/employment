import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const options: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.SECERT as string,
  session: {
    strategy: "jwt",
    maxAge: 15 * 15 * 15 * 6,
  },
};
