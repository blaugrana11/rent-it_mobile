// src/lib/listings/useListings.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "../api/listings";

// Fonction pour obtenir le token (vous devrez adapter selon votre implémentation)
// Cette fonction devrait être synchronisée avec votre useAuth
let authToken: string | null = null;

// Fonction pour définir le token (à appeler depuis useAuth)
export function setAuthToken(token: string | null) {
  authToken = token;
}

// Fonction pour obtenir le token
export function getAuthToken() {
  return authToken;
}

export interface CreateListingData {
  formData: FormData; // On passe directement le FormData depuis React Native
}

export function useListings() {
  const client = useQueryClient();

  // Mutation pour créer une annonce
  const createListing = useMutation({
    mutationFn: async (data: CreateListingData) => {
      console.log("Creating listing...");
      
      const headers: Record<string, string> = {};
      
      // Si on a un token, l'ajouter aux headers
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const res = await fetch(`${API_BASE_URL}/api/listings`, {
        method: "POST",
        body: data.formData, // Utiliser directement le FormData
        credentials: "include", // Pour la compatibilité web
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
      // Invalider les queries liées aux annonces pour rafraîchir la liste
      client.invalidateQueries({ queryKey: ["listings"] });
    },
  });

  // Query pour récupérer les annonces (exemple)
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