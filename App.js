import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SectionList } from 'react-native';
import axios from 'axios';

export default function App() {
  const [mounts, setMounts] = useState([]);
  const [sectionedMounts, setSectionedMounts] = useState([]);

  const fetchMounts = () => {
    axios
      .get(`http://10.0.0.194:5000/api/mounts`)
      .then(response => {
        const sortedMounts = response.data.sort((a, b) => (
          (a.name > b.name) ? 1 : -1
        ));
        setMounts(sortedMounts);
      })
      .catch(err => {
        console.log('Error: cannot retrieve mounts from server', err);
      })
  };

  const sectionMounts = (allMounts) => {
    var storage = {};
    var results = [];
    for (var i = 0; i < mounts.length; i++) {
      if (!storage[mounts[i].name[0]]) {
        storage[mounts[i].name[0]] = [mounts[i].name];
      } else {
        storage[mounts[i].name[0]].push(mounts[i].name)
      }
    }
    for (var key in storage) {
      var newObj = {
        title: key,
        data: storage[key]
      }
      results.push(newObj);
    }
    setSectionedMounts(results);
  }

  useEffect(() => {
    fetchMounts();
  }, []);

  useEffect(() => {
    sectionMounts();
  }, [mounts]);

  return (
    <View style={ styles.container }>
      <SectionList
        sections={ sectionedMounts }
        keyExtractor={ (item, index) => item + index }
        renderItem={ ({ item }) =>
          <View style={ styles.item }>
            <Text style={ styles.title }>{ item }</Text>
          </View>
        }
        renderSectionHeader={ ({ section: { title } }) => (
          <Text style={ styles.header }>{ title }</Text>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)'
  },
  item: {
    padding: 10,
    fontSize: 12,
    height: 50
  },
  title: {
    fontSize: 24
  }
});
