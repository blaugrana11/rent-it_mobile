import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "./useAuth";
import { useRouter } from "expo-router";

export default function AuthScreen() {
  const { user, login, logout } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user.isLoading)
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );

  if (user.isError || !user.data) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        
        <View style={styles.content}>
          <Text style={styles.title}>Connexion</Text>

          {login.isError && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#FF3B30" />
              <Text style={styles.errorText}>
                {(login.error as Error)?.message}
              </Text>
            </View>
          )}

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#8E8E93"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
              value={email}
            />

            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor="#8E8E93"
              secureTextEntry
              onChangeText={setPassword}
              value={password}
            />

            <TouchableOpacity
              style={[
                styles.loginButton,
                login.isPending && styles.loginButtonDisabled,
              ]}
              onPress={() => login.mutate({ email, password })}
              disabled={login.isPending}
            >
              {login.isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Se connecter</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => router.push({ pathname: "/register" })}
          >
            <Text style={styles.registerLinkText}>
              Pas encore de compte ?{" "}
              <Text style={styles.registerLinkBold}>Créez-en un ici</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Vue connectée - Interface utilisateur moderne
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
    

      {/* Contenu principal */}
      <View style={styles.profileContent}>
        <View style={styles.profileIcon}>
          <Ionicons name="person" size={60} color="#007AFF" />
        </View>

        <Text style={styles.profileName}>
          {user.data?.pseudo || user.data?.email}
        </Text>

        {/* Boutons d'actions */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              // TODO: Rediriger vers la page "Mes annonces"
              console.log("Redirection vers mes annonces");
            }}
          >
            <View style={styles.actionButtonContent}>
              <Ionicons name="list" size={24} color="#007AFF" />
              <Text style={styles.actionButtonText}>Mes annonces</Text>
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.logoutButton]}
            onPress={() => logout.mutate()}
          >
            <View style={styles.actionButtonContent}>
              <Ionicons name="log-out" size={24} color="#FF3B30" />
              <Text style={[styles.actionButtonText, styles.logoutButtonText]}>
                Se déconnecter
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 32,
    color: "#1C1C1E",
  },
  form: {
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    backgroundColor: "#F2F2F7",
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#1C1C1E",
  },
  loginButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#FF3B30",
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
  registerLink: {
    alignItems: "center",
    padding: 16,
  },
  registerLinkText: {
    fontSize: 16,
    color: "#8E8E93",
  },
  registerLinkBold: {
    color: "#007AFF",
    fontWeight: "600",
  },
  
  // Styles pour la vue connectée
  welcomeContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
  },
  profileContent: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  profileIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 40,
  },
  actionButtons: {
    width: "100%",
    gap: 12,
  },
  actionButton: {
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    padding: 16,
  },
  logoutButton: {
    marginTop: 8,
  },
  actionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#1C1C1E",
    marginLeft: 12,
  },
  logoutButtonText: {
    color: "#FF3B30",
  },
});