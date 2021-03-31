import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SectionList, TouchableOpacity, Modal, Alert, Pressable, Image } from 'react-native';
import { AlphabetList } from "react-native-section-alphabet-list";
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
      results.push({ value: uniqueMounts[i], key: i })
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
    await fetchSingleMount(text.value);
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
      <StatusBar style="auto" />
      <AlphabetList
        data={ sectionedMounts }
        indexLetterColor={ 'blue' }
        keyExtractor={ (item, index) => item + index }
        renderCustomItem={ ( item ) => (
          <TouchableOpacity onPress={(e) => onTextPress(e, item)}>
            <View style={ styles.item }>
              <Text style={ styles.title }>{ item.value }</Text>
            </View>
          </TouchableOpacity>
        )}
        renderCustomSectionHeader={ ( section ) => (
          <Text style={ styles.header }>{ section.title }</Text>
        )}
      />
      <Modal
        animationType="slide"
        transparent={ true }
        visible={ showModal }
        onRequestClose={ handleModalClose } >
        <View style={ styles.centeredView } >
          <View style={ styles.modalView } >
            <Text style={ styles.modalTextHeader }>Name:
              <Text style={ styles.modalText }> { mountInfo.name }</Text>
            </Text>
            <Text style={ styles.modalTextHeader }>Description:
              <Text style={ styles.modalText }> { mountInfo.description }</Text>
            </Text>
            <Text style={ styles.modalTextHeader }>Source:
              <Text style={ styles.modalText }> { mountInfo.source }</Text>
            </Text>
            { mountInfo.faction !== null
              ? <Text style={ styles.modalTextHeader }>Faction:
                  <Text style={ styles.modalText }> { mountInfo.faction }</Text>
                </Text>
              : null }
            { mountInfo.requirements !== null &&  typeof mountInfo.requirements !== 'undefined'
              ? <Text style={ styles.modalTextHeader }>Requirements:
                  <Text style={ styles.modalText }> { mountInfo['requirements']['faction']['name'] } Faction</Text>
                </Text>
              : null }
            <Image source={{ uri: mountInfo.imageUrl }} style={ styles.image }></Image>
            <Text></Text>
            <Pressable
              style={ [styles.button, styles.buttonClose] }
              onPress={ handleModalClose } >
              <Text style={ styles.textStyle }>Close</Text>
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
  modalTextHeader: {
    marginBottom: 15,
    fontWeight: "bold",
  },
  modalText: {
    marginBottom: 15,
    fontWeight: "normal",
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
