import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { db } from './src/services/firebase';

export default function App() {
  //test firebase inintialization
  React.useEffect(() => {
    console.log("Firebase initialized: ", db ? 'Success' : 'Failed');
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to CampusFinder! </Text>
      <Text style={styles.subtitle} > Lost and Found App</Text>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  }
})