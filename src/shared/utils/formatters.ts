export function formatDate(dateString: string | null): string | null {
 if (!dateString) return null;
 const date = new Date(dateString);
 if (isNaN(date.getTime())) return null; // evita erro se não for uma data válida
 const day = String(date.getDate()).padStart(2, "0");
 const month = String(date.getMonth() + 1).padStart(2, "0");
 const year = date.getFullYear();
 return `${day}/${month}/${year}`;
}
