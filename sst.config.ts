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



    let hono = await import("./infra/api");
    await import("./infra/web");
    await import("./infra/storage");

    // new sst.aws.Router("MyRouter", {
    //   domain: "link.komal.codes",
    //   routes: {
    //     "/*": hono.hono.url
    //   }
    // });

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
