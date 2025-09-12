<template>
  <main class="flex-1 p-4 sm:p-8 bg-white min-h-screen mt-0">
    <!-- Header -->
    <h1
      class="text-2xl sm:text-3xl font-semibold text-gray-800 animate-fade-in"
    >
      Borrowing Management
    </h1>
    <p class="text-gray-500 mb-4 sm:mb-6">Manage book loans</p>

    <!-- Add Loan Button -->
    <div class="flex justify-between items-center mb-4">
      <h2
        class="text-lg sm:text-xl font-semibold text-gray-800 animate-fade-in"
      >
        Borrowed Books List
      </h2>
      <button
        @click="openAddModal"
        class="px-4 sm:px-5 py-1 sm:py-2 border border-blue-500 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors duration-300"
      >
        New
      </button>
    </div>

    <!-- Modal for Adding Loan -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
    >
      <div
        class="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg animate-form-slide"
      >
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Add New Loan</h3>
        <form @submit.prevent="handleBorrow">
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Student ID</label
              >
              <input
                v-model.number="newLoan.student_id"
                type="number"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-400 focus:border-blue-400 bg-white text-gray-800"
                @input="validateForm"
                placeholder="e.g., 1"
              />
              <p v-if="errors.student_id" class="text-red-500 text-xs mt-1">
                {{ errors.student_id }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Borrow Date</label
              >
              <input
                type="date"
                :value="new Date().toISOString().slice(0, 10)"
                readonly
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-800"
              />
            </div>

            <div class="relative">
              <label class="block text-sm font-medium text-gray-700"
                >Book Title</label
              >
              <input
                v-model="searchQuery"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-400 focus:border-blue-400 bg-white text-gray-800"
                placeholder="Search books...!"
                @input="searchBooks"
              />
              <p v-if="errors.book_id" class="text-red-500 text-xs mt-1">
                {{ errors.book_id }}
              </p>
              <!-- Search Results Dropdown -->
              <div
                v-if="searchResults.length && searchQuery"
                class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
              >
                <ul>
                  <li
                    v-for="book in searchResults"
                    :key="book.id"
                    class="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-800"
                    @click="selectBook(book)"
                  >
                    {{ book.title }} ({{ book.quantity }} available)
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="!isFormValid"
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300"
              :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }"
            >
              Borrow Book
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Borrowed Books Table -->
    <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
    <div v-if="!borrows.length && !error" class="text-gray-500 mb-4">
      Loading borrows...
    </div>
    <div v-else class="overflow-x-auto">
      <table class="min-w-full text-xs sm:text-sm">
        <thead>
          <tr class="bg-slate-800 text-white text-left">
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">No</th>
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              Student
            </th>
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              Book
            </th>
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              Borrow Date
            </th>
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              Status
            </th>
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              Add
            </th>
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(borrow, index) in borrows"
            :key="borrow.id"
            :class="[
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
              'animate-row-slide',
              'hover:bg-gray-100 transition-colors duration-200',
              clickedRow === index ? 'bg-blue-100' : '',
            ]"
            @click="handleRowClick(index)"
          >
            <td
              class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200 text-gray-800"
            >
              {{ index + 1 }}
            </td>
            <td
              class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200 text-gray-800"
            >
              {{ borrow.full_name }} ({{ borrow.id_card }})
            </td>
            <td
              class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200 text-gray-800"
            >
              {{ borrow.title }}
            </td>
            <td
              class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200 text-gray-800"
            >
              {{
                borrow.borrow_date
                  ? new Date(borrow.borrow_date).toLocaleDateString()
                  : "N/A"
              }}
            </td>
            <td class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              <span
                :class="{
                  'bg-green-100 text-green-800': !borrow.return_date,
                  'bg-gray-100 text-gray-800': borrow.return_date,
                }"
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ borrow.return_date ? "Returned" : "Borrowed" }}
              </span>
            </td>
            <td class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              <button
                @click.stop="openAddModal"
                class="bg-orange-400 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-orange-500 transition-colors duration-300"
              >
                Add
              </button>
            </td>
            <td class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              <button
                v-if="!borrow.return_date"
                @click.stop="returnBook(borrow.id)"
                class="bg-green-400 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-green-500 transition-colors duration-300"
              >
                Return
              </button>
              <button
                v-if="borrow.return_date"
                @click.stop="confirmDelete(borrow.id)"
                class="bg-red-400 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-red-500 transition-colors duration-300 ml-2"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-end mt-4 sm:mt-6 space-x-2 sm:space-x-3">
      <button
        v-for="page in totalPages"
        :key="page"
        :class="[
          'border px-3 sm:px-4 py-1 sm:py-2 rounded-lg transition-colors duration-300',
          currentPage === page
            ? 'bg-blue-500 text-white'
            : 'text-blue-600 border-blue-500 hover:bg-blue-50',
        ]"
        @click="fetchBorrows(page)"
      >
        {{ page }}
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";
import { withApiBase } from "../config/api";

interface Borrow {
  id: string;
  id_card: string;
  full_name: string;
  title: string;
  borrow_date: string;
  return_date: string | null;
  err: string | null;
}

interface NewLoan {
  student_id: number;
  book_id: number;
}

interface Book {
  id: number;
  title: string;
  quantity: number;
}

const toast = useToast();
const router = useRouter();
const { token, isAuthenticated } = useAuth();

