<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
  >
    <div
      class="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
    >
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Library Management System
        </h1>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label
            for="username"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Username</label
          >
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter username"
          />
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Password</label
          >
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter password"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {{ isLoading ? "Logging in..." : "Login" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";

const router = useRouter();
const { login } = useAuth();

const username = ref<string>("");
const password = ref<string>("");
const isLoading = ref<boolean>(false);

const handleSubmit = async (): Promise<void> => {
  isLoading.value = true;

  try {
    const success = await login(username.value, password.value);

    if (success) {
      alert("Login successful! Welcome to the Library Management System");
      await router.push("/dashboard");
    } else {
      alert("Invalid username or password");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("An error occurred during login");
  } finally {
    isLoading.value = false;
  }
};
</script>