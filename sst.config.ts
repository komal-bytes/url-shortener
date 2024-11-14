/// <reference path="./.sst/platform/config.d.ts" />


export default $config({
  app(input) {
    return {
      name: "url-shortener",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },

  async run() {



    let { hono } = await import("./infra/api");
    await import("./infra/web");
    await import("./infra/storage");

    return {
      api: hono.url,
      // lambdaurl: router.url
    }

  }
});
