// app/listings/[id].tsx
import React from "react";
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useListingById } from "@/lib/api/listingsById";
import { API_BASE_URL } from "@/lib/api/listings";

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams();
  const { data, isLoading, error } = useListingById(id as string);

  if (isLoading) return <ActivityIndicator style={{ marginTop: 50 }} />;
  if (error || !data) return <Text>Erreur lors du chargement de l’annonce.</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={data.images || []}
        keyExtractor={(uri, index) => uri + index}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image source={{ uri: `${API_BASE_URL}${item}` }} style={styles.image} />
        )}
        style={{ marginBottom: 16 }}
      />

      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.description}>{data.description}</Text>
      <Text style={styles.price}>{data.price} €</Text>
      {data.condition && <Text style={styles.condition}>État : {data.condition}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  image: { width: 300, height: 200, marginRight: 16, borderRadius: 12 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  description: { fontSize: 16, color: "#555", marginBottom: 12 },
  price: { fontSize: 20, color: "#4f46e5", fontWeight: "bold", marginBottom: 8 },
  condition: { fontSize: 14, color: "#333" },
});
