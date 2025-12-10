import api from "./api";
import type { Loan, CreateLoanDto } from "../types/loan";

export const loanService = {
  async getActive(): Promise<Loan[]> {
    const { data } = await api.get<Loan[]>("/loans/active");
    return data;
  },

  async create(dto: CreateLoanDto): Promise<Loan> {
    const { data } = await api.post<Loan>("/loans", dto);
    return data;
  },

  async returnLoan(id: number): Promise<Loan> {
    const { data } = await api.post<Loan>(`/loans/${id}/return`);
    return data;
  },
};
