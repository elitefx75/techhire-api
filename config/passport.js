const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const getGitHubCallbackUrl = () => {
  // Prefer the deployed app URL when running in Render or any hosted environment.
  const deployedBaseUrl = process.env.RENDER_EXTERNAL_URL || process.env.APP_URL || process.env.CALLBACK_URL || process.env.REDIRECT_URI || process.env.RE_DIRECT_URI;
  if (deployedBaseUrl) {
    return `${deployedBaseUrl.trim().replace(/\/$/, '')}/auth/github/callback`;
  }

  // Only use a direct GitHub callback override when no deployed host is available.
  if (process.env.GITHUB_CALLBACK_URL) {
    return process.env.GITHUB_CALLBACK_URL.trim();
  }

  const port = process.env.PORT || 4000;
  return `http://localhost:${port}/auth/github/callback`;
};

const githubCallbackURL = getGitHubCallbackUrl();
console.log(`GitHub callback URL: ${githubCallbackURL}`);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: githubCallbackURL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = {
          githubId: profile.id,
          username: profile.username,
          displayName: profile.displayName,
          email: profile.emails?.[0]?.value || null,
          avatar: profile.photos?.[0]?.value || null
        };

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;