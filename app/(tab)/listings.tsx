// app/(tab)/listings.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { API_BASE_URL, fetchListings, Listing } from '@/lib/api/listings';

export default function ListingsScreen() {
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings({})
      .then(data => setListings(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  if (!listings || listings.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No listings found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={listings}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.desc}>{item.description}</Text>
          <Text style={styles.price}>{item.price}€</Text>
          {item.condition && <Text style={styles.condition}>{item.condition}</Text>}
          {item.images && item.images.length > 0 && (
            
            <Image
  source={{ uri: `${API_BASE_URL}${item.images[0]}` }}
  style={styles.image}
/>
          )}
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  desc: { color: '#555', marginVertical: 6 },
  price: { color: '#4f46e5', fontWeight: 'bold' },
  condition: {
    marginTop: 4,
    backgroundColor: '#f3f4f6',
    padding: 4,
    borderRadius: 8,
    fontSize: 12,
    alignSelf: 'flex-start',
  },
  image: { width: '100%', height: 150, marginTop: 10, borderRadius: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#888' },
});