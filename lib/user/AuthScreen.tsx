import React, { useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "./useAuth";
import { useRouter } from "expo-router";

export default function AuthScreen() {
  const { user, login, logout } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user.isLoading)
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (user.isError || !user.data) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Veuillez vous connecter</Text>

        {login.isError && (
          <Text style={styles.error}>
            {(login.error as Error)?.message}
          </Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />

        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />

        <Button
          title="Se connecter"
          onPress={() => login.mutate({ email, password })}
        />

        <TouchableOpacity onPress={() => router.push({
         pathname: "/register"
       })}>
          <Text style={styles.link}>
            Pas encore de compte ? Créez-en un ici
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Bienvenue {user.data?.pseudo || user.data?.email}
      </Text>

      <Button title="Se déconnecter" onPress={() => logout.mutate()} />
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
  link: {
    marginTop: 20,
    color: "#007bff",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
