// path: src/lib/user/RegisterScreen.tsx
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
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
      Alert.alert("Erreur", "Tous les champs sont obligatoires.");
      return;
    }

    register.mutate(
      { email, password, pseudo },
      {
        onSuccess: (data) => {
          Alert.alert("Succès", `Bienvenue ${data.pseudo} !`, [
            {
              text: "OK",
              onPress: () => navigation.goBack(), // Retour à la page login
            },
          ]);
        },
        onError: (error: any) => {
          Alert.alert("Erreur", error.message || "Échec de l'inscription.");
        },
      }
    );
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Bouton back */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>Inscription</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Pseudo"
        value={pseudo}
        onChangeText={setPseudo}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <Button
        title="S'inscrire"
        onPress={handleSubmit}
        disabled={register.isPending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 50, // Ajuste selon la hauteur de ta status bar
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
});