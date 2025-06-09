// lib/api/listings.ts
import { useQuery } from "@tanstack/react-query";
export const API_BASE_URL = "http://192.168.0.166:3000"; //http://192.168.0.252:3000 "http://localhost:3000"  ou ton IP locale ou URL de prod

export type Listing = {
  _id: string;
  title: string;
  description: string;
  price: number;
  condition?: string;
  images?: string[];
};


export type ListingSearchParams = {
  query?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
};

export async function fetchListings(params?: ListingSearchParams): Promise<Listing[]> {
  const url = new URL(`${API_BASE_URL}/api/listings`);


  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });
  }
  
  const res = await fetch(url.toString(), {
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.error || "Erreur lors du chargement des annonces");
  }

  return res.json();
}

export function useListings(params?: ListingSearchParams) {
  return useQuery({
    queryKey: ["listings", params],
    queryFn: () => fetchListings(params),
    staleTime: 1000 * 60 * 5, // Cache pendant 5 min
  });
}