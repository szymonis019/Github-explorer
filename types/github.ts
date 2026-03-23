export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  created_at: string;
  followers: number;
  following: number;
  location: string;
  html_url: string;
}

export interface Repo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  language: string;
  html_url: string;
  size: number;
  forks_count: number;
  updated_at: string;
}

export interface GitHubFollower {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: {
    name: string;
    url: string;
  };
  payload: any;
}