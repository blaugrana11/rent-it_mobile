import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import { ListingSearchParams } from "@/lib/api/listings";

const CONDITIONS = ["neuf", "comme neuf", "bon état", "état moyen", "mauvais état"];

type Props = {
  onSearch: (params: ListingSearchParams) => void;
};

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = () => {
    onSearch({
      query: query || undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      condition: condition || undefined,
    });
  };

  const handleReset = () => {
    setQuery("");
    setMinPrice("");
    setMaxPrice("");
    setCondition("");
    onSearch({});
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.container}>
          <TextInput
            placeholder="🔍 Rechercher une annonce"
            value={query}
            onChangeText={setQuery}
            style={styles.input}
            placeholderTextColor="#888"
          />

          <View style={styles.row}>
            <TextInput
              placeholder="Prix min"
              value={minPrice}
              onChangeText={setMinPrice}
              keyboardType="numeric"
              style={[styles.input, styles.half]}
              placeholderTextColor="#888"
            />
            <TextInput
              placeholder="Prix max"
              value={maxPrice}
              onChangeText={setMaxPrice}
              keyboardType="numeric"
              style={[styles.input, styles.half]}
              placeholderTextColor="#888"
            />
          </View>

          {/* Custom condition picker */}
          <TouchableOpacity
            style={styles.selector}
            onPress={() => setModalVisible(true)}
          >
            <Text style={{ color: condition ? "#000" : "#888" }}>
              {condition ? `État : ${condition}` : "📦 Choisir une condition"}
            </Text>
          </TouchableOpacity>

          {/* Buttons */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.searchButton} onPress={handleSubmit}>
              <Text style={styles.searchText}>Rechercher</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetText}>Réinitialiser</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Condition modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={CONDITIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setCondition(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: "#fff",
  },
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  input: {
    backgroundColor: "#f1f3f5",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 12,
    color: "#111",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  half: {
    width: "48%",
  },
  selector: {
    backgroundColor: "#f1f3f5",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  searchButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  searchText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  resetButton: {
    flex: 1,
    backgroundColor: "#e9ecef",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  resetText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "50%",
  },
  modalItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalItemText: {
    fontSize: 16,
  },
});
