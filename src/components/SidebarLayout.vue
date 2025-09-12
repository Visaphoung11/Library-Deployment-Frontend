<template>
  <div class="min-h-screen flex w-full bg-white dark:bg-gray-900">
    <!-- Toggle Button (Hamburger Icon) -->
    <button
      @click="toggleSidebar"
      class="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors md:hidden"
      :class="{ 'left-68': isSidebarOpen }"
    >
      <i
        :class="isSidebarOpen ? 'fas fa-times' : 'fas fa-bars'"
        class="w-6 h-6"
      ></i>
    </button>

    <!-- Sidebar -->
    <div
      class="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out z-40"
      :class="{
        'translate-x-0': isSidebarOpen,
        '-translate-x-full': !isSidebarOpen,
      }"
    >
      <!-- Header -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
          Library System
        </h1>
      </div>

      <!-- Navigation -->
      <nav class="p-2">
        <div class="space-y-3">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-white transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 hover:shadow-md group"
            :class="{
              'bg-blue-100 dark:bg-blue-900': $route.path === item.path,
            }"
          >
            <i
              :class="item.icon"
              class="w-5 h-5 transition-transform group-hover:scale-110 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"
            ></i>
            <span
              class="font-medium transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400"
            >
              {{ t(item.label) }}
            </span>
          </router-link>
        </div>
      </nav>

      <!-- Footer (with Logout) -->
      <div
        class="absolute bottom-0 left-0 right-0 w-64 p-4 border-t border-gray-200 dark:border-gray-700 space-y-3 bg-white dark:bg-gray-800"
      >
        <div class="flex items-center justify-between">
          <button
            @click="toggleLanguage"
            class="px-3 py-1 text-sm border rounded hover:scale-105 transition-transform text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          >
            {{ language === "en" ? "ខ្មែរ" : "EN" }}
          </button>
          <!-- Uncomment if you want to re-enable theme toggle -->
          <!-- <button
              @click="toggleTheme"
              class="px-3 py-1 text-sm border rounded hover:scale-105 transition-transform text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            >
              {{ theme === "light" ? "🌙" : "☀️" }}
            </button> -->
        </div>

        <div class="text-xs text-gray-600 dark:text-gray-400">
          {{ t("nav.welcome") }}, {{ user?.username }} ({{ user?.role }})
        </div>

        <button
          @click="handleLogout"
          class="w-full px-3 py-2 text-sm border rounded hover:scale-105 transition-transform text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900"
        >
          {{ t("nav.logout") }}
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div
      class="flex-1 transition-all duration-300"
      :class="{ 'ml-64': isSidebarOpen && !isMobile }"
    >
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "../composables/useAuth";
import { useLanguage } from "../composables/useLanguage";
// import { useTheme } from "../composables/useTheme";

interface NavItem {
  path: string;
  label: string;
  icon: string; // Font Awesome class names
}

const router = useRouter();
const route = useRoute();
const { user, logout } = useAuth();
const { language, setLanguage, t } = useLanguage();
// const { theme, toggleTheme } = useTheme();

// Sidebar toggle state
const isSidebarOpen = ref(false);
const isMobile = computed(() => window.innerWidth < 768); // Tailwind's 'md' breakpoint

// Toggle sidebar function
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Update isMobile on window resize
const updateIsMobile = () => {
  isSidebarOpen.value = window.innerWidth >= 768; // Show sidebar by default on desktop
};
window.addEventListener("resize", updateIsMobile);
updateIsMobile(); // Initial check

// Navigation items with Font Awesome classes
const navItems: NavItem[] = [
  { path: "/dashboard", label: "nav.dashboard", icon: "fas fa-home" },
  { path: "/books", label: "nav.books", icon: "fas fa-book" },
  { path: "/students", label: "nav.students", icon: "fas fa-users" },
  { path: "/borrowing", label: "nav.borrowing", icon: "fas fa-exchange-alt" },
  // { path: "/category", label: "nav.category", icon: "fas fa-chart-bar" },
];

const toggleLanguage = (): void => {
  setLanguage(language.value === "en" ? "km" : "en");
};

const handleLogout = async (): Promise<void> => {
  if (confirm("Are you sure you want to logout?")) {
    logout();
    await router.push("/login");
  }
};
</script>
