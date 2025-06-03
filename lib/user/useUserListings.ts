// src/lib/user/useUserListings.ts
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "../api/listings";

let authToken: string | null = null;


export function setUserListingsAuthToken(token: string | null) {
  authToken = token;
}

export function useUserListings(userId: string) {
  return useQuery({
    queryKey: ["getUserListings", userId],
    queryFn: async () => {
      console.log(`Fetching listings for user ${userId}...`);
      
      const headers: Record<string, string> = {};
      
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      const res = await fetch(`${API_BASE_URL}/api/profile/${userId}`, {
        method: "GET",
        headers,
        credentials: "include",
      });
      
      console.log("Response status:", res.status);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error || "Erreur lors de la récupération des annonces");
      }
      
      const data = await res.json();
      console.log(`Received ${data.listings?.length || 0} listings for user ${userId}`);
      
      return data;
    },
    enabled: !!userId && !!authToken, 
  });
}