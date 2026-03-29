/* eslint-disable @typescript-eslint/no-explicit-any */
// import { USER_ROLE } from "@/contains/role";

export type ResponseSuccessType = {
  data: any;
  meta?: TMeta;
};

export type TMeta = {
  limit: number;
  page: number;
  total: number;
  // totalPage: number;
};

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};

export type IGenericErrorMessage = {
  path: string | number;
  message: string;
};

export interface TProject {
  _id?: string
  title: string;
  description: string;
  technologies: string[];
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Tool' | 'Language' | 'AI'| string;
  githubClient?: string;
  githubServer?: string;
  liveUrl?: string;
  image?: string;
  gallery?: string[];
  status?: 'Live' | 'In Development' | 'On Hold' | 'Completed' | string;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  icon?: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Tool' | 'Language' | 'AI' |string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' ;
  createdAt: string;
  updatedAt: string;
}

export interface TBlog {
  _id?: string;
  title: string;
  description: string;
  coverImage?: string;
  status?: 'Draft' | 'Published' | 'Archived' | string;
  author?: string;
  likes?: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface TSkill {
  _id?: string;
  name: string;
  level?: number; // 0 to 100
  category: string; // e.g. 'Frontend', 'Backend', 'Tools'
  image: string; // Icon image URL
  isSelect?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TReview {
  _id?: string;
  userName: string;
  userTitle?: string;
  rating: number; // 1 to 5
  comment: string;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
