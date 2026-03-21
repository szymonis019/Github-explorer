'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

/**
 * OpenAPI 3.0 Specification.
 */
const spec = {
  openapi: "3.0.0",
  info: {
    title: "GitHub Explorer Internal API",
    version: "1.0.0",
    description: "Documentation for our custom API proxy that interacts with GitHub's servers."
  },
  // Points to our local Next.js development server
  servers: [{ url: "http://localhost:3000" }],
  paths: {
    // Documents the direct user profile proxy
    "/api/user/{username}": {
      get: {
        summary: "Get user profile",
        parameters: [
          { name: "username", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "Success - User data retrieved" },
          "404": { description: "User not found on GitHub" }
        }
      }
    },
    // Documents custom aggregation endpoint
    "/api/user/{username}/stats": {
      get: {
        summary: "Get calculated user statistics",
        description: "The server fetches all repositories and computes total stars and the primary language.",
        parameters: [
          { name: "username", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "Statistics generated successfully" }
        }
      }
    }
  }
};

/**
 * API Documentation Page.
 */
export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Navigation link to return to the main application */}
        <a href="/" className="inline-block text-blue-600 hover:underline mb-4 font-semibold">
          &larr; Wróć do aplikacji
        </a>

        {/* The interactive Swagger UI component using our OpenAPI spec */}
        <SwaggerUI spec={spec} />
      </div>
    </div>
  );
}