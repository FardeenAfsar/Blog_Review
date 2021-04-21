const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, cb) => {
        const newUser = {
          google: {
            googleID: profile.id,
            userName: profile.displayName,
            image: profile.photos[0].value,
          },
        };

        try {
          let user = await User.findOne({ "google.googleID": profile.id });

          if (!user) {
            user = await User.create(newUser);
          }
          cb(null, user);
        } catch (err) {
          console.log(err);
        }
      }
    )
  );

  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
      },
      async (username, password, done) => {
        const newUser = {
          local: {
            userName: username,
            password: password,
          },
        };

        try {
          let user = await User.findOne({ "local.userName": username });

          if (!user) {
            user = await User.create(newUser);
          }
          done(null, user);
        } catch (err) {
          console.log(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
