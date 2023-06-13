import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Image, FlatList, TouchableOpacity, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';
import  copyFile  from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import TrackPlayer from 'react-native-track-player';
import { AsyncStorage } from 'react-native'; // Import AsyncStorage


// import { NativeModules } from 'react-native';
// import ytdl from 'react-native-ytdl';
// import RNFS from 'react-native-fs';


const SearchScreen = ({libraryItems, setLibraryItems}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const navigation = useNavigation();

  const handleSearch = () => {
    if (query.trim() === '') {
      return;
    }

    const API_KEY = 'AIzaSyBQQjECbvL3uVyKjD1opciH_AmnI9XP1Aw'; // Replace with your actual YouTube API key
    const maxResults = 10;

    axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${API_KEY}`
    )
      .then((response) => {
        setResults(response.data.items);
      })
      .catch((error) => {
        console.error('Error searching YouTube:', error);
      });
  };

  const renderItem = ({ item }) => (
    <View style={styles.resultItem}>
      <Image source={{ uri: item.snippet.thumbnails.default.url }} style={styles.thumbnail} />
      <Text style={styles.title}>{item.snippet.title}</Text>
      <TouchableOpacity style={styles.downloadButton} onPress={() => handleDownload(item.id.videoId, item.snippet.title)}>
        <Text style={styles.buttonText}>Download</Text>
      </TouchableOpacity>
    </View>
  );

//   const { RNFS } = NativeModules;

// const handleDownload = async (videoId, title) => {
//     try {
//       const response = await axios.post('http://localhost:3000/download', { videoId, title });
//       console.log(title);
//       const item = {title: title, data: response.data};
//       setLibraryItems((prevItems) => [...prevItems, item]);
//     } catch (error) {
//       console.log('Error downloading audio:', error);
//     }
//   };

// useEffect(() => {
//     // Register a listener for the "playback-error" event
//     TrackPlayer.addEventListener('playback-error', (error) => {
//       console.log('Playback error:', error);
//       // Handle the error or display an error message to the user
//     });

//     return () => {
//       // Clean up the event listener when the component is unmounted
//       TrackPlayer.removeEventListener('playback-error');
//     };
//   }, []);
// useEffect(() => {
//     TrackPlayer.setupPlayer();
//   }, []);
const setupTrackPlayer = async () => {
    await TrackPlayer.setupPlayer();
    // Additional setup configurations can be done here if needed
  };
const handleDownload = async (videoId, title) => {
    try {
    //   setupTrackPlayer();
      // Make a request to your backend API to retrieve the direct download link
      const response = await axios.post('http://localhost:3000/download-link', { videoId, title });
      const downloadLink = response.data.downloadLink;
  
      // Download the file using RNFS.downloadFile
      const fileName = `${title}.mp3`;
      const documentPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      const downloadOptions = {
        fromUrl: downloadLink,
        toFile: documentPath,
      };
  
      const downloadResult = await RNFS.downloadFile(downloadOptions).promise;
      if (downloadResult.statusCode === 200) {
        console.log('File downloaded successfully:', documentPath);
        // Store the title and file path in AsyncStorage
        // const libraryItem = { title, data: documentPath };
        // await AsyncStorage.setItem(videoId, JSON.stringify(libraryItem));
        // Add the downloaded track to the playback queue
        // await TrackPlayer.add({
        //   id: videoId,
        //   url: documentPath,
        //   title: title,
        // });
  
        // Start playing the track
        // await TrackPlayer.play();
  
        // const item = { title: title, data: documentPath };
        // setLibraryItems(prevItems => [...prevItems, item]);
      } else {
        console.log('Failed to download file');
      }
    } catch (error) {
      console.log('Error downloading audio:', error);
    }
  };
  
  
  
  
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Enter youtube search"
          value={query}
          onChangeText={setQuery}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.videoId}
        contentContainerStyle={styles.resultsContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchBar: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  resultsContainer: {
    flexGrow: 1,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  thumbnail: {
    width: 80,
    height: 60,
    marginRight: 10,
  },
  title: {
    flex: 1,
    fontSize: 16,
  },
  downloadButton: {
    padding: 8,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SearchScreen;
