<template>
  <main class="flex-1 p-4 sm:p-8 bg-white min-h-screen mt-0">
    <!-- Header -->
    <h1
      class="text-2xl sm:text-3xl font-semibold text-gray-800 animate-fade-in"
    >
      {{ t("nav.students") }}
    </h1>
    <p class="text-gray-500 mb-4 sm:mb-6">
      {{ t("students.overview") }}
    </p>

    <!-- Add Student Button -->
    <div class="flex justify-between items-center mb-4">
      <h2
        class="text-lg sm:text-xl font-semibold text-gray-800 animate-fade-in"
      >
        {{ t("students.title") }}
      </h2>
      <button
        @click="openAddModal"
        class="px-4 sm:px-5 py-1 sm:py-2 border border-blue-500 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors duration-300"
      >
        New
      </button>
    </div>

    <!-- Modal for Adding/Editing Student -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
    >
      <div
        class="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg animate-form-slide"
      >
        <h3 class="text-lg font-semibold text-gray-800 mb-4">
          {{ editingStudent ? t("students.edit") : t("students.add") }}
        </h3>
        <form @submit.prevent="submitStudent">
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">{{
                t("students.fields.full_name")
              }}</label>
              <input
                v-model="newStudent.full_name"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-400 focus:border-blue-400 bg-white text-gray-800"
                @input="validateForm"
              />
              <p v-if="errors.full_name" class="text-red-500 text-xs mt-1">
                {{ errors.full_name }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">{{
                t("students.fields.id_card")
              }}</label>
              <input
                v-model="newStudent.id_card"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-400 focus:border-blue-400 bg-white text-gray-800"
                @input="validateForm"
              />
              <p v-if="errors.id_card" class="text-red-500 text-xs mt-1">
                {{ errors.id_card }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">{{
                t("students.fields.student_class")
              }}</label>

              <div class="flex gap-2">
                <select
                  v-model="newStudent.student_class"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-400 focus:border-blue-400 bg-white text-gray-800"
                  @change="validateForm"
                >
                  <option value="" disabled>{{ t("Select Class...!") }}</option>
                  <option value="wmad">WMAD</option>
                  <option value="sales">Sales</option>
                  <option value="accounting">Accounting</option>
                </select>
              </div>
              <p v-if="errors.student_class" class="text-red-500 text-xs mt-1">
                {{ errors.student_class }}
              </p>
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-300"
            >
              {{ t("students.cancel") }}
            </button>
            <button
              type="submit"
              :disabled="!isFormValid"
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300"
              :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }"
            >
              {{ editingStudent ? t("students.update") : t("students.add") }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Students Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full text-xs sm:text-sm">
        <thead>
          <tr class="bg-slate-800 text-white text-left">
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              {{ t("students.no") }}
            </th>
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              {{ t("students.name") }}
            </th>
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              {{ t("students.id") }}
            </th>
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              {{ t("students.fields.student_class") }}
            </th>
            <!-- <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              {{ t("students.fields.created_by") }}
            </th> -->
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              {{ t("students.edit") }}
            </th>
            <th class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              {{ t("students.delete") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(student, index) in students"
            :key="student.id"
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
              {{ student.full_name }}
            </td>
            <td
              class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200 text-gray-800"
            >
              {{ student.id_card }}
            </td>
            <td
              class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200 text-gray-800"
            >
              {{ student.student_class }}
            </td>
            <!-- <td
              class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200 text-gray-800"
            >
              {{ student.created_by }}
            </td> -->
            <td class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              <button
                @click.stop="openEditModal(index)"
                class="bg-blue-400 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-blue-500 transition-colors duration-300"
              >
                {{ t("students.edit") }}
              </button>
            </td>
            <td class="px-2 sm:px-6 py-2 sm:py-3 border border-gray-200">
              <button
                @click.stop="deleteStudent(student.id)"
                class="bg-red-400 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-red-500 transition-colors duration-300"
              >
                {{ t("students.delete") }}
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
        @click="fetchStudents(page)"
      >
        {{ page }}
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useLanguage } from "../composables/useLanguage";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";
import { withApiBase } from "../config/api";

interface Student {
  id: string;
  full_name: string;
  id_card: string;
  student_class: string;
  created_by: number;
}

const { t } = useLanguage();
const toast = useToast();
const router = useRouter();
const { isAuthenticated, user, token } = useAuth();

const API_URL = withApiBase("/api/students");

const students = ref<Student[]>([]);
const newStudent = ref<Partial<Student>>({
  full_name: "",
  id_card: "",
  student_class: "",
});
const errors = ref<
  Partial<Record<keyof Omit<Student, "id" | "created_by">, string>>
>({
  full_name: "",
  id_card: "",
  student_class: "",
});
const showModal = ref(false);
const clickedRow = ref<number | null>(null);
const editingStudent = ref<Student | null>(null);
const isFormValid = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);

// Validate form inputs
const validateForm = () => {
  errors.value = {
    full_name: newStudent.value.full_name
      ? ""
      : t("students.errors.full_name_required"),
    id_card: newStudent.value.id_card
      ? ""
      : t("students.errors.id_card_required"),
    student_class: newStudent.value.student_class
      ? ""
      : t("students.errors.student_class_required"),
  };
  isFormValid.value = Object.values(errors.value).every((error) => !error);
};

// Fetch students (GET)
const fetchStudents = async (page = 1) => {
  if (!isAuthenticated.value || !token.value) {
    toast.error(t("auth.login_required"));
    router.push("/login");
    return;
  }
  try {
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token.value}`,
    };
    console.log("fetchStudents - Headers:", headers); // Debug
    const response = await fetch(`${API_URL}?page=${page}&limit=10`, {
      method: "GET",
      headers,
    });
    console.log("TOKEN in fetchStudents:", token.value);
    console.log("fetchStudents - URL:", `${API_URL}?page=${page}&limit=10`); // Debug
    console.log("fetchStudents - Response Status:", response.status); // Debug
    console.log("fetchStudents - Response Headers:", response.headers); // Debug
    console.log("fetchStudents - Response URL:", response.url); // Debug
    // console.log()
    if (!response.ok) {
      const errorData = await response.json();
      console.log("fetchStudents - Error:", errorData); // Debug
      if (response.status === 401) {
        toast.error("Session expired, please log in again");
        router.push("/login");
      }
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }
    const data = await response.json();
    console.log("fetchStudents - Data:", data); // Debug
    students.value = data.students.map((student: any) => ({
      id: student.id.toString(),
      full_name: student.full_name,
      id_card: student.id_card,
      student_class: student.class, // Note: backend uses 'class', not 'student_class'
      // created_by: student.created_by,
    }));
    currentPage.value = data.currentPage;
    totalPages.value = data.totalPages;
  } catch (error) {
    console.error("Error fetching students:", error);
    toast.error(t("students.fetch_failed"));
  }
};

// Open modal for adding a new student
const openAddModal = () => {
  editingStudent.value = null;
  newStudent.value = { full_name: "", id_card: "", student_class: "" };
  errors.value = { full_name: "", id_card: "", student_class: "" };
  isFormValid.value = false;
  showModal.value = true;
};

// Open modal for editing a student
const openEditModal = (index: number) => {
  editingStudent.value = { ...students.value[index] };
  newStudent.value = {
    full_name: editingStudent.value.full_name,
    id_card: editingStudent.value.id_card,
    student_class: editingStudent.value.student_class,
  };
  validateForm();
  showModal.value = true;
};

// Submit student (POST or PUT)
const submitStudent = async () => {
  if (!isFormValid.value) return;
  if (!isAuthenticated.value || !token.value || !user.value) {
    toast.error(t("auth.login_required"));
    router.push("/login");
    return;
  }
  try {
    const payload = {
      full_name: newStudent.value.full_name,
      id_card: newStudent.value.id_card,
      student_class: newStudent.value.student_class,
      created_by: parseInt(user.value.id),
    };
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token.value}`,
      "Content-Type": "application/json",
    };
    console.log("submitStudent - Headers:", headers); // Debug
    console.log("submitStudent - Payload:", payload); // Debug
    const isEditing = !!editingStudent.value;
    const url = isEditing ? `${API_URL}/${editingStudent.value?.id}` : API_URL;
    const method = isEditing ? "PUT" : "POST";
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.log("submitStudent - Error:", errorData); // Debug
      if (response.status === 401) {
        toast.error("Session expired, please log in again");
        router.push("/login");
      }
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }
    const result = await response.json();
    toast.success(
      result.message || t(isEditing ? "students.updated" : "students.created")
    );
    await fetchStudents(currentPage.value);
    showModal.value = false;
    editingStudent.value = null;
    newStudent.value = { full_name: "", id_card: "", student_class: "" };
  } catch (error) {
    console.error("Error submitting student:", error);
    toast.error(
      t(
        editingStudent.value
          ? "students.update_failed"
          : "students.create_failed"
      )
    );
  }
};

// Delete student (DELETE)
const deleteStudent = async (studentId: string) => {
  if (!isAuthenticated.value || !token.value) {
    toast.error(t("auth.login_required"));
    router.push("/login");
    return;
  }
  if (!confirm(t("students.confirm_delete"))) return;
  try {
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token.value}`,
    };
    console.log("deleteStudent - Headers:", headers); // Debug
    const response = await fetch(`${API_URL}/${studentId}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.log("deleteStudent - Error:", errorData); // Debug
      if (response.status === 401) {
        toast.error("Session expired, please log in again");
        router.push("/login");
      }
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }
    const result = await response.json();
    toast.success(result.message || t("students.deleted"));
    await fetchStudents(currentPage.value);
  } catch (error) {
    console.error("Error deleting student:", error);
    toast.error(t("students.delete_failed"));
  }
};

// Handle row click for visual feedback
const handleRowClick = (index: number) => {
  clickedRow.value = index;
  setTimeout(() => {
    clickedRow.value = null;
  }, 300);
};

onMounted(() => fetchStudents());
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
