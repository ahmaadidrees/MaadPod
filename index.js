import TrackPlayer from 'react-native-track-player';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import playbackService from './playback-service'


// Register the playback service
TrackPlayer.registerPlaybackService(() => playbackService );

AppRegistry.registerComponent(appName, () => App);
