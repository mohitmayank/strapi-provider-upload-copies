"use strict";

const baseProvider = {
  extend(obj) {
    Object.assign(this, obj);
  },
  upload() {
    throw new Error("Provider upload method is not implemented");
  },
  delete() {
    throw new Error("Provider delete method is not implemented");
  },
};

module.exports = {
  init(options) {
    const { providers } = options;
    if (!providers || !providers.length) {
      throw new Error("Providers are not set properly.");
    }
    const copyProviders = providers
      .filter(({ skip }) => !skip)
      .map(({ provider: providerName, providerOptions, afterUpload }) => {
        const importName = providerName.startsWith("strapi-provider-upload-")
          ? providerName
          : `strapi-provider-upload-${providerName}`;
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const providerInstance = require(importName).init(providerOptions);
        return Object.assign(Object.create(baseProvider), {
          ...providerInstance,
          upload: (file) => {
            return Promise.resolve(
              providerInstance.upload(file, providerOptions),
            ).then(() => {
              if (afterUpload) {
                return afterUpload(file);
              }
            });
          },
          delete: (file) => {
            return providerInstance.delete(file, providerOptions);
          },
        });
      });

    return {
      upload(file) {
        return Promise.all(
          copyProviders.map((provider) => provider.upload(file)),
        );
      },
      delete(file) {
        return Promise.all(
          copyProviders.map((provider) => provider.delete(file)),
        );
      },
    };
  },
};
