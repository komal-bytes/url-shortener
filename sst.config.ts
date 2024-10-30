/// <reference path="./.sst/platform/config.d.ts" />


export default $config({
  app(input) {
    return {
      name: "url-shortener",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  // async run() {
  //   new sst.aws.StaticSite("UrlShortener", {
  //     path: "site",
  //   });
  // },

  async run() {

    let hono = await import("./infra/api");
    await import("./infra/web");
    await import("./infra/storage");

    // return {
    //   UserPool: auth.userPool.id,
    //   Region: aws.getRegionOutput().name,
    //   IdentityPool: auth.identityPool.id,
    //   UserPoolClient: auth.userPoolClient.id,
    // };
    
    return {
      api: hono.hono.url
    }
    // https://jsesihc3bfshlqsso3kxbdykdy0thoom.lambda-url.us-east-1.on.aws/

  }
});
