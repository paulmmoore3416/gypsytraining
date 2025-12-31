import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function JournalScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Journal Module</Text>
      <Text style={styles.text}>Write and view journal entries here</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, color: '#666' },
});
