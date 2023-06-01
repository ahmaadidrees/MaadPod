import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Slider } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMusic, faPlay, faBackward, faForward, faVolumeDown, faVolumeUp, faChromecast, faRandom, faRepeat } from '@fortawesome/free-solid-svg-icons';
import { faChrome } from '@fortawesome/free-brands-svg-icons';

function PlayerScreen() {
  const [volume, setVolume] = useState(0.5); // Initial volume value

  const handleVolumeChange = (value) => {
    setVolume(value);
    // Perform any volume-related actions here, e.g., adjusting the actual audio volume
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <FontAwesomeIcon style={styles.musicIcon} icon={faMusic} size={100} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>0:00</Text>
          <View style={styles.progressBar} />
          <Text style={styles.timeText}>3:30</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Title</Text>
        </View>
        <View style={styles.artistContainer}>
          <Text style={styles.artistText}>Artist</Text>
        </View>
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.controlButton}>
            <FontAwesomeIcon size={30} icon={faBackward} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <FontAwesomeIcon icon={faPlay} size={40} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <FontAwesomeIcon icon={faForward} size={30} />
          </TouchableOpacity>
        </View>
        <View style={styles.sliderContainer}>
          <FontAwesomeIcon style={styles.volumeIcon} icon={faVolumeDown} size={20} />
          <Slider
            style={{ flex: 1 }}
            minimumValue={0}
            maximumValue={1}
            value={volume}
            onValueChange={handleVolumeChange}
            minimumTrackTintColor="blue"
            maximumTrackTintColor="gray"
          />
          <FontAwesomeIcon style={styles.volumeIcon} icon={faVolumeUp} size={20} />
        </View>
        <View style={styles.additionalIconsContainer}>
          <FontAwesomeIcon style={styles.additionalIcon} icon={faRandom} size={20} />
          <FontAwesomeIcon style={styles.additionalIcon} icon={faRepeat} size={20} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  controlsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  controlButton: {
    marginHorizontal: 50,
    marginBottom: 10,
    marginTop: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -10,
  },
  timeText: {
    fontSize: 12,
    color: 'gray',
    marginHorizontal: 5,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'gray',
    marginHorizontal: 10,
    marginBottom: 20,
    marginTop: 20
  },
  sliderContainer: {
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  volumeIcon: {
    marginHorizontal: 10,
  },
  additionalIconsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center'
  },
  additionalIcon: {
    marginHorizontal: 90,
  },
  titleContainer: {
    paddingHorizontal: 45,
    marginTop: 10,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  artistContainer: {
    paddingHorizontal: 45,
  },
  artistText: {
    fontSize: 15,
  },
});

export default PlayerScreen;
