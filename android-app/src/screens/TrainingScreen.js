import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function TrainingScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Training Module</Text>
      <Text style={styles.text}>Track training sessions and progress here</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, color: '#666' },
});
