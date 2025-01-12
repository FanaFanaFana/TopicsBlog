import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@models/user";
import { connectToDB } from "@utils/database";
import bcrypt from "bcrypt";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials.email || !credentials.password) {
            console.error("Missing email or password.");
            throw new Error("Missing email or password.");
          }

          const email = credentials.email;
          const password = credentials.password;

          await connectToDB();

          const user = await User.findOne({ email });
          if (!user) {
            console.error("User not found for email:", email);
            throw new Error("Invalid email or password.");
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            console.error("Invalid password for user:", email);
            throw new Error("Invalid email or password.");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            image: user.image || null,
          };
        } catch (error) {
          console.error("Error in authorize:", error.message);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (token?.user) {
        session.user = {
          id: token.user.id,
          email: token.user.email,
          username: token.user.username || token.user.name.toLowerCase().replace(/\s+/g, "_"),
          image: token.user.image,
        };
      }
      console.log("Session callback data:", session);
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;

        await connectToDB();
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          const newUser = new User({
            email: user.email,
            username: user.name.toLowerCase().replace(/\s+/g, "_"),
            image: user.image,
            authProvider: "google",
            authProviderId: user.id,
          });

          await newUser.save();
          console.log("New Google user created:", newUser);
        } else {
          console.log("Existing user found:", existingUser);
        }

        token.user.id = existingUser ? existingUser._id.toString() : newUser._id.toString();
      }
      return token;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
