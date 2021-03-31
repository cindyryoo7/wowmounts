import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SectionList, TouchableOpacity, Modal, Alert, Pressable, Image } from 'react-native';
import axios from 'axios';
import _ from 'lodash';

export default function App() {
  const [mounts, setMounts] = useState([]);
  const [sectionedMounts, setSectionedMounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mountInfo, setMountInfo] = useState('');

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
      });
  };

  const fetchSingleMount = (name) => {
    axios
      .get(`http://10.0.0.194:5000/api/single?name=${name}`)
      .then(response => {
        // console.log('mountinfo', response.data)
        setMountInfo(response.data);
      })
      .catch(err => {
        console.log('Error: cannot retrieve mount info from server', err);
      });
  }

  const sectionMounts = () => {
    let mountNames = [];
    var storage = {};
    var results = [];
    for (var i = 0; i < mounts.length; i++) {
      mountNames.push(mounts[i].name);
    }
    let uniqueMounts = _.uniq(mountNames);
    for (var i = 0; i < uniqueMounts.length; i++) {
      if (!storage[uniqueMounts[i][0]]) {
        storage[uniqueMounts[i][0]] = [uniqueMounts[i]];
      } else {
        storage[uniqueMounts[i][0]].push(uniqueMounts[i])
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

  const handleModalOpen = async () => {
    await setShowModal(true);
  }

  const handleModalClose = () => {
    setShowModal(false);
  }

  const onTextPress = async (e, text) => {
    await fetchSingleMount(text);
    await handleModalOpen();
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
          <TouchableOpacity onPress={(e) => onTextPress(e, item)}>
            <View style={ styles.item }>
              <Text style={ styles.title }>{ item }</Text>
            </View>
          </TouchableOpacity>
        }
        renderSectionHeader={ ({ section: { title } }) => (
          <Text style={ styles.header }>{ title }</Text>
        )}
      />
      <StatusBar style="auto" />
      <Modal
        animationType="slide"
        transparent={ true }
        visible={ showModal }
        onRequestClose={ handleModalClose } >
        <View style={ styles.centeredView } >
          <View style={ styles.modalView } >
            <Text style={ styles.modalText }>Name: { mountInfo.name }</Text>
            <Text style={ styles.modalText }>Description: { mountInfo.description }</Text>
            <Text style={ styles.modalText }>Source: { mountInfo.source }</Text>
            { mountInfo.faction !== null ? <Text style={ styles.modalText }>Faction: { mountInfo.faction }</Text> : null }
            { mountInfo.requirements !== null &&  typeof mountInfo.requirements !== 'undefined' ? <Text style={ styles.modalText }>Requirements: { mountInfo['requirements']['faction']['name'] } Faction</Text> : null }
            <Image source={{ uri: mountInfo.imageUrl }} style={ styles.image }></Image>
            <Pressable
              style={ [styles.button, styles.buttonClose] }
              onPress={ handleModalClose } >
              <Text style={ styles.textStyle }>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    // textAlign: "left"
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  image: {
    height: 200,
    width: 200
  }
});
