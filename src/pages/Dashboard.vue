<template>
  <main class="flex-1 p-4 sm:p-8 bg-white min-h-screen mt-0">
    <!-- Header -->
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 animate-fade-in">
      {{ t("dashboard.title") }}
    </h1>
    <p class="text-gray-800 mb-4 sm:mb-8">
      {{ t("dashboard.overdue") }}
    </p>

    <!-- Add Activity Button -->
    <div class="flex justify-between items-center mb-4">
      <h2
        class="text-lg sm:text-xl font-semibold text-gray-800 animate-fade-in"
      >
        Add New Activity
      </h2>
      <!-- <button
        @click="showModal = true"
        class="px-4 sm:px-5 py-1 sm:py-2 border border-blue-500 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors duration-300"
      >
        New
      </button> -->
    </div>

    <!-- Modal for Adding Activity -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
    >
      <div
        class="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg animate-form-slide"
      >
        <h3 class="text-lg font-semibold text-gray-800 mb-4">
          Add New Activity
        </h3>
        <form @submit.prevent="addActivity">
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Message</label
              >
              <input
                v-model="newActivity.message"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-400 focus:border-blue-400 bg-white text-gray-800"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Time</label
              >
              <input
                v-model="newActivity.time"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-400 focus:border-blue-400 bg-white text-gray-800"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Icon</label
              >
              <input
                v-model="newActivity.icon"
                required
                placeholder="e.g., fas fa-book"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-400 focus:border-blue-400 bg-white text-gray-800"
              />
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300"
            >
              Add Activity
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Stats Cards -->
    <div
      v-if="dashboardData"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      <div
        class="relative bg-amber-500 rounded-lg shadow-lg p-4 flex items-center space-x-3 transform hover:scale-105 transition-transform duration-300"
      >
        <i class="fas fa-book text-2xl text-white"></i>
        <div class="relative text-white">
          <h3 class="text-md font-semibold">Total Books</h3>
          <p class="text-xl font-bold">{{ dashboardData.total_books }}</p>
        </div>
      </div>

      <div
        class="relative bg-rose-500 rounded-lg shadow-lg p-4 flex items-center space-x-3 transform hover:scale-105 transition-transform duration-300"
      >
        <i class="fas fa-users text-2xl text-white"></i>
        <div class="relative text-white">
          <h3 class="text-md font-semibold">Total Students</h3>
          <p class="text-xl font-bold">{{ dashboardData.total_students }}</p>
        </div>
      </div>

      <div
        class="relative bg-lime-500 rounded-lg shadow-lg p-4 flex items-center space-x-3 transform hover:scale-105 transition-transform duration-300"
      >
        <i class="fas fa-exchange-alt text-2xl text-white"></i>
        <div class="relative text-white">
          <h3 class="text-md font-semibold">Total Borrows</h3>
          <p class="text-xl font-bold">{{ dashboardData.total_borrows }}</p>
        </div>
      </div>

      <div
        class="relative bg-blue-500 rounded-lg shadow-lg p-4 flex items-center space-x-3 transform hover:scale-105 transition-transform duration-300"
      >
        <i class="fas fa-undo text-2xl text-white"></i>
        <div class="relative text-white">
          <h3 class="text-md font-semibold">Books Returned</h3>
          <p class="text-xl font-bold">{{ dashboardData.returned }}</p>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="text-red-500 mb-4">
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="!dashboardData && !error" class="text-gray-500 mb-4">
      Loading dashboard data...
    </div>

    <!-- Recent Activity Feed -->
    <div>
      <h2
        class="text-lg sm:text-xl font-semibold text-gray-800 animate-fade-in mb-4"
      >
        Recent Activity
      </h2>
      <div
        class="bg-white rounded-lg shadow p-6 border border-gray-200 max-h-80 overflow-y-auto"
      >
        <div
          v-for="(activity, index) in activities"
          :key="index"
          :class="[
            'flex items-start space-x-3 py-3 border-b border-gray-200 last:border-b-0 animate-fade-in',
            'hover:bg-gray-100 transition-colors duration-200',
            clickedActivity === index ? 'bg-blue-100' : '',
          ]"
          :style="{ animationDelay: `${index * 100}ms` }"
          @click="handleActivityClick(index)"
        >
          <i :class="activity.icon" class="text-xl text-blue-500"></i>
          <div>
            <p class="text-sm text-gray-800">{{ activity.message }}</p>
            <p class="text-xs text-gray-500">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useLanguage } from "../composables/useLanguage";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth"; // Import useAuth
import { withApiBase } from "../config/api";

const { t } = useLanguage();
const router = useRouter();
const { token, isAuthenticated } = useAuth(); // Access token and auth state

// Modal state
const showModal = ref(false);
const clickedActivity = ref<number | null>(null);

// New activity form
const newActivity = ref<{
  message: string;
  time: string;
  icon: string;
}>({
  message: "",
  time: "",
  icon: "",
});

// Sample activity feed data
const activities = ref([
  { icon: "fas fa-book", message: "John borrowed '1984'", time: "2 hours ago" },
  {
    icon: "fas fa-undo",
    message: "Jane returned 'The Great Gatsby'",
    time: "4 hours ago",
  },
  {
    icon: "fas fa-user-plus",
    message: "New student Kevin registered",
    time: "1 day ago",
  },
  {
    icon: "fas fa-book",
    message: "Sarah borrowed 'To Kill a Mockingbird'",
    time: "2 days ago",
  },
]);

// API data state
const dashboardData = ref<{
  total_books: number;
  total_students: number;
  total_borrows: number;
  borrowed_not_returned: number;
  returned: number;
} | null>(null);
const error = ref<string | null>(null);

// Fetch dashboard data
const fetchDashboardData = async () => {
  try {
    if (!isAuthenticated.value) {
      error.value = "Please log in to access the dashboard.";
      router.push("/login");
      return;
    }

    const response = await fetch(withApiBase("/api/dashboard"), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.value}`, // Use token from useAuth
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
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    dashboardData.value = data;
  } catch (err) {
    error.value = `Failed to fetch dashboard data: ${
      err instanceof Error ? err.message : String(err)
    }`;
    console.error(err);
  }
};

const addActivity = () => {
  activities.value.unshift({ ...newActivity.value });
  newActivity.value = { message: "", time: "", icon: "" };
  showModal.value = false;
};

// Handle activity click
const handleActivityClick = (index: number) => {
  clickedActivity.value = index;
  setTimeout(() => {
    clickedActivity.value = null;
  }, 300);
};

// Clean up charts on unmount
onUnmounted(() => {});

// Fetch data and initialize charts on mount
onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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
  animation: fade-in 0.6s ease-out forwards;
}

.animate-form-slide {
  animation: slide-in 0.6s ease-out;
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
</style>
