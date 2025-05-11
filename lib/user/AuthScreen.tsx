import React, { useState } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "./login"; // Import from the same directory

export default function AuthScreen() {
  const { user, login, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user.isLoading) return <ActivityIndicator size="large" style={styles.loading} />;
  if (user.isError) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Veuillez vous connecter</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        {login.isError && (
          <Text style={styles.error}>{(login.error as Error)?.message}</Text>
        )}

        <Button
          title={login.isPending ? "Connexion..." : "Se connecter"}
          onPress={() => login.mutate({ email, password })}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue {user.data.username || user.data.email}</Text>
      <Button
        title={logout.isPending ? "Déconnexion..." : "Se déconnecter"}
        onPress={() => logout.mutate()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
