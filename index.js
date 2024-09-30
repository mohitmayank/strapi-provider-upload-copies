"use strict";

module.exports = {
  init(options) {
    console.log("strapi-provider-upload-copies options", options);
    return {
      upload(file) {
        throw new Error("Method not implemented.", file);
      },
      delete(file) {
        throw new Error("Method not implemented.", file);
      },
    };
  },
};
