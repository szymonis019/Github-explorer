import { NextResponse } from 'next/server';

/**
 * API Route Handler: Proxy for GitHub User Profile.
 * This route implements the BFF (Backend For Frontend) pattern. 
 * It allows the client to fetch data without exposing the GITHUB_TOKEN to the browser.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  // Awaiting dynamic route parameters as required by Next.js 15
  const resolvedParams = await params;
  const username = resolvedParams.username;

  /**
   * Securely injecting the GitHub PAT (Personal Access Token) from environment variables.
   * Defined as Record<string, string> to satisfy TypeScript's strict type checking for fetch headers.
   */
  const headers: Record<string, string> = process.env.GITHUB_TOKEN 
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } 
    : {};

  // Server-side fetch to GitHub's REST API
  const res = await fetch(`https://api.github.com/users/${username}`, { headers });

  // Error handling: Forwarding GitHub's status code and providing a localized message
  if (!res.ok) {
    return NextResponse.json(
      { error: 'Nie znaleziono użytkownika na GitHubie' }, 
      { status: res.status }
    );
  }

  const data = await res.json();
  
  // Returning the clean JSON response to our client-side components
  return NextResponse.json(data);
}