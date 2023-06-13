import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Slider } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMusic, faPlay, faBackward, faForward, faVolumeDown, faVolumeUp, faRandom, faRepeat } from '@fortawesome/free-solid-svg-icons';
import Sound from 'react-native-sound';

function PlayerScreen() {
  const [volume, setVolume] = useState(0.5); // Initial volume value
  const [sound, setSound] = useState(null); // Sound instance
  const [expanded, setExpanded] = useState(false); // Player state (expanded or condensed)

  const handleVolumeChange = (value) => {
    setVolume(value);
    // Perform any volume-related actions here, e.g., adjusting the actual audio volume
  };

 

  const toggleExpanded = () => {
    setExpanded((prevState) => !prevState);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={toggleExpanded}>
      <View style={expanded ? styles.expandedContainer : styles.condensedContainer}>
        <View style={styles.topContainer}>
          <FontAwesomeIcon style={styles.musicIcon} icon={faMusic} size={100} />
        </View>

        {expanded ? (
          <View style={styles.contentContainer}>
            <View style={styles.controlsContainer}>
              <TouchableOpacity style={styles.controlButton}>
                <FontAwesomeIcon size={30} icon={faBackward} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={handlePlay}>
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
        ) : (
          <View style={styles.condensedContentContainer}>
            <TouchableOpacity style={styles.condensedControlButton} onPress={handlePlay}>
              <FontAwesomeIcon icon={faPlay} size={20} />
            </TouchableOpacity>
            <Slider
              style={styles.condensedSlider}
              minimumValue={0}
              maximumValue={1}
              value={volume}
              onValueChange={handleVolumeChange}
              minimumTrackTintColor="blue"
              maximumTrackTintColor="gray"
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  condensedContainer: {
    backgroundColor: 'blue',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedContainer: {
    backgroundColor: 'blue',
    height: '100%',
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
    justifyContent: 'center',
  },
  additionalIcon: {
    marginHorizontal: 90,
  },
  condensedContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  condensedControlButton: {
    marginRight: 10,
  },
  condensedSlider: {
    flex: 1,
    marginHorizontal: 10,
  },
});

export default PlayerScreen;
