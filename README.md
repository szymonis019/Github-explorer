# Github-explorer

A GitHub profile analyzer and explorer built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. This application allows users to search for GitHub profiles, analyze their statistics, and browse their activity through a clean, modern interface.

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **API Documentation:** Swagger UI / OpenAPI 3.0

## Prerequisites

To use this app, you will need a **GitHub Personal Access Token (PAT)** to avoid hitting API rate limits in .env file.

### Install dependencies

```bash
npm install
```

### Environment Setup:
Create a .env.local file in the root directory and add your GitHub token:

```bash
GITHUB_TOKEN=your_github_pat_token_here
```

### Run the development server:
Start the development server:

```bash
npm run dev
```

### Open your browser and go to:
```
http://localhost:3000/
```