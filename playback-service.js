import TrackPlayer from 'react-native-track-player';

module.exports = async function () {
  TrackPlayer.addEventListener('remote-play', () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener('remote-pause', () => {
    TrackPlayer.pause();
  });

  // Add more event listeners for other playback controls if needed

  TrackPlayer.addEventListener('remote-stop', () => {
    TrackPlayer.destroy();
  });

  TrackPlayer.addEventListener('remote-seek', async (event) => {
    await TrackPlayer.seekTo(event.position);
  });

  TrackPlayer.addEventListener('playback-queue-ended', () => {
    // Queue has ended, handle as needed (e.g., loop, shuffle)
  });

  // Add more event listeners for playback events as desired

  return Promise.resolve();
};
