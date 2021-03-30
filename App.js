import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import axios from 'axios';

export default function App() {
  const [mounts, setMounts] = useState('');

  const fetchRepositories = () => {
    axios
      .get(`http://10.0.0.194:5000/api/mounts`)
      .then(response => {
        setMounts(response.data);
      })
      .catch(err => {
        console.error('Error: cannot retrieve mounts from database')
      })
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  return (
    <View style={styles.container}>
      <Text>{mounts}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
