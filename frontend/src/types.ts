export interface Story {
  id: string;
  title: string;
  content: string;
  users?: { name: string };
  createdAt: string;
  tags?: string[];
  status: string;
}

export interface Journalist {
  id: string;
  name: string;
  email: string;
  outlet?: string;
  tags?: string[];
}

type Route =
  | 'landing'
  | 'dash'
  | 'chat'
  | 'admin'
  | 'journalist-signup'
  | 'story'
  | 'terms'
  | 'privacy'
  | 'help'
  | 'contact';

export type { Route };
