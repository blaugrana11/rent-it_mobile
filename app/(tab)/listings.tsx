import React, { useState, useEffect } from 'react';
import { useRouter } from "expo-router";
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { fetchListings, Listing, ListingSearchParams } from '@/lib/api/listings';
import SearchBar from '@/components/SearchBar';
import { API_BASE_URL } from '@/lib/api/listings';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2; // 16 padding left/right + 16 gap between items

export default function ListingsScreen() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<ListingSearchParams>({});
  const scrollY = new Animated.Value(0);

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

  const renderListingItem = ({ item, index }: { item: Listing; index: number }) => (
    <TouchableOpacity 
      style={[
        styles.card,
        { marginRight: index % 2 === 0 ? 8 : 0, marginLeft: index % 2 === 1 ? 8 : 0 }
      ]} 
      onPress={() => router.push({
        pathname: "/listings/[id]",
        params: { id: item._id },
      })}
    >
      {item.images?.[0] && (
        <Image
          source={{ uri: `${API_BASE_URL}${item.images[0]}` }}
          style={styles.image}
        />
      )}
      
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        
        <Text style={styles.price}>{item.price}€</Text>
        
        {item.condition && (
          <View style={styles.conditionContainer}>
            <Text style={styles.condition}>{item.condition}</Text>
          </View>
        )}
        
        <Text style={styles.desc} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196f3" />
          <Text style={styles.loadingText}>Chargement des annonces...</Text>
        </View>
      ) : listings?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>Aucune annonce trouvée</Text>
          <Text style={styles.emptyText}>
            Essayez de modifier vos critères de recherche
          </Text>
        </View>
      ) : (
        <Animated.FlatList
          data={listings}
          keyExtractor={(item) => item._id}
          renderItem={renderListingItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: ITEM_WIDTH,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  cardContent: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 6,
    lineHeight: 20,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196f3',
    marginBottom: 6,
  },
  conditionContainer: {
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  condition: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  desc: {
    color: '#6c757d',
    fontSize: 13,
    lineHeight: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6c757d',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  emptyIcon: {
    fontSize: 64,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 22,
  },
});