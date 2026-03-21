import { NextResponse } from 'next/server';
import { Repo } from '@/types/github';

/**
 * Statistics Aggregator Endpoint.
 * Fetches bulk data from GitHub (up to 100 repos) and performs data 
 * processing on the server to return a lightweight summary to the frontend.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const resolvedParams = await params;
  const username = resolvedParams.username;

  const headers: Record<string, string> = process.env.GITHUB_TOKEN 
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } 
    : {};

  // Fetching a large sample size (100 repos) to ensure statistically significant results
  const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers });

  if (!res.ok) {
    return NextResponse.json(
      { error: 'Nie udało się pobrać danych do statystyk' }, 
      { status: res.status }
    );
  }

  const repos: Repo[] = await res.json();

  /**
   * DATA AGGREGATION LOGIC (Server-Side)
   * We calculate metrics here to avoid sending the full 100-repo payload to the client,
   * significantly reducing bandwidth and improving mobile performance.
   */

  // Calculate the total number of stars across all fetched repositories
  const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
  
  // Count occurrences of each programming language
  const languages = repos.reduce((acc: Record<string, number>, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {});
  
  // Identify the most frequently used language
  const topLanguage = Object.entries(languages).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Brak';

  // Return a optimized, flat JSON object
  return NextResponse.json({
    username,
    totalStars,
    topLanguage,
    analyzedRepos: repos.length
  });
}