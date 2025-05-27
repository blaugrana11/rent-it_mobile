import { API_BASE_URL, Listing } from "./listings"; // ou définis ici si besoin
import { useQuery } from "@tanstack/react-query";

export async function fetchListingById(id: string): Promise<Listing> {
  const res = await fetch(`${API_BASE_URL}/api/listings/${id}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Erreur lors de la récupération de l’annonce.");
  }

  return res.json();
}


export function useListingById(id: string) {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: () => fetchListingById(id),
    enabled: !!id,
  });
}