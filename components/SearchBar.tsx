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
  const [filtersVisible, setFiltersVisible] = useState(false);

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

  const hasActiveFilters = minPrice || maxPrice || condition;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.container}>
          <View style={styles.mainSearchContainer}>
            <View style={styles.searchInputContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                placeholder="Rechercher..."
                value={query}
                onChangeText={setQuery}
                style={styles.searchInput}
                placeholderTextColor="#999"
                onSubmitEditing={handleSubmit}
                returnKeyType="search"
                blurOnSubmit={false}
              />
              {query.length > 0 && (
                <TouchableOpacity 
                  onPress={() => setQuery("")}
                  style={styles.clearButton}
                >
                  <Text style={styles.clearIcon}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <TouchableOpacity
              style={[
                styles.filterButton,
                hasActiveFilters && styles.filterButtonActive
              ]}
              onPress={() => setFiltersVisible(!filtersVisible)}
            >
              <Text style={styles.filterIcon}>⚙️</Text>
              {hasActiveFilters && <View style={styles.filterDot} />}
            </TouchableOpacity>
          </View>

          {filtersVisible && (
            <View style={styles.filtersContainer}>
              <View style={styles.priceRow}>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.priceLabel}>Prix min</Text>
                  <TextInput
                    placeholder="0€"
                    value={minPrice}
                    onChangeText={setMinPrice}
                    keyboardType="numeric"
                    style={styles.priceInput}
                    placeholderTextColor="#999"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                </View>
                
                <View style={styles.priceSeparator} />
                
                <View style={styles.priceInputContainer}>
                  <Text style={styles.priceLabel}>Prix max</Text>
                  <TextInput
                    placeholder="∞"
                    value={maxPrice}
                    onChangeText={setMaxPrice}
                    keyboardType="numeric"
                    style={styles.priceInput}
                    placeholderTextColor="#999"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.conditionSelector}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.conditionLabel}>État</Text>
                <Text style={[
                  styles.conditionValue,
                  !condition && styles.conditionPlaceholder
                ]}>
                  {condition || "Tous"}
                </Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>

              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.resetButton} 
                  onPress={handleReset}
                >
                  <Text style={styles.resetText}>Effacer</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.searchButton} 
                  onPress={handleSubmit}
                >
                  <Text style={styles.searchText}>Rechercher</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>

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
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choisir l'état</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalClose}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={[{ key: 'all', label: 'Tous' }, ...CONDITIONS.map(c => ({ key: c, label: c }))]}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    (item.key === condition || (item.key === 'all' && !condition)) && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setCondition(item.key === 'all' ? '' : item.key);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    (item.key === condition || (item.key === 'all' && !condition)) && styles.modalItemTextSelected
                  ]}>
                    {item.label}
                  </Text>
                  {(item.key === condition || (item.key === 'all' && !condition)) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  mainSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#212529",
    height: "100%",
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 16,
    color: "#6c757d",
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  filterButtonActive: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196f3",
  },
  filterIcon: {
    fontSize: 18,
  },
  filterDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2196f3",
  },
  filtersContainer: {
    marginTop: 16,
    gap: 16,
    paddingBottom: 12,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  priceInputContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 4,
    fontWeight: "500",
  },
  priceInput: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: "#212529",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  priceSeparator: {
    width: 20,
    height: 1,
    backgroundColor: "#dee2e6",
    marginTop: 12,
  },
  conditionSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  conditionLabel: {
    fontSize: 12,
    color: "#6c757d",
    fontWeight: "500",
    minWidth: 40,
  },
  conditionValue: {
    flex: 1,
    fontSize: 16,
    color: "#212529",
    marginLeft: 12,
  },
  conditionPlaceholder: {
    color: "#999",
  },
  chevron: {
    fontSize: 18,
    color: "#6c757d",
    transform: [{ rotate: "90deg" }],
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  resetText: {
    color: "#6c757d",
    fontWeight: "600",
    fontSize: 16,
  },
  searchButton: {
    flex: 2,
    backgroundColor: "#2196f3",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  searchText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
  },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseText: {
    fontSize: 16,
    color: "#6c757d",
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f9fa",
  },
  modalItemSelected: {
    backgroundColor: "#f0f8ff",
  },
  modalItemText: {
    fontSize: 16,
    color: "#212529",
  },
  modalItemTextSelected: {
    color: "#2196f3",
    fontWeight: "500",
  },
  checkmark: {
    fontSize: 16,
    color: "#2196f3",
    fontWeight: "bold",
  },
});