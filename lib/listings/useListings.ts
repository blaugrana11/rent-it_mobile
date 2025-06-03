// src/lib/listings/useListings.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "../api/listings";

let authToken: string | null = null;


export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken() {
  return authToken;
}

export interface CreateListingData {
  formData: FormData; 
}

export function useListings() {
  const client = useQueryClient();


  const createListing = useMutation({
    mutationFn: async (data: CreateListingData) => {
      console.log("Creating listing...");
      
      const headers: Record<string, string> = {};
      

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const res = await fetch(`${API_BASE_URL}/api/listings`, {
        method: "POST",
        body: data.formData,
        credentials: "include", 
        headers,
      });

      console.log("Create listing response status:", res.status);
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error?.error || "Erreur lors de la création de l'annonce");
      }

      const result = await res.json();
      console.log("Listing created:", result);
      return result;
    },
    onSuccess: () => {

      client.invalidateQueries({ queryKey: ["listings"] });
    },
  });


  const listings = useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      console.log("Fetching listings...");
      
      const headers: Record<string, string> = {};
      
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const res = await fetch(`${API_BASE_URL}/api/listings`, {
        credentials: "include",
        headers,
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la récupération des annonces");
      }

      return res.json();
    },
  });

  return {
    createListing,
    listings,
  };
}