import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SectionList, TouchableOpacity, Modal, Alert, Pressable, Image, SafeAreaView, TextInput, Button, FlatList } from 'react-native';
import { AlphabetList } from "react-native-section-alphabet-list";
import axios from 'axios';
import _ from 'lodash';

export default function App() {
  const [mounts, setMounts] = useState([]);
  const [sectionedMounts, setSectionedMounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mountInfo, setMountInfo] = useState('');
  const [inputText, setInputText] = useState('');
  const [filteredMounts, setFilteredMounts] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [myCollection, setMyCollection] = useState([]);
  const [showList, setShowList] = useState(true);
  const [showCollection, setShowCollection] = useState(false);
  const [showListView, setShowListView] = useState(true);
  const [showGalleryView, setShowGalleryView] = useState(false);
  const [myFilteredCollection, setMyFilteredCollection] = useState([]);

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

  const sectionMounts = (list) => {
    let mountNames = [];
    var storage = {};
    var results = [];
    for (var i = 0; i < list.length; i++) {
      mountNames.push(list[i].name);
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

  const handleTextPress = async (e, text) => {
    await fetchSingleMount(text.value);
    await handleModalOpen();
  }

  const handleImagePress = async (e, image) => {
    await fetchSingleMount(image.name);
    await handleModalOpen();
  }

  const handleSearch = async (searchValue) => {
    let filtered;
    if (searchValue.length) {
      if (searchValue.length > 2) {
        if (showList) {
          filtered = sectionedMounts.filter(name => (
            name.value.includes(searchValue)
          ));
        } else if (showCollection) {
          if (showGalleryView) {
            filtered = await myCollection.filter(mount => (
              mount.name.includes(searchValue)
            ));
            setMyFilteredCollection(filtered);
          } else {
            await sectionMounts(myCollection);
            filtered = await sectionedMounts.filter(name => (
              name.value.includes(searchValue)
            ));
          }
        }
        setFilteredMounts(filtered);
        setIsFiltered(true);
      } else {
        setFilteredMounts([]);
        setIsFiltered(false);
      }
    } else {
      setFilteredMounts([]);
      setIsFiltered(false);
    }
  }

  const handleAddToCollection = (e, info) => {
    Alert.alert(`${info.name} has been added to your collection!`)
    let currentCollection = myCollection.slice()
    currentCollection.push(info);
    setMyCollection(currentCollection);
  }

  const handleViewList = () => {
    setShowList(true);
    setShowCollection(false);
    sectionMounts(mounts);
    setFilteredMounts([]);
    setInputText('');
    setIsFiltered(false);
  }

  const handleViewCollection = () => {
    setShowList(false);
    setShowCollection(true);
    sectionMounts(myCollection);
    setFilteredMounts([]);
    setInputText('');
    setIsFiltered(false);
  }

  const handleGalleryView = () => {
    setShowGalleryView(true);
    setShowListView(false);
    setFilteredMounts([]);
    setInputText('');
    setIsFiltered(false);
  }

  const handleListView = () => {
    setShowListView(true);
    setShowGalleryView(false);
    setFilteredMounts([]);
    setInputText('');
    setIsFiltered(false);
  }

  useEffect(() => {
    fetchMounts();
  }, []);

  useEffect(() => {
    sectionMounts(mounts);
  }, [mounts]);

  useEffect(()=> {
    handleSearch(inputText);
  },[inputText])

  return (
    <SafeAreaView style={ styles.container }>
      <StatusBar style="auto" />
      <View style={ styles.title }>
        <Text style={ styles.titleText }>WoW, Mounts!</Text>
      </View>
      <View style={ styles.navigation }>
        <Pressable
          onPress={ handleViewList } >
          <Text style={ styles.navigationText }>View All Mounts</Text>
        </Pressable>
        <Pressable
          onPress={ handleViewCollection } >
          <Text style={ styles.navigationText }>View My Collection</Text>
        </Pressable>
      </View>
      <TextInput
        style={ styles.input }
        onChangeText={ setInputText }
        value={ inputText }
        placeholder={ ' Search for a mount...'}
      />
      { showList && !showCollection
        ? isFiltered && filteredMounts.length
          ? <AlphabetList
            data={ filteredMounts }
            indexLetterColor={ 'blue' }
            keyExtractor={ (item, index) => item + index }
            renderCustomItem={ ( item ) => (
              <TouchableOpacity onPress={(e) => handleTextPress(e, item)}>
                <View style={ styles.item }>
                  <Text style={ styles.listText }>{ item.value }</Text>
                </View>
              </TouchableOpacity>
            )}
            renderCustomSectionHeader={ ( section ) => (
              <Text style={ styles.header }>{ section.title }</Text>
            )} />
          : isFiltered && !filteredMounts.length
              ? <Text style={ styles.errorText }>No mounts with that search criteria can be found.</Text>
              : <AlphabetList
                data={ sectionedMounts }
                indexLetterColor={ 'blue' }
                keyExtractor={ (item, index) => item + index }
                renderCustomItem={ ( item ) => (
                  <TouchableOpacity onPress={(e) => handleTextPress(e, item)}>
                    <View style={ styles.item }>
                      <Text style={ styles.listText }>{ item.value }</Text>
                    </View>
                  </TouchableOpacity>
                )}
                renderCustomSectionHeader={ ( section ) => (
                  <Text style={ styles.header }>{ section.title }</Text>
                )}
              />
        : isFiltered && filteredMounts.length && showCollection
          ? <View>
              <View style={ styles.navigation }>
                {showListView
                  ? <Pressable
                    onPress={ handleGalleryView } >
                    <Text style={ styles.navigationText }>Gallery View</Text>
                  </Pressable>
                  : <Pressable
                    onPress={ handleListView } >
                    <Text style={ styles.navigationText }>List View</Text>
                  </Pressable>
                }
              </View>
              { showListView
                ? <AlphabetList
                  data={ filteredMounts }
                  indexLetterColor={ 'blue' }
                  keyExtractor={ (item, index) => item + index }
                  renderCustomItem={ ( item ) => (
                    <TouchableOpacity onPress={(e) => handleTextPress(e, item)}>
                      <View style={ styles.item }>
                        <Text style={ styles.listText }>{ item.value }</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  renderCustomSectionHeader={ ( section ) => (
                    <Text style={ styles.header }>{ section.title }</Text>
                  )} />
                : isFiltered && myFilteredCollection.length
                  ? <FlatList
                    data={ myFilteredCollection }
                    renderItem={ ( { item } ) => (
                      <TouchableOpacity style={ styles.gallery } onPress={(e) => handleImagePress(e, item)}>
                        <Image source={{ uri: item.imageUrl }} style={ styles.galleryImage }></Image>
                        <Text>{ item.name }</Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={ (item, index) => item + index }
                    numColumns={ 2 }
                  />
                  : <FlatList
                    data={ myCollection }
                    renderItem={ ( { item } ) => (
                      <TouchableOpacity style={ styles.gallery } onPress={(e) => handleImagePress(e, item)}>
                        <Image source={{ uri: item.imageUrl }} style={ styles.galleryImage }></Image>
                        <Text>{ item.name }</Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={ (item, index) => item + index }
                    numColumns={ 2 }
                  />
              }
            </View>
          : isFiltered && !filteredMounts.length
              ? <Text style={ styles.errorText }>No mounts with that search criteria can be found.</Text>
              : <View>
                  <View style={ styles.navigation }>
                    {showListView
                      ? <Pressable
                        onPress={ handleGalleryView } >
                        <Text style={ styles.navigationText }>Gallery View</Text>
                      </Pressable>
                      : <Pressable
                      onPress={ handleListView } >
                      <Text style={ styles.navigationText }>List View</Text>
                    </Pressable>
                    }
                  </View>
                { showListView
                  ? <AlphabetList
                    data={ sectionedMounts }
                    indexLetterColor={ 'blue' }
                    keyExtractor={ (item, index) => item + index }
                    renderCustomItem={ ( item ) => (
                      <TouchableOpacity onPress={(e) => handleTextPress(e, item)}>
                        <View style={ styles.item }>
                          <Text style={ styles.listText }>{ item.value }</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    renderCustomSectionHeader={ ( section ) => (
                      <Text style={ styles.header }>{ section.title }</Text>
                    )}
                  />
                  : isFiltered && myFilteredCollection.length
                    ? <FlatList
                      data={ myFilteredCollection }
                      renderItem={ ( { item } ) => (
                        <TouchableOpacity style={ styles.gallery } onPress={(e) => handleImagePress(e, item)}>
                          <Image source={{ uri: item.imageUrl }} style={ styles.galleryImage }></Image>
                          <Text>{ item.name }</Text>
                        </TouchableOpacity>
                      )}
                      keyExtractor={ (item, index) => item + index }
                      numColumns={ 2 }
                    />
                    : <FlatList
                      data={ myCollection }
                      renderItem={ ( { item } ) => (
                        <TouchableOpacity style={ styles.gallery } onPress={(e) => handleImagePress(e, item)}>
                          <Image source={{ uri: item.imageUrl }} style={ styles.galleryImage }></Image>
                          <Text>{ item.name }</Text>
                        </TouchableOpacity>
                      )}
                      keyExtractor={ (item, index) => item + index }
                      numColumns={ 2 }
                    />
                }
                </View>
        }
        {showCollection
          ? <Modal
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
                  { mountInfo.faction !== null && typeof mountInfo.faction !== 'undefined'
                    ? <Text style={ styles.modalTextHeader }>Faction:
                        <Text style={ styles.modalText }> { mountInfo.faction }</Text>
                      </Text>
                    : null }
                  { mountInfo.requirements !== null && typeof mountInfo.requirements !== 'undefined'
                    ? mountInfo['requirements']['classes']
                      ? <Text style={ styles.modalTextHeader }>Requirements:
                        <Text style={ styles.modalText }> { mountInfo['requirements']['classes'][0]['name'] } Class</Text>
                      </Text>
                      : mountInfo['requirements']['faction']
                        ? <Text style={ styles.modalTextHeader }>Requirements:
                            <Text style={ styles.modalText }> { mountInfo['requirements']['faction']['name'] } Faction</Text>
                          </Text>
                        : null
                    : null }
                  <Image source={{ uri: mountInfo.imageUrl }} style={ styles.image }></Image>
                  <Text></Text>
                  <View style={ styles.fixToText }>
                    <Pressable
                      style={ [styles.button, styles.buttonClose] }
                      onPress={ handleModalClose } >
                      <Text style={ styles.textStyle }>Close</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
          : <Modal
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
                { mountInfo.faction !== null && typeof mountInfo.faction !== 'undefined'
                  ? <Text style={ styles.modalTextHeader }>Faction:
                      <Text style={ styles.modalText }> { mountInfo.faction }</Text>
                    </Text>
                  : null }
                { mountInfo.requirements !== null && typeof mountInfo.requirements !== 'undefined'
                  ? mountInfo['requirements']['classes']
                    ? <Text style={ styles.modalTextHeader }>Requirements:
                      <Text style={ styles.modalText }> { mountInfo['requirements']['classes'][0]['name'] } Class</Text>
                    </Text>
                    : mountInfo['requirements']['faction']
                      ? <Text style={ styles.modalTextHeader }>Requirements:
                          <Text style={ styles.modalText }> { mountInfo['requirements']['faction']['name'] } Faction</Text>
                        </Text>
                      : null
                  : null }
                <Image source={{ uri: mountInfo.imageUrl }} style={ styles.image }></Image>
                <Text></Text>
                <View style={ styles.fixToText }>
                  <Pressable
                    style={ [styles.button, styles.buttonClose] }
                    onPress={ handleModalClose } >
                    <Text style={ styles.textStyle }>Close</Text>
                  </Pressable>
                  <Text> </Text>
                  <Pressable
                    style={ styles.button }
                    onPress={ (e) => handleAddToCollection(e, mountInfo) } >
                    <Text style={ styles.textStyle }>Add to Collection +</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)'
  },
  item: {
    padding: 10,
    fontSize: 12,
    height: 50
  },
  listText: {
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
    elevation: 2,
    backgroundColor: "#2196F3",
  },
  buttonClose: {
    backgroundColor: "#dc3545",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  image: {
    height: 200,
    width: 200
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 20,
    paddingLeft: 15
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navigationText: {
    color: "blue",
    textAlign: "center",
    textDecorationLine: 'underline'
  },
  title: {
    alignItems: 'center',
    paddingBottom: 10
  },
  titleText: {
    fontSize: 20,
    textDecorationLine: 'underline',
    fontWeight: "bold",
  },
  galleryImage: {
    height: 100,
    width: 100,
  },
  gallery: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    flex: 1,
  }
});
