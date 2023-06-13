import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import Swipeable from 'react-native-swipeable';
import TrackPlayer from 'react-native-track-player';

function LibraryScreen({ libraryItems, setLibraryItems }) {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    readFilesFromDirectory();
  }, []);

  const setupTrackPlayer = async () => {
    await TrackPlayer.setupPlayer();
    // Additional setup configurations can be done here if needed
  };

  const readFilesFromDirectory = async () => {
    try {
      const documentPath = RNFS.DocumentDirectoryPath;
      const files = await RNFS.readDir(documentPath);

      const mp3Files = files.filter((file) => file.name.endsWith('.mp3'));

      const items = mp3Files.map((file) => ({
        id: file.name,
        title: file.name.replace('.mp3', ''),
        data: file.path,
      }));

      setLibraryItems(items);
    } catch (error) {
      console.log('Error reading files:', error);
    }
  };

  const deleteFile = async (filePath) => {
    try {
      await RNFS.unlink(filePath);
      console.log('File deleted successfully:', filePath);
    } catch (error) {
      console.log('Error deleting file:', error);
    }
  };

  const confirmDelete = (item) => {
    Alert.alert(
      'Delete File',
      `Are you sure you want to delete "${item.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDelete(item) },
      ]
    );
  };

  const handleDelete = (item) => {
    const updatedItems = libraryItems.filter((i) => i.id !== item.id);
    setLibraryItems(updatedItems);
    deleteFile(item.data);
  };

  const handleItemPress = async (item) => {
    try {
      // Pause the current playback
      setupTrackPlayer();
      await TrackPlayer.pause();
      console.log('Playback paused');

      // Play the selected MP3 file
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: item.id,
        url: item.data,
        title: item.title,
      });
      await TrackPlayer.play();
      console.log('Playback started:', item.title);
    } catch (error) {
      console.log('Error playing audio:', error);
    }
  };

  const renderItem = ({ item }) => (
    <Swipeable rightButtons={[<TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item)}>
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>]}>
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => handleItemPress(item)} // Handle item press
      >
        <Text style={styles.titleText}>{item.title}</Text>
      </TouchableOpacity>
    </Swipeable>
  );

  const filterItems = (text) => {
    setSearchText(text);
    // Filter the library items based on the search text
    const filteredItems = libraryItems.filter((item) =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );
    // Update the library items to show the filtered results
    setLibraryItems(filteredItems);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          placeholder="Search"
          value={searchText}
          onChangeText={filterItems}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={libraryItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '80%',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    width: '100%',
  },
});

export default LibraryScreen;
