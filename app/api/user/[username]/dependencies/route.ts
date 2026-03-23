import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/user/{username}/dependencies:
 *   get:
 *     summary: Fetch project dependencies from the latest repository
 *     operationId: getUserDependencies
 *     tags:
 *       - Analysis
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched dependencies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - repoName
 *                 - type
 *                 - dependencies
 *               properties:
 *                 repoName:
 *                   type: string
 *                 type:
 *                   type: string
 *                 dependencies:
 *                   type: array
 *                   items:
 *                     type: string
 *               example:
 *                 repoName: "project-123"
 *                 type: "Node.js (package.json)"
 *                 dependencies:
 *                   - react
 *                   - next
 *                   - axios
 *       404:
 *         description: User or repository not found
 *       500:
 *         description: Internal server error
 */

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const headers: Record<string, string> = process.env.GITHUB_TOKEN 
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } 
    : {};

  // Fetch the most recent repository
  const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=1`, { headers });
  const repos = await reposRes.json();

  if (!repos?.length) return NextResponse.json({ dependencies: [] });

  const lastRepo = repos[0].name;
  const branch = repos[0].default_branch || 'main';

  /**
   * GitHub Trees API scaning
   * Fetching the list of all files in the repository to locate dependency manifests.
   */
  const treeRes = await fetch(
    `https://api.github.com/repos/${username}/${lastRepo}/git/trees/${branch}?recursive=1`,
    { headers }
  );
  const treeData = await treeRes.json();
  const files = treeData.tree || [];

  // Searching for paths to key manifest files
  const pkgFile = files.find((f: any) => f.path.endsWith('package.json'));
  const reqFile = files.find((f: any) => f.path.toLowerCase().endsWith('requirements.txt'));

  const rawBase = `https://raw.githubusercontent.com/${username}/${lastRepo}/${branch}`;

  /**
   * Fetching logic
   */
  // Node.js
  if (pkgFile) {
    const res = await fetch(`${rawBase}/${pkgFile.path}`);
    if (res.ok) {
      const pkg = await res.json();
      const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
      return NextResponse.json({ 
        repoName: lastRepo, 
        type: `Node.js (${pkgFile.path})`, 
        dependencies: deps.slice(0, 15) 
      });
    }
  }

  // Python
  if (reqFile) {
    const res = await fetch(`${rawBase}/${reqFile.path}`);
    if (res.ok) {
      const text = await res.text();
      const deps = text.split('\n')
        .map(line => {
          // Extract library name (==, >=)
          const match = line.match(/^([a-zA-Z0-9\-_]+)/);
          return match ? match[1] : null;
        })
        .filter(name => name && name.length > 1 && name !== 'python');

      return NextResponse.json({ 
        repoName: lastRepo, 
        type: `Python (${reqFile.path})`, 
        dependencies: Array.from(new Set(deps)) 
      });
    }
  }

  // Fallback: GitHub's detected languages
  const langRes = await fetch(`https://api.github.com/repos/${username}/${lastRepo}/languages`, { headers });
  const languages = await langRes.json();
  return NextResponse.json({ 
    repoName: lastRepo, 
    type: 'Languages', 
    dependencies: Object.keys(languages) 
  });
}
