// path: src/lib/user/useAuth.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = "http://localhost:3000";

export function useAuth() {
  const client = useQueryClient();

  const user = useQuery({
    queryKey: ["getUser"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/me`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Non connecté");
      return res.json();
    },
  });

  const login = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      try {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        const res = await fetch(`${API_BASE_URL}/api/login`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!res.ok) {
          const error = await res.json().catch(() => ({}));
          throw new Error(error?.error || "Erreur lors de la connexion");
        }

        return res.json();
      } catch (err: any) {
        console.error("Erreur de connexion :", err);
        throw new Error(err.message || "Échec de la requête réseau");
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["getUser"] });
    },
  });

  const register = useMutation({
    mutationFn: async ({ email, password, pseudo }: { email: string; password: string; pseudo: string }) => {
      try {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("pseudo", pseudo);

        const res = await fetch(`${API_BASE_URL}/api/register`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!res.ok) {
          const error = await res.json().catch(() => ({}));
          throw new Error(error?.error || "Erreur lors de l'inscription");
        }

        return res.json();
      } catch (err: any) {
        console.error("Erreur d'inscription :", err);
        throw new Error(err.message || "Échec de la requête réseau");
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["getUser"] });
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Erreur lors de la déconnexion");
      }
      return res.json();
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["getUser"] });
    },
  });

  return {
    user,
    login,
    logout,
    register,
  };
}