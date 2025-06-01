// path: src/app/tab/login.tsx

import AuthScreen from "@/lib/user/AuthScreen";
import { View, StyleSheet, Platform } from "react-native";

export default function Login() {
  return (
    <View style={styles.container}>
      <AuthScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 40 : 60,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
