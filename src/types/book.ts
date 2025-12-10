export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  stock: number;
}

export interface CreateBookDto {
  title: string;
  author: string;
  isbn: string;
  stock: number;
}
