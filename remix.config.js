export default {
  future: {
    v2_errorBoundary: true,
    v2_routeConvention: true,
  },
  server: "./server.ts",
  serverBuildPath: "functions/[[path]].js",
  serverMinify: true,
  serverModuleFormat: "esm",
  serverPlatform: "neutral",
};
