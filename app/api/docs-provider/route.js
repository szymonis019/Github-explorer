import { getApiDocs } from '@/lib/swagger';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/docs:
 *   get:
 *     summary: Get OpenAPI specification
 *     description: Returns the full Swagger/OpenAPI JSON schema for this API. Used by Swagger UI to render interactive documentation.
 *     operationId: getApiDocs
 *     tags:
 *       - Documentation
 *     responses:
 *       200:
 *         description: OpenAPI specification successfully generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: OpenAPI 3.0 specification document
 *               properties:
 *                 openapi:
 *                   type: string
 *                   example: "3.0.0"
 *                 info:
 *                   type: object
 *                 paths:
 *                   type: object
 *       500:
 *         description: Failed to generate API documentation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Failed to generate API documentation"
 */

export async function GET() {
  try {
    const spec = await getApiDocs();

    return NextResponse.json(spec, {
      headers: {
        'Cache-Control': 'public, max-age=300'
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate API documentation' },
      { status: 500 }
    );
  }
}