const borrows = ref<Borrow[]>([]);
const newLoan = ref<NewLoan>({ student_id: 0, book_id: 0 });
const errors = ref<Partial<Record<keyof NewLoan, string>>>({
  student_id: "",
  book_id: "",
});
const showModal = ref(false);
const clickedRow = ref<number | null>(null);
const isFormValid = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const error = ref<string | null>(null);
const searchQuery = ref("");
const searchResults = ref<Book[]>([]);

let searchTimeout: number | null = null;

const validateForm = () => {
  errors.value = {
    student_id: newLoan.value.student_id > 0 ? "" : "Student ID is required",
    book_id: newLoan.value.book_id > 0 ? "" : "Please select a book",
  };
  isFormValid.value = Object.values(errors.value).every((error) => !error);
};

const searchBooks = async () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  if (!searchQuery.value) {
    searchResults.value = [];
    return;
  }

  searchTimeout = setTimeout(async () => {
    try {
      const response = await fetch(
        withApiBase(
          `/api/books/search?query=${encodeURIComponent(searchQuery.value)}`
        ),
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        error.value = "Session expired. Please log in again.";
        localStorage.removeItem("token");
        localStorage.removeItem("library_user");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      searchResults.value = data.filter((book: Book) => book.quantity > 0);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to search books: ${errorMessage}`);
    }
  }, 300);
};

const selectBook = (book: Book) => {
  newLoan.value.book_id = book.id;
  searchQuery.value = book.title;
  searchResults.value = [];
  validateForm();
};

const closeModal = () => {
  showModal.value = false;
  searchQuery.value = "";
  searchResults.value = [];
  newLoan.value = { student_id: 0, book_id: 0 };
  errors.value = { student_id: "", book_id: "" };
};

const fetchBorrows = async (page = 1) => {
  try {
    if (!isAuthenticated.value) {
      error.value = "Please log in to access borrows.";
      router.push("/login");
      return;
    }

    const response = await fetch(
      withApiBase(`/api/borrows?page=${page}&limit=10`),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
      }
    );

    if (response.status === 401) {
      error.value = "Session expired. Please log in again.";
      localStorage.removeItem("token");
      localStorage.removeItem("library_user");
      router.push("/login");
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    borrows.value = data.borrows;
    currentPage.value = data.currentPage;
    totalPages.value = data.totalPages;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    error.value = `Failed to fetch borrows: ${errorMessage}`;
    console.error(errorMessage);
  }
};

const handleBorrow = async () => {
  if (!isFormValid.value) return;

  try {
    // Prepare payload with current date
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    const payload = {
      ...newLoan.value,
      borrow_date: today,
    };

    const response = await fetch(withApiBase("/api/borrows"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      error.value = "Session expired. Please log in again.";
      localStorage.removeItem("token");
      localStorage.removeItem("library_user");
      router.push("/login");
      return;
    }

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `HTTP error! Status: ${response.status}`);
    }

    toast.success("Book borrowed successfully!");
    newLoan.value = { student_id: 0, book_id: 0 };
    showModal.value = false;
    searchQuery.value = "";
    searchResults.value = [];
    fetchBorrows(currentPage.value); // Refresh borrows
  } catch (err) {
    toast.error(
      `Failed to borrow book: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
    console.error(err);
  }
};

const returnBook = async (borrowId: string) => {
  try {
    const response = await fetch(
      withApiBase(`/api/borrows/${borrowId}/return`),
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 401) {
      error.value = "Session expired. Please log in again.";
      localStorage.removeItem("token");
      localStorage.removeItem("library_user");
      router.push("/login");
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    toast.success("Book returned successfully!");
    fetchBorrows(currentPage.value); // Refresh borrows
  } catch (err) {
    toast.error(
      `Failed to return book: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
    console.error(err);
  }
};

const confirmDelete = (borrowId: string) => {
  if (window.confirm("Are you sure you want to delete this borrow record?")) {
    deleteBorrow(borrowId);
  }
};

const deleteBorrow = async (borrowId: string) => {
  try {
    const response = await fetch(withApiBase(`/api/borrows/${borrowId}`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      error.value = "Session expired. Please log in again.";
      localStorage.removeItem("token");
      localStorage.removeItem("library_user");
      router.push("/login");
      return;
    }

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `HTTP error! Status: ${response.status}`);
    }

    toast.success("Borrow record deleted successfully!");
    fetchBorrows(currentPage.value); // Refresh borrows
  } catch (err) {
    toast.error(
      `Failed to delete borrow record: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
    console.error(err);
  }
};

const openAddModal = () => {
  newLoan.value = { student_id: 0, book_id: 0 };
  errors.value = { student_id: "", book_id: "" };
  isFormValid.value = false;
  showModal.value = true;
  searchQuery.value = "";
  searchResults.value = [];
};

const handleRowClick = (index: number) => {
  clickedRow.value = index;
  setTimeout(() => {
    clickedRow.value = null;
  }, 300);
};

onMounted(() => {
  fetchBorrows();
});
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}
.animate-form-slide {
  animation: slide-in 0.6s ease-out;
}
.animate-row-slide {
  animation: slide-in 0.4s ease-out;
}

table {
  width: 100%;
  table-layout: auto;
}

@media (max-width: 640px) {
  table {
    font-size: 0.75rem;
  }
  th,
  td {
    min-width: 80px;
  }
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
</style>
