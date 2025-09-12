import { ref, computed, type Ref, type ComputedRef } from "vue";
import type { User } from "../types";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode as named import
import { withApiBase } from "../config/api";

// Define interface for JWT payload (adjust based on your token structure)
interface JwtPayload {
  exp: number; // Expiration time in seconds
  [key: string]: any; // Other potential fields in the token
}

const user: Ref<User | null> = ref(null);
const isAuthenticated: ComputedRef<boolean> = computed(() => !!user.value);
const token = ref(localStorage.getItem("token") || "");

export function useAuth() {
  // Function to check if token is expired
  const isTokenExpired = (token: string): boolean => {
    if (!token) return true; // No token means expired/invalid
    try {
      const decoded: JwtPayload = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
      return decoded.exp < currentTime; // True if token is expired
    } catch (error) {
      console.error("Error decoding token:", error);
      return true; // Treat invalid tokens as expired
    }
  };

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await axios.post(withApiBase("/api/auth/login"), {
        username,
        password,
      });

      const { token: newToken, user: userData } = response.data;
      console.log("Login response:", response.data);

      // Ensure userData matches the User type
      const formattedUser: User = {
        id: userData.id,
        full_name: userData.full_name,
        username: userData.username,
        role: userData.role,
      };

      // Store token and user data
      localStorage.setItem("library_user", JSON.stringify(formattedUser));
      localStorage.setItem("token", newToken);
      user.value = formattedUser;
      token.value = newToken; // Update reactive token

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = (): void => {
    user.value = null;
    token.value = "";
    localStorage.removeItem("library_user");
    localStorage.removeItem("token");
    console.log("Logged out due to token expiration or manual logout");
  };

  const checkAuth = (): void => {
    const savedUser = localStorage.getItem("library_user");
    const savedToken = localStorage.getItem("token");

    // Check if token exists and is not expired
    if (savedToken && !isTokenExpired(savedToken)) {
      try {
        user.value = savedUser ? (JSON.parse(savedUser) as User) : null;
        token.value = savedToken;
      } catch (error) {
        console.error("Error parsing saved user:", error);
        logout(); // Clear invalid data
      }
    } else {
      logout(); // Log out if token is expired or missing
    }
  };

  // Run checkAuth on initialization
  if (!user.value) {
    checkAuth();
  }

  return {
    user: computed(() => user.value),
    isAuthenticated,
    login,
    logout,
    checkAuth,
    token: computed(() => token.value),
  };
}
