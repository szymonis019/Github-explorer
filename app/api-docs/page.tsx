'use client';

import { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

/**
 * OpenAPI 3.0 Specification.
 */
export default function ApiDocs() {
  const [spec, setSpec] = useState<any>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      const response = await fetch('/api/docs-provider');
      const data = await response.json();
      setSpec(data);
    };
    fetchDocs();
  }, []);

  if (!spec) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500 animate-pulse font-mono text-sm">Loading API Documentation...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <a href="/" className="inline-block text-blue-600 hover:underline mb-4 font-semibold">
          &larr; Back to App
        </a>

        <SwaggerUI spec={spec} />
      </div>
    </div>
  );
}