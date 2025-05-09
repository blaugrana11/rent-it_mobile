import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const client = useQueryClient();

  // Requête pour récupérer l'utilisateur actuel (ex: /me)
  const user = useQuery({
    queryKey: ["getUser"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/api/me", {
        credentials: "include", // pour envoyer les cookies de session
      });
      if (!res.ok) throw new Error("Non connecté");
      return res.json(); // retourne l'utilisateur (ex: { email, username })
    },
  });

  // Mutation de login
  const login = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        body: formData,
        credentials: "include", 
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || "Erreur lors de la connexion");
      }

      return res.json(); // peut contenir des infos utiles
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["getUser"] }); // rafraîchir les données utilisateur
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      const res = await fetch("http://localhost:3000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Erreur lors de la déconnexion");
      }
      return res.json(); // ou return true si votre API ne retourne rien
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["getUser"] }); // rafraîchir les données utilisateur
    },
  });

  return {
    user,
    login,
    logout
  };
}