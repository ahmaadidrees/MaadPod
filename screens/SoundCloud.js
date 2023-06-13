import React, { useState } from 'react';
import { View, TextInput, Button, Image, FlatList, TouchableOpacity, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs';

const SoundCloud = ({ libraryItems, setLibraryItems }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const navigation = useNavigation();

  const handleSearch = async () => {
    if (query.trim() === '') {
      return;
    }
   var num = 0;
    try {
      const clientId = 'iZIs9mchVcX5lhVRyQGGAYlNPVldzAoX'; // Replace with your SoundCloud client ID
      const apiUrl = `https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(query)}&client_id=${clientId}`;
  
      const response = await axios.get(apiUrl);
      const tracks = response.data.collection.map((track) => {
        console.log(`Track #${num++}:`, track.permalink_url);
        return {
          id: track.id,
          title: track.title,
          artworkUrl: track.artwork_url,
          url: track.permalink_url,
        };
      });
  
      setResults(tracks);
    } catch (error) {
      console.error('Error searching SoundCloud:', error);
    }
  };
  

  const handleDownload = async (track) => {
    try {
        console.log(track)
      console.log(track.url)  
      const { data } = await axios.post('http://localhost:3000/soundcloud-download', {
        trackId: track.id,
        title: track.title,
        url: track.url
      });
  
      // Access the direct download link from the response data
      const downloadLink = data.downloadLink;
  
      const fileName = `${track.title}.mp3`;
      const documentPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      const downloadOptions = {
        fromUrl: downloadLink,
        toFile: documentPath,
      };
  
      const downloadResult = await RNFS.downloadFile(downloadOptions).promise;
      if (downloadResult.statusCode === 200) {
        console.log('File downloaded successfully:', documentPath);
        const item = { title: track.title, data: documentPath };
        setLibraryItems((prevItems) => [...prevItems, item]);
      } else {
        console.log('Failed to download file');
      }
    } catch (error) {
      console.log('Error downloading audio:', error);
    }
  };
  

  const renderItem = ({ item }) => (
    <View style={styles.resultItem}>
      <Image source={{ uri: item.artworkUrl }} style={styles.thumbnail} />
      <Text style={styles.title}>{item.title}</Text>
      <TouchableOpacity style={styles.downloadButton} onPress={() => handleDownload(item)}>
        <Text style={styles.buttonText}>Download</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Enter soundcloud search"
          value={query}
          onChangeText={setQuery}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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

export default SoundCloud;
