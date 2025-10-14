// import { USER_ROLE } from "@/contains/role";

// export type ResponseSuccessType = {
//   data: any;
//   meta?: TMeta;
// };

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
  id: string;
  title: string;
  description: string;
  technologies: string[];
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Tool' | 'Language' | 'AI'| string;
  githubClient?: string;
  githubServer?: string;
  liveUrl?: string;
  image: string;
  gallery?: string[];
  status?: 'Live' | 'In Development' | 'On Hold' | 'Completed' ;
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

export interface Blog {
  id: string;
  title: string;
  slug: string;
  coverImage?: string;
  tags?: string[];
  author: string;
  views?: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
