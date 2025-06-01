// path: src/lib/user/RegisterScreen.tsx
import { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "./useAuth";

export default function RegisterScreen() {
  const { register } = useAuth();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pseudo, setPseudo] = useState("");

  const handleSubmit = () => {
    if (!email || !password || !pseudo) {
      // Affichage d'erreur plus moderne (tu peux garder Alert si tu préfères)
      return;
    }

    register.mutate(
      { email, password, pseudo },
      {
        onSuccess: (data) => {
          // Alert moderne ou tu peux utiliser une toast notification
          setTimeout(() => {
            navigation.goBack();
          }, 1500);
        },
        onError: (error: any) => {
          // Gestion d'erreur moderne
          console.error("Inscription échouée:", error.message);
        },
      }
    );
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Bouton back moderne */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <View style={styles.backButtonContainer}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </View>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Inscription</Text>
        <Text style={styles.subtitle}>
          Créez votre compte pour commencer
        </Text>

        {/* Affichage des erreurs */}
        {register.isError && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#FF3B30" />
            <Text style={styles.errorText}>
              {(register.error as Error)?.message || "Échec de l'inscription"}
            </Text>
          </View>
        )}

        {/* Affichage du succès */}
        {register.isSuccess && (
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={20} color="#34C759" />
            <Text style={styles.successText}>
              Compte créé avec succès ! Redirection...
            </Text>
          </View>
        )}

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Pseudo"
            placeholderTextColor="#8E8E93"
            value={pseudo}
            onChangeText={setPseudo}
            autoCapitalize="words"
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#8E8E93"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#8E8E93"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="new-password"
          />

          <TouchableOpacity
            style={[
              styles.registerButton,
              register.isPending && styles.registerButtonDisabled,
              (!email || !password || !pseudo) && styles.registerButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={register.isPending || !email || !password || !pseudo}
          >
            {register.isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>S'inscrire</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.loginPrompt}>
          <Text style={styles.loginPromptText}>
            Vous avez déjà un compte ?{" "}
            <TouchableOpacity onPress={handleGoBack}>
              <Text style={styles.loginLink}>Connectez-vous</Text>
            </TouchableOpacity>
          </Text>
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
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#1C1C1E",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#8E8E93",
    marginBottom: 32,
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
  registerButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
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
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E8",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    color: "#34C759",
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
  loginPrompt: {
    alignItems: "center",
    padding: 16,
  },
  loginPromptText: {
    fontSize: 16,
    color: "#8E8E93",
  },
  loginLink: {
    color: "#007AFF",
    fontWeight: "600",
  },
});