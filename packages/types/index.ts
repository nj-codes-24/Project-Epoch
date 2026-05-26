// packages/types/index.ts

export type Role = 'user' | 'admin';

export interface Profile {
  id: string; // uuid
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  skills: string[] | null;
  github_username: string | null;
  role: Role;
  created_at: string;
  updated_at: string;
}

export type Category = 
  | 'Artificial Intelligence' 
  | 'Machine Learning' 
  | 'Data Science' 
  | 'Web Development' 
  | 'Mobile Development' 
  | 'Cybersecurity' 
  | 'Blockchain & Web3' 
  | 'Computer Vision' 
  | 'Natural Language Processing' 
  | 'Robotics & Hardware';

export interface Paper {
  id: string; // uuid
  arxiv_id: string | null;
  semantic_id: string | null;
  title: string;
  plain_title: string | null;
  summary: string | null;
  why_it_matters: string | null;
  category: Category;
  topic_tags: string[] | null;
  citation_count: number;
  published_at: string | null;
  processed_at: string;
  is_active: boolean;
}

export interface Tool {
  id: string; // uuid
  paper_id: string | null;
  github_url: string;
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  last_commit_at: string | null;
  is_deprecated: boolean;
  updated_at: string;
}

export interface UserSeenPaper {
  user_id: string;
  paper_id: string;
  seen_at: string;
}

export interface SavedPaper {
  user_id: string;
  paper_id: string;
  saved_at: string;
}

export interface SavedTool {
  user_id: string;
  tool_id: string;
  saved_at: string;
}
