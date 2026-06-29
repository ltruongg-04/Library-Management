export interface Author {
  id: number;
  name: string;
  biography?: string;
}

export interface AuthorRequest {
  name: string;
  biography?: string;
}
