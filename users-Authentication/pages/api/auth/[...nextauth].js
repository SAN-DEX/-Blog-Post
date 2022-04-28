import NextAuth from "next-auth";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";

import User from "../../../models/user.model";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Code Coast",
      credentials: {
        email: {
          label: "Email Address",
          type: "email",
          placeholder: "john.doe@email.com",
          required: true,
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "Please enter your password",
        },
        authorize: async (credentials) => {
          const { email, password } = credentials;

          //checking if user is on the database
          let user = await User.findOne({ email: email });
          if (!user) {
            return null;
          }

          //checking if password match
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) return null;

          //returning the user
          return user;
        },
      },
    }),
  ],
  callback: {
    jwt: ({ token, user }) => {
      if (token) {
        token.id = user._id;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session) {
        session.id = token.id;
        session.firstname = token.firstname;
        session.lastname = token.lastname;
      }
      return session;
    },
  },
  secret: "secret",
  jwt: {
    secret: "ThisIsMySecret",
    encrypt: true,
  },
});
