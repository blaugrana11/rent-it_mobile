import React, { useState, useEffect } from 'react';
import { useRouter } from "expo-router";
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchListings, Listing, ListingSearchParams } from '@/lib/api/listings';
import SearchBar from '@/components/SearchBar';
import { API_BASE_URL } from '@/lib/api/listings';

const router = useRouter();
export default function ListingsScreen() {
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<ListingSearchParams>({});

  const loadListings = async (params: ListingSearchParams = {}) => {
    setLoading(true);
    try {
      const data = await fetchListings(params);
      setListings(data);
    } catch (err) {
      console.error(err);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings(searchParams);
  }, [searchParams]);

  const handleSearch = (params: ListingSearchParams) => {
    setSearchParams(params);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <SearchBar onSearch={handleSearch} />

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 50 }} />
      ) : listings?.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No listings found.</Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => router.push({
      pathname: "/listings/[id]",
      params: { id: item._id },
    })}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.description}</Text>
              <Text style={styles.price}>{item.price}€</Text>
              {item.condition && <Text style={styles.condition}>{item.condition}</Text>}
              {item.images?.[0] && (
            <Image
              source={{ uri: `${API_BASE_URL}${item.images[0]}` }}
              style={styles.image}
            />
            )}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
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
