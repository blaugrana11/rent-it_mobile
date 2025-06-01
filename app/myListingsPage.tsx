// src/screens/MyListingsPage.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { useAuth } from '../lib/user/useAuth';
import { useUserListings } from '../lib/user/useUserListings';
import { API_BASE_URL } from '../lib/api/listings';


// Fonction helper pour construire l'URL complète de l'image
const getImageUrl = (imagePath: string) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_BASE_URL}${imagePath}`;
};

export default function MyListingsPage() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { user } = useAuth();
  const userId = user.data?._id;
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  
  const { 
    data: userListingsData, 
    isLoading, 
    error, 
    refetch 
  } = useUserListings(userId || '');

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      console.log('Cannot go back, navigation stack is empty');
    }
  };

  // Fonction pour supprimer une annonce
  const handleDeleteListing = async (listingId: string, listingTitle: string) => {
    Alert.alert(
      "Supprimer l'annonce",
      `Êtes-vous sûr de vouloir supprimer "${listingTitle}" ?`,
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingIds(prev => [...prev, listingId]);
              
              const response = await fetch(`${API_BASE_URL}/api/profile/${userId}/${listingId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
              });

              if (!response.ok) {
                throw new Error('Erreur lors de la suppression');
              }

              // Recharger la liste après suppression
              await refetch();
              
              Alert.alert("Succès", "L'annonce a été supprimée avec succès");
            } catch (error) {
              console.error('Erreur suppression:', error);
              Alert.alert("Erreur", "Impossible de supprimer l'annonce. Veuillez réessayer.");
            } finally {
              setDeletingIds(prev => prev.filter(id => id !== listingId));
            }
          }
        }
      ]
    );
  };

  // Si pas connecté
  if (!user.data) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerWrapper}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <View style={styles.backButtonContainer}>
                  <Ionicons name="arrow-back" size={24} color="#007AFF" />
                </View>
              </TouchableOpacity>
              <View style={styles.titleSection}>
                <Text style={styles.title}>Mes Annonces</Text>
                <Text style={styles.subtitle}>Gérez vos publications</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>🔒</Text>
          <Text style={styles.errorText}>Vous devez être connecté</Text>
          <Text style={styles.errorSubText}>pour voir vos annonces</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Si loading
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerWrapper}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <View style={styles.backButtonContainer}>
                  <Ionicons name="arrow-back" size={24} color="#007AFF" />
                </View>
              </TouchableOpacity>
              <View style={styles.titleSection}>
                <Text style={styles.title}>Mes Annonces</Text>
                <Text style={styles.subtitle}>Gérez vos publications</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Chargement de vos annonces...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Si erreur
  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerWrapper}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <View style={styles.backButtonContainer}>
                  <Ionicons name="arrow-back" size={24} color="#007AFF" />
                </View>
              </TouchableOpacity>
              <View style={styles.titleSection}>
                <Text style={styles.title}>Mes Annonces</Text>
                <Text style={styles.subtitle}>Gérez vos publications</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>
            {error instanceof Error ? error.message : 'Une erreur est survenue'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const listings = userListingsData?.listings || [];

  // Header avec titre et stats Version avec bouton back intégré
  const ListHeader = () => (
    <View style={styles.headerWrapper}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <View style={styles.backButtonContainer}>
              <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </View>
          </TouchableOpacity>
          
          <View style={styles.titleSection}>
            <Text style={styles.title}>Mes Annonces</Text>
            <Text style={styles.subtitle}>Gérez vos publications</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{listings.length}</Text>
              <Text style={styles.statLabel}>
                {listings.length <= 1 ? 'annonce' : 'annonces'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  // Si pas d'annonces
  if (listings.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ListHeader />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyTitle}>Aucune annonce</Text>
          <Text style={styles.emptyText}>
            Vous n'avez pas encore publié d'annonces.{'\n'}
            Commencez dès maintenant !
          </Text>
          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.createButtonText}>+ Créer une annonce</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Render d'une annonce
  const renderListing = ({ item, index }: { item: any; index: number }) => {
    const imageUrl = item.images && item.images.length > 0 
      ? getImageUrl(item.images[0]) 
      : null;

    const isDeleting = deletingIds.includes(item._id || item.id);

    return (
      <TouchableOpacity 
        style={[
          styles.listingCard, 
          { marginTop: index === 0 ? 0 : 12 },
          isDeleting && styles.listingCardDeleting
        ]}
        activeOpacity={0.7}
        disabled={isDeleting}
      >

        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image 
              source={{ uri: imageUrl }} 
              style={[styles.listingImage, isDeleting && styles.imageDeleting]}
              resizeMode="cover"
              onError={(error) => {
                console.log('Erreur de chargement d\'image:', error.nativeEvent.error);
                console.log('URL tentée:', imageUrl);
              }}
            />
          ) : (
            <View style={[styles.placeholderImage, isDeleting && styles.imageDeleting]}>
              <Text style={styles.placeholderText}>📷</Text>
            </View>
          )}
          

          {item.images && item.images.length > 1 && (
            <View style={styles.imageCountBadge}>
              <Text style={styles.imageCountText}>{item.images.length}</Text>
            </View>
          )}
        </View>


        <View style={[styles.listingContent, isDeleting && styles.contentDeleting]}>
          <View style={styles.listingHeader}>
            <Text style={styles.listingTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.listingPrice}>{item.price}€</Text>
          </View>
          
          <Text style={styles.listingDescription} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.listingFooter}>
            <Text style={styles.listingDate}>
              {new Date(item.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </Text>
            

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteListing(item._id || item.id, item.title)}
              disabled={isDeleting}
              activeOpacity={0.8}
            >
              <View style={styles.deleteButtonInner}>
                {isDeleting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Ionicons name="trash" size={16} color="white" />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>


        {isDeleting && (
          <View style={styles.deletingOverlay}>
            <ActivityIndicator size="large" color="#FF3B30" />
            <Text style={styles.deletingText}>Suppression...</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={listings}
        keyExtractor={(item) => item._id || item.id}
        renderItem={renderListing}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  
  // Back button styles
  backButton: {
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },


  headerWrapper: {
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  header: {
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  headerContent: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleSection: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  statsContainer: {
    marginLeft: 20,
  },
  statCard: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
    textAlign: 'center',
  },

  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
  },

  // Error styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },

  // List styles
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  // Listing card styles
  listingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  
  // Image styles
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  listingImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
    opacity: 0.5,
  },
  imageCountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },

  // Content styles
  listingContent: {
    padding: 16,
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  listingTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginRight: 12,
    lineHeight: 24,
  },
  listingPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  listingDescription: {
    fontSize: 15,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 12,
  },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listingDate: {
    fontSize: 13,
    color: '#8E8E93',
  },

  // Delete button styles - Version dans le footer
  deleteButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  deleteButtonInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Deleting states
  listingCardDeleting: {
    opacity: 0.6,
  },
  imageDeleting: {
    opacity: 0.5,
  },
  contentDeleting: {
    opacity: 0.7,
  },
  deletingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  deletingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
});