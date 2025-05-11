import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useAuth } from "./login";

export default function RegisterScreen() {
  const { register } = useAuth();
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
          Alert.alert("Succès", `Bienvenue ${data.pseudo} !`);
          // TODO: rediriger ou changer d'écran si besoin
        },
        onError: (error: any) => {
          Alert.alert("Erreur", error.message || "Échec de l'inscription.");
        },
      }
    );
  };

  return (
    <View style={styles.container}>
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

      <Button title="S'inscrire" onPress={handleSubmit} disabled={register.isPending} />
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
