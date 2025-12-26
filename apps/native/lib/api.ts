import { supabase } from "./supabase";

// API base URL - should be set via environment variable
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (__DEV__ ? "http://localhost:3002" : "https://your-production-api.com");

interface ApiError {
  message: string;
  statusCode?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        return null;
      }
      // API now accepts Supabase JWT tokens directly
      return session.access_token;
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const url = `${this.baseUrl}${endpoint}`;
    
    // Debug logging in development
    if (__DEV__) {
      console.log(`[API] ${options.method || 'GET'} ${url}`);
      if (token) {
        console.log('[API] Using authentication token');
      } else {
        console.warn('[API] No authentication token available');
      }
    }
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          // Include status code in error message for debugging
          if (response.status === 401) {
            errorMessage = "Authentication failed. Please log in again.";
          } else if (response.status === 403) {
            errorMessage = "You don't have permission to perform this action.";
          } else if (response.status === 404) {
            errorMessage = "API endpoint not found. Check API URL configuration.";
          } else if (response.status >= 500) {
            errorMessage = "Server error. Please try again later.";
          }
        } catch {
          // If response is not JSON, use status-based message
          if (response.status === 401) {
            errorMessage = "Authentication failed. Please log in again.";
          } else if (response.status === 404) {
            errorMessage = "API endpoint not found. Check API URL configuration.";
          }
        }
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        throw error;
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return undefined as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        // Check for network errors
        if (
          error.message.includes("fetch") ||
          error.message.includes("Network") ||
          error.message.includes("Failed to fetch") ||
          error.name === "TypeError"
        ) {
          const apiUrl = this.baseUrl;
          throw new Error(
            `Network request failed. Please check:\n\n` +
            `1. API server is running (should be at ${apiUrl})\n` +
            `2. API URL is correct (current: ${apiUrl})\n` +
            `3. For physical devices, use your computer's IP instead of localhost\n` +
            `4. For Android emulator, use http://10.0.2.2:3002\n` +
            `5. Check firewall settings\n\n` +
            `To fix: Set EXPO_PUBLIC_API_URL in your .env file`
          );
        }
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Game-related API calls
export interface CreateGameRequest {
  groupId?: string;
  filters?: {
    cuisine?: string;
    priceRange?: string;
    minRating?: string;
    dietaryRestrictions?: string[];
  };
  mapArea?: {
    type: "Polygon";
    coordinates: [[number, number][]];
  };
}

export interface GameResponse {
  id: string;
  status: string;
  owner: {
    id: string;
    email: string;
    name?: string;
  };
  group?: {
    id: string;
    name: string;
  };
  searchCount: number;
  createdAt: string;
  updatedAt: string;
}

export const gamesApi = {
  create: async (data: CreateGameRequest): Promise<GameResponse> => {
    return apiClient.post<GameResponse>("/games", data);
  },
  
  getAll: async (): Promise<GameResponse[]> => {
    return apiClient.get<GameResponse[]>("/games");
  },
  
  getById: async (id: string): Promise<GameResponse> => {
    return apiClient.get<GameResponse>(`/games/${id}`);
  },
};

