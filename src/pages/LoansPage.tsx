import { useState, useEffect } from "react";
import { loanService } from "../services/loanService";
import { bookService } from "../services/bookService";
import type { Loan } from "../types/loan";
import type { Book } from "../types/book";
import Message from "../components/Message";

const LoansPage = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "";
    text: string;
  }>({ type: "", text: "" });

  const [formData, setFormData] = useState<{ bookId: number; studentName: string }>({
    bookId: 0,
    studentName: "",
  });

  useEffect(() => {
    loadLoans();
    loadBooks();
  }, []);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const loadLoans = async () => {
    try {
      const data = await loanService.getActive();
      setLoans(data);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Error al cargar préstamos";
      showMessage("error", msg);
    }
  };

  const loadBooks = async () => {
    try {
      const data = await bookService.getAll();
      setBooks(data);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Error al cargar libros";
      showMessage("error", msg);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "bookId" ? Number(value) : value,
    }));
  };

  const clearForm = () => {
    setFormData({ bookId: 0, studentName: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loanService.create({
        bookId: formData.bookId,
        studentName: formData.studentName.trim(),
      });

      showMessage("success", "Préstamo registrado");
      clearForm();
      await loadLoans();
      await loadBooks(); // para reflejar el nuevo stock
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Error al registrar préstamo";
      showMessage("error", msg);
    }
  };

  const handleReturn = async (id: number) => {
    if (!confirm("¿Devolver este préstamo?")) return;
    try {
      await loanService.returnLoan(id);
      showMessage("success", "Préstamo devuelto");
      await loadLoans();
      await loadBooks();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Error al devolver préstamo";
      showMessage("error", msg);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("es-ES", {
      dateStyle: "short",
      timeStyle: "short",
    });

  return (
    <div className="page">
      <h1>Préstamos</h1>

      <Message type={message.type} text={message.text} />

      <div className="form-section">
        <h3>Nuevo Préstamo</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Libro</label>
              <select
                name="bookId"
                value={formData.bookId}
                onChange={handleChange}
                required
              >
                <option value={0}>Seleccionar...</option>
                {books.map((book) => (
                  <option
                    key={book.id}
                    value={book.id}
                    disabled={book.stock <= 0}
                  >
                    {book.title} — {book.author}{" "}
                    {book.stock <= 0 ? "(Sin stock)" : `(Stock: ${book.stock})`}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Estudiante</label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="Nombre del estudiante"
                required
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={clearForm}
            >
              Limpiar
            </button>
          </div>
        </form>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Libro</th>
            <th>Estudiante</th>
            <th>Fecha Préstamo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id}>
              <td>{loan.id}</td>
              <td>{loan.bookTitle}</td>
              <td>{loan.studentName}</td>
              <td>{formatDate(loan.loanDate)}</td>
              <td>{loan.status}</td>
              <td className="actions">
                {loan.status === "Active" && (
                  <button
                    className="btn btn-warning btn-small"
                    onClick={() => handleReturn(loan.id)}
                  >
                    Devolver
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loans.length === 0 && (
        <p className="empty-message">No hay préstamos activos</p>
      )}
    </div>
  );
};

export default LoansPage;
