export interface Loan {
  id: number;
  bookId: number;
  bookTitle: string;
  studentName: string;
  loanDate: string;     // viene como ISO string del backend
  returnDate?: string | null;
  status: string;       // "Active" | "Returned"
}

export interface CreateLoanDto {
  bookId: number;
  studentName: string;
}
