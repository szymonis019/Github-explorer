import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api', 
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'GitHub Explorer API Docs',
        version: '1.1.0',
        description: 'Documentation for GitHub Explorer API',
      },
      servers: [
        {
          url: 'http://localhost:3000',
        },
      ],
    },
  });
  return spec;
};