// path: src/lib/user/useAuth.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const client = useQueryClient();

  // Requête pour récupérer l'utilisateur actuel (ex: /me)
  const user = useQuery({
    queryKey: ["getUser"],
    queryFn: async () => {
      const res = await fetch("http://192.168.0.252:3000/api/me", {
        credentials: "include", // pour envoyer les cookies de session
      });
      if (!res.ok) throw new Error("Non connecté");
      return res.json(); // retourne l'utilisateur (ex: { email, pseudo })
    },
  });

  // Mutation de login
  const login = useMutation({
  mutationFn: async ({ email, password }: { email: string; password: string }) => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const res = await fetch("http://192.168.0.252:3000/api/login", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({})); // éviter un crash si pas de JSON
        throw new Error(error?.error || "Erreur lors de la connexion");
      }

      return res.json(); // peut contenir des infos utiles
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

        const res = await fetch("http://192.168.0.252:3000/api/register", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!res.ok) {
          const error = await res.json().catch(() => ({}));
          throw new Error(error?.error || "Erreur lors de l'inscription");
        }
        console.log("Inscription réussie :", res);
        return res.json(); // { success: true, email, pseudo }
      } catch (err: any) {
        console.error("Erreur d'inscription :", err);
        throw new Error(err.message || "Échec de la requête réseau");
      }
    },
    onSuccess: () => {
      // Optionnel : tu peux automatiquement récupérer le user après inscription
      client.invalidateQueries({ queryKey: ["getUser"] });
      console.log("Inscription réussie !");
    },
  });



  const logout = useMutation({
    mutationFn: async () => {
      const res = await fetch("http://192.168.0.252:3000/api/logout", {
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
    logout,
    register
  };
}