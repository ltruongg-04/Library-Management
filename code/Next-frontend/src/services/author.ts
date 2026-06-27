import type { Author, AuthorRequest } from '@/types/author';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8081';

export const authorService = {
  getAllAuthors: async (): Promise<Author[]> => {
    const response = await fetch(`${API_URL}/api/admin/authors`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch authors');
    return response.json();
  },

  createAuthor: async (data: AuthorRequest): Promise<Author> => {
    const response = await fetch(`${API_URL}/api/admin/authors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create author');
    return response.json();
  },

  updateAuthor: async (id: number, data: AuthorRequest): Promise<Author> => {
    const response = await fetch(`${API_URL}/api/admin/authors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update author');
    return response.json();
  },

  deleteAuthor: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/api/admin/authors/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete author');
  }
};
