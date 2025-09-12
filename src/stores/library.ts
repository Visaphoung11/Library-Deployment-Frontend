// import { defineStore } from "pinia";
// import { ref } from "vue";

// interface Student {
//   id: string;
//   name: string;
//   id_card: string;
//   contact_number: string;
//   registration_date: string;
// }

// interface Book {
//   id: string;
//   title: string;
//   author: string;
//   category: string;
//   available: boolean;
// }

// export const useLibraryStore = defineStore("library", () => {
//   const students = ref<Student[]>([
//     {
//       id: "22345-1",
//       name: "Kevin",
//       id_card: "STU001",
//       contact_number: "0963559607",
//       registration_date: "2025-01-15",
//     },
//     {
//       id: "5151-7",
//       name: "Zeru",
//       id_card: "STU002",
//       contact_number: "0886886775",
//       registration_date: "2025-02-10",
//     },
//     {
//       id: "5566-2",
//       name: "Chang",
//       id_card: "STU003",
//       contact_number: "0123456789",
//       registration_date: "2025-03-05",
//     },
//     {
//       id: "7788-9",
//       name: "Than",
//       id_card: "STU004",
//       contact_number: "0987654321",
//       registration_date: "2025-04-20",
//     },
//   ]);

//   const books = ref<Book[]>([
//     {
//       id: "B001",
//       title: "Book A",
//       author: "Author A",
//       category: "Fiction",
//       available: true,
//     },
//     {
//       id: "B002",
//       title: "Book B",
//       author: "Author B",
//       category: "Non-Fiction",
//       available: true,
//     },
//     {
//       id: "B003",
//       title: "Book C",
//       author: "Author C",
//       category: "Science",
//       available: true,
//     },
//   ]);

//   const setBookAvailability = (bookId: string, available: boolean) => {
//     const book = books.value.find((b) => b.id === bookId);
//     if (book) book.available = available;
//   };

//   return { students, books, setBookAvailability };
// });
