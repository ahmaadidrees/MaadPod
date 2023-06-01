import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, FlatList, StyleSheet } from 'react-native';
import RNFS from 'react-native-fs';
import ytdl from 'react-native-ytdl';

function LibraryScreen({ navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [libraryItems, setLibraryItems] = useState([
   
  ]);
  const [searchText, setSearchText] = useState('');

  const handlePaste = async () => {
    const text = await Clipboard.getString();
    setUrl(text);
  };

  const handleDownload = async () => {
    try {
      const videoInfo = await ytdl.getInfo(url);
      const audioFormats = ytdl.filterFormats(videoInfo.formats, 'audioonly');
      if (audioFormats.length > 0) {
        const audioFormat = audioFormats[0];
        const { title, artist, id } = videoInfo.videoDetails;
        const fileName = `${title.replace(/[^\w\s]/gi, '')}_${id}.${audioFormat.container}`;
        const fileUri = `${RNFS.DocumentDirectoryPath}/${fileName}`;

        const downloadOptions = {
          fromUrl: audioFormat.url,
          toFile: fileUri,
        };

        const downloadTask = RNFS.downloadFile(downloadOptions);

        downloadTask.promise
          .then((res) => {
            // Download completed
            const newItem = { id: Date.now().toString(), title, artist, fileUri };
            setLibraryItems((prevItems) => [...prevItems, newItem]);
            setIsModalVisible(false);
          })
          .catch((error) => {
            console.log('Download error:', error);
          });
      } else {
        console.log('No audio formats available for the given YouTube URL.');
      }
    } catch (error) {
      console.log('Error retrieving YouTube video info:', error);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 50 }}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={{ fontSize: 18 }}>+</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.titleText}>{item.title}</Text>
      <Text style={styles.artistText}>{item.artist}</Text>
    </View>
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

      <Modal visible={isModalVisible} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity
            style={{ position: 'absolute', top: 50, right: 50 }}
            onPress={() => setIsModalVisible(false)}
          >
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'turquoise' }}>x</Text>
          </TouchableOpacity>
          <View style={{ alignSelf: 'flex-start', marginLeft: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ textAlign: 'left' }}>Url:</Text>
              <TextInput
                placeholder="URL"
                value={url}
                onChangeText={setUrl}
                autoCapitalize="none"
                editable={true}
                onPaste={handlePaste}
                style={{
                  height: 40,
                  borderColor: 'gray',
                  borderWidth: 1,
                  marginLeft: 25,
                  width: '80%',
                  borderRadius: 10,
                  marginBottom: 10,
                }}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ textAlign: 'left' }}>Title:</Text>
              <TextInput
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                style={{
                  height: 40,
                  borderColor: 'gray',
                  borderWidth: 1,
                  marginLeft: 15,
                  width: '80%',
                  borderRadius: 10,
                  marginBottom: 10,
                }}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ textAlign: 'left' }}>Artist:</Text>
              <TextInput
                placeholder="Artist"
                value={artist}
                onChangeText={setArtist}
                style={{
                  height: 40,
                  borderColor: 'gray',
                  borderWidth: 1,
                  marginLeft: 10,
                  width: '80%',
                  borderRadius: 10,
                  marginBottom: 10,
                }}
              />
            </View>
          </View>

          {/* Add an option to select an image from the device */}
          {/* Implement image selection logic here */}

          <TouchableOpacity
            style={{
              borderColor: 'turquoise',
              backgroundColor: 'turquoise',
              borderWidth: 1,
              width: '90%',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
            }}
            onPress={handleDownload}
          >
            <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>Download</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  artistText: {
    fontSize: 15,
  },
  listContainer: {
    width: '100%',
  },
});

export default LibraryScreen;
