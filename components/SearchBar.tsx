// components/SearchBar.tsx
import { ListingSearchParams } from "@/lib/api/listings";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";

const CONDITIONS = ["", "neuf", "comme neuf", "bon état", "état moyen", "mauvais état"];

type Props = {
  onSearch: (params: ListingSearchParams) => void;
};

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [condition, setCondition] = useState("");

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
    <View style={styles.container}>
      <TextInput
        placeholder="Search..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />

      <View style={styles.row}>
        <TextInput
          placeholder="Min price"
          value={minPrice}
          onChangeText={setMinPrice}
          keyboardType="numeric"
          style={[styles.input, styles.half]}
        />
        <TextInput
          placeholder="Max price"
          value={maxPrice}
          onChangeText={setMaxPrice}
          keyboardType="numeric"
          style={[styles.input, styles.half]}
        />
      </View>

      <Picker
        selectedValue={condition}
        onValueChange={(itemValue: string) => setCondition(itemValue)}
        style={styles.picker}
      >
        {CONDITIONS.map((c) => (
          <Picker.Item
            key={c}
            label={c === "" ? "Condition" : c}
            value={c}
          />
        ))}
      </Picker>

      <View style={styles.buttonGroup}>
        <Button title="Search" onPress={handleSubmit} />
        <View style={{ width: 12 }} />
        <Button title="Reset" color="#888" onPress={handleReset} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  input: {
    backgroundColor: "#f3f4f6",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  half: { width: "48%" },
  picker: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
});
