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

  /**
   * Data Aggregation: Fetch profile and repos in parallel
   */
  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers }),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers })
  ]);

  // Error user handling
  if (userRes.status === 404) {
    return NextResponse.json(
      { error: `User ${username} not found on GitHub` }, 
      { status: 404 }
    );
  }

  // Handle errors in fetching repos
  if (!userRes.ok || !reposRes.ok) {
    return NextResponse.json(
      { error: 'Failed to fetch user data for clash' }, 
      { status: 500 }
    );
  }

  const user = await userRes.json();
  const repos: Repo[] = await reposRes.json();

  /**
   * Data Processing
   * Performing calculations on the server to keep the client light.
   */
  const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
  const totalForks = repos.reduce((acc, repo: any) => acc + (repo.forks_count || 0), 0);
  
  // Years active
  // Use the account creation date to calculate the Age Factor
  const currentYear = new Date().getFullYear();
  const joinYear = new Date(user.created_at).getFullYear();
  const yearsActive = (currentYear - joinYear) + 1; // Minimum 1 year

  /**
   * Power Level Calculation
   * Weighting different metrics to determine the Combat Power
   * Stars (50x) | Followers (20x) | Repos (10x) | Forks (30x)
   * Experience: 100pts bonus for every year the account has existed
   */
  const powerLevel = 
    (totalStars * 50) + 
    (user.followers * 20) + 
    (repos.length * 10) + 
    (totalForks * 30) + 
    (yearsActive * 100);

  // Sorting languages and picking the top one
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
    username: user.login,
    name: user.name || user.login,
    avatarUrl: user.avatar_url,
    totalStars,
    topLanguage,
    analyzedRepos: repos.length,
    powerLevel: Math.floor(powerLevel),
    yearsActive,
    followers: user.followers
  });
}