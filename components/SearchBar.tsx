// components/SearchBar.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type Props = {
  onSearch: (params: {
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: string;
  }) => void;
};

const CONDITIONS = [
  '',
  'neuf',
  'comme neuf',
  'bon état',
  'état moyen',
  'mauvais état',
];

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [condition, setCondition] = useState('');

  const handleSubmit = () => {
    onSearch({
      query: query.trim() || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      condition: condition || undefined,
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search in Rent it"
        value={query}
        onChangeText={setQuery}
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.smallInput]}
          placeholder="Minimum price"
          keyboardType="numeric"
          value={minPrice}
          onChangeText={setMinPrice}
        />
        <TextInput
          style={[styles.input, styles.smallInput]}
          placeholder="Maximum price"
          keyboardType="numeric"
          value={maxPrice}
          onChangeText={setMaxPrice}
        />
      </View>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={condition}
          onValueChange={(itemValue: string) => setCondition(itemValue)}
        >
          {CONDITIONS.map((c) => (
            <Picker.Item
              key={c}
              label={c === '' ? 'Condition' : c}
              value={c}
            />
          ))}
        </Picker>
      </View>
      <Button title="Search" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 12,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  smallInput: {
    flex: 1,
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
});
