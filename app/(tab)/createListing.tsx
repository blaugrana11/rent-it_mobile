// screens/CreateListingScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useListings } from '@/lib/listings/useListings';
import { useNavigation } from '@react-navigation/native';

interface ImageData {
  uri: string;
  type: string;
  name: string;
}

export default function CreateListingScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('excellent');
  const [images, setImages] = useState<ImageData[]>([]);
  
  const { createListing } = useListings();
  const navigation = useNavigation();

  const conditions = [
    { label: 'Neuf', value: 'neuf' },
    { label: 'Comme neuf', value: 'comme neuf' },
    { label: 'Bon état', value: 'bon état' },
    { label: 'Etat moyen', value: 'état moyen' },
    { label: 'Mauvais état', value: 'mauvais état' },
  ];

  const showImagePicker = () => {
    Alert.alert(
      "Sélectionner une image",
      "Choisissez une option",
      [
        { text: "Galerie", onPress: selectFromGallery },
        { text: "Appareil photo", onPress: takePhoto },
        { text: "Annuler", style: "cancel" }
      ]
    );
  };

  const selectFromGallery = async () => {
    try {
      // Demander les permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert("Permission requise", "Vous devez autoriser l'accès à la galerie pour sélectionner des images.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const imageData: ImageData = {
          uri: asset.uri,
          type: 'image/jpeg',
          name: `image_${Date.now()}.jpg`,
        };
        setImages(prev => [...prev, imageData]);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de l\'image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
    }
  };

  const takePhoto = async () => {
    try {
      // Demander les permissions
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert("Permission requise", "Vous devez autoriser l'accès à l'appareil photo pour prendre des photos.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const imageData: ImageData = {
          uri: asset.uri,
          type: 'image/jpeg',
          name: `photo_${Date.now()}.jpg`,
        };
        setImages(prev => [...prev, imageData]);
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      Alert.alert('Erreur', 'Impossible de prendre la photo');
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validation des champs
    if (!title.trim()) {
      Alert.alert('Erreur', 'Le titre est requis');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Erreur', 'La description est requise');
      return;
    }
    if (!price.trim() || isNaN(Number(price))) {
      Alert.alert('Erreur', 'Le prix doit être un nombre valide');
      return;
    }

    try {
      // Créer le FormData avec les images pour React Native
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('condition', condition);

      // Ajouter les images au FormData
      images.forEach((image, index) => {
        formData.append('images', {
          uri: image.uri,
          type: image.type,
          name: image.name,
        } as any); // Le 'as any' est nécessaire pour React Native
      });

      await createListing.mutateAsync({
        formData, // On passe directement le FormData
      });

      Alert.alert('Succès', 'Annonce créée avec succès!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Erreur lors de la création de l\'annonce');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Créer une annonce</Text>

        {/* Titre */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Titre *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Titre de votre annonce"
            maxLength={100}
          />
        </View>

        {/* Prix */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prix (€) *</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="0"
            keyboardType="numeric"
          />
        </View>

        {/* État */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>État</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.conditionContainer}>
              {conditions.map((cond) => (
                <TouchableOpacity
                  key={cond.value}
                  style={[
                    styles.conditionButton,
                    condition === cond.value && styles.conditionButtonActive
                  ]}
                  onPress={() => setCondition(cond.value)}
                >
                  <Text style={[
                    styles.conditionText,
                    condition === cond.value && styles.conditionTextActive
                  ]}>
                    {cond.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Décrivez votre article..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Images */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Images ({images.length}/5)</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.imagesContainer}>
              {images.map((image, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: image.uri }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeImage(index)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              
              {images.length < 5 && (
                <TouchableOpacity
                  style={styles.addImageButton}
                  onPress={showImagePicker}
                >
                  <Text style={styles.addImageText}>+</Text>
                  <Text style={styles.addImageLabel}>Ajouter</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>

        {/* Bouton de soumission */}
        <TouchableOpacity
          style={[styles.submitButton, createListing.isPending && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={createListing.isPending}
        >
          {createListing.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Créer l'annonce</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
  },
  conditionContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  conditionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  conditionButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  conditionText: {
    color: '#666',
    fontSize: 14,
  },
  conditionTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  imagesContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  addImageText: {
    fontSize: 30,
    color: '#999',
  },
  addImageLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});