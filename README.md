# strapi-provider-upload-copies
A upload provider for strapi for uploading multiples copies to multiple desitnations using existing providers

you can provide multiple providers which will also be used for uploading copies of file. Its usefull when you want to upload files at multiple destinations. Following is an example configuration - 

```javascript
module.exports = ({ env }) => {
  return {
    upload: {
      provider: 'copies',
      providerOptions: {
        providers: [
          {
            provider: 'aws-s3',
            skip: process.env.NODE_ENV === 'development',
            providerOptions: {
              accessKeyId: env('AWS_KEY_ID'),
              secretAccessKey: env('AWS_KEY_SECRET'),
              region: env('S3_REGION'),
              params: {
                Bucket: env('S3_IMAGE_BUCKET'),
                CacheControl: 'max-age=2592000,public',
                Expires: '2050-01-01T00:00:00Z',
              },
            },
          },
          {
            provider: 'azure-storage',
            providerOptions: {
              account: env('AZURE_ACCOUNT'),
              accountKey: env('AZURE_ACCOUNT_KEY'),
              authType: 'default',
              containerName: '$web',
              defaultCacheControl: 'max-age=2592000,public',
              defaultPath: 'uploads',
            },
            afterUpload: (file) => {
              // hotfix for azure storage url
              file.url = file.url.replace('%24web/', '');
              return file;
            },
          },
        ],
      },
    },
  };
};

```