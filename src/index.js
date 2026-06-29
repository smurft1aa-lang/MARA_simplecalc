export default {
  async fetch(request, env, ctx) {
    // Pass all requests through to static assets.
    // This enables the Workers runtime so metrics (request counts,
    // CPU time, error rates) appear on the Cloudflare dashboard.
    return env.ASSETS.fetch(request);
  },
};
