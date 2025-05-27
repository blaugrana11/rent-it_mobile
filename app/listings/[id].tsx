import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useListingById } from "@/lib/api/listingsById";
import { API_BASE_URL } from "@/lib/api/listings";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data, isLoading, error } = useListingById(id as string);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<string>>(null);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Erreur lors du chargement</Text>
        <Text style={styles.errorSubtext}>Impossible de charger cette annonce</Text>
      </SafeAreaView>
    );
  }

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setActiveIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Image Carousel */}
        <View style={styles.imageContainer}>
          <FlatList
            ref={flatListRef}
            data={data.images || []}
            horizontal
            keyExtractor={(uri, index) => uri + index}
            pagingEnabled
            snapToAlignment="center"
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            onScroll={handleScroll}
            renderItem={({ item }) => (
              <View style={styles.imageWrapper}>
                <Image source={{ uri: `${API_BASE_URL}${item}` }} style={styles.heroImage} resizeMode="cover" />
              </View>
            )}
          />

          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          {/* Image Counter */}
          {data.images && data.images.length > 1 && (
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {activeIndex + 1} / {data.images.length}
              </Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.contentCard}>
          <View style={styles.headerSection}>
            <Text style={styles.title} numberOfLines={2}>
              {data.title}
            </Text>

            <View style={styles.priceContainer}>
              <Text style={styles.price}>{data.price} €</Text>
              {data.condition && (
                <View style={styles.conditionBadge}>
                  <Text style={styles.conditionText}>{data.condition}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {data.description || "Aucune description disponible."}
            </Text>
          </View>

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 32,
  },
  
  errorText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#dc3545",
    textAlign: "center",
    marginBottom: 8,
  },
  
  errorSubtext: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
  },
  
  scrollView: {
    flex: 1,
  },
  
  imageContainer: {
    height: screenHeight * 0.4, // 40% de la hauteur d'écran
    position: "relative",
  },
  
  imageWrapper: {
    width: screenWidth,
    height: "100%",
  },
  
  heroImage: {
    width: "100%",
    height: "100%",
  },
  
  imageCounter: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  
  imageCounterText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  
  contentCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingTop: 24,
    paddingHorizontal: 24,
    minHeight: screenHeight * 0.65,
  },
  
  headerSection: {
    marginBottom: 24,
  },
  
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    lineHeight: 34,
    marginBottom: 16,
  },
  
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  
  price: {
    fontSize: 32,
    fontWeight: "800",
    color: "#007AFF",
  },
  
  conditionBadge: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  
  conditionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1976d2",
  },
  
  divider: {
    height: 1,
    backgroundColor: "#e9ecef",
    marginBottom: 24,
  },
  
  descriptionSection: {
    marginBottom: 32,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#495057",
  },
  
  additionalInfo: {
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  
  infoLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6c757d",
    flex: 1,
  },
  
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    textAlign: "right",
    flex: 1,
  },
  
  bottomSpacing: {
    height: 40,
  },
    backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  }
});