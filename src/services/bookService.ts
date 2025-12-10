import api from "./api";
import type { Book, CreateBookDto } from "../types/book";

export const bookService = {
  async getAll(): Promise<Book[]> {
    const { data } = await api.get<Book[]>("/books");
    return data;
  },

  async getById(id: number): Promise<Book> {
    const { data } = await api.get<Book>(`/books/${id}`);
    return data;
  },

  async create(dto: CreateBookDto): Promise<Book> {
    const { data } = await api.post<Book>("/books", dto);
    return data;
  },

  async update(id: number, dto: CreateBookDto): Promise<Book> {
    const { data } = await api.put<Book>(`/books/${id}`, dto);
    return data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/books/${id}`);
  },
};
