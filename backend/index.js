const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const soundcloudDL = require('soundcloud-dl');
const soundcloudDownloader = require('soundcloud-downloader');
const soundcloudScraper = require('soundcloud-scraper');
const axios = require('axios');
const { exec } = require('child_process');
const sckey = require('soundcloud-key-fetch');





const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post('/download-link', (req, res) => {
  const { videoId, title } = req.body;
  const fileName = `${title}.mp3`;

  const videoURL = `https://www.youtube.com/watch?v=${videoId}`;
  const audioStream = ytdl(videoURL, { filter: 'audioonly' });

  ffmpeg(audioStream)
    .audioBitrate('192k')
    .audioFrequency(44100)
    .outputOptions('-map 0:a')
    .saveToFile(fileName)
    .on('end', () => {
      const filePath = path.resolve(fileName);

      // Generate the direct download link
      const downloadLink = `http://localhost:3000/download/${encodeURIComponent(fileName)}`;

      // Send the download link as the response
      res.json({ downloadLink });
    })
    .on('error', (error) => {
      console.error('Error extracting audio:', error);
      res.status(500).send('Error extracting audio');
    });
});

app.get('/download/:fileName', (req, res) => {
  const fileName = decodeURIComponent(req.params.fileName);
  const filePath = path.resolve(fileName);

  // Set the appropriate headers for the response
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);

  // Send the audio file as the response
  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
});

// app.post('/soundcloud-download', async (req, res) => {
//     const { trackId, title , url} = req.body;
//     const fileName = `${title}.mp3`;
    
//     try {
//         const clientId = 'iZIs9mchVcX5lhVRyQGGAYlNPVldzAoX'; // Replace with your SoundCloud client ID
//         const anotherClientId = 'zCEEXZhOnotqick3yiRUAN1DAl34xbSD';
       
//         const apiUrl = `https://api-v2.soundcloud.com/tracks/${trackId}/stream?client_id=${clientId}`;
      
//     //   const response = await axios.get(apiUrl);
//     //   const audioUrl = response.data.media.transcodings[0].url;
    
//       const filePath = path.resolve(fileName);
//     console.log(`url: ${url}`)
//       const writer = fs.createWriteStream(filePath);
//       const responseStream = await axios({
//         method: 'get',
//         url: url,
//         responseType: 'stream',
//         headers:{
//             'Authorization': `Client-ID ${clientId}`
//         }
//       });
    
//       responseStream.data.pipe(writer);
    
//       writer.on('finish', () => {
//         // Send the download link as the response
//         const downloadLink = `http://localhost:3000/download/${encodeURIComponent(fileName)}`;
//         res.json({ downloadLink });
//       });
    
//       writer.on('error', (error) => {
//         console.error('Error downloading SoundCloud track:', error);
//         res.status(500).send('Error downloading SoundCloud track');
//       });
//     } catch (error) {
//       console.error('Error retrieving track information:', error);
//       res.status(500).send('Error retrieving track information');
//     }
//   });
  
app.post('/soundcloud-download', async (req, res) => {
    const { trackId, title, url } = req.body;
    const fileName = `${title}.mp3`;
    const command = `youtube-dl --extract-audio --audio-format mp3 --output "${fileName}" --default-search "ytsearch" --postprocessor-args "-c:a aac" "${url}"`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Error downloading SoundCloud track:', error);
        res.status(500).send('Error downloading SoundCloud track');
        return;
      }
      
      console.log('stdout:', stdout);
      console.error('stderr:', stderr);
      
      const downloadLink = `http://localhost:3000/download/${encodeURIComponent(fileName)}`;
      res.json({ downloadLink });
    });
  });
  
  
  

app.post('/klickaud-download', async (req, res) => {
    const { trackId, title } = req.body;
    const fileName = `${title}.mp3`;
  
    try {
      const klickaudURL = `https://www.klickaud.co/download.php`;
  
      const response = await axios.post(klickaudURL, { url: trackId });
  
      const downloadLink = response.data.downloadlink;
      if (!downloadLink) {
        console.error('Error retrieving download link from KlickAud');
        res.status(500).send('Error retrieving download link from KlickAud');
        return;
      }
  
      const filePath = path.resolve(fileName);
      const writer = fs.createWriteStream(filePath);
  
      const downloadProcess = exec(`wget -O "${filePath}" "${downloadLink}"`);
  
      downloadProcess.on('exit', () => {
        // Send the download link as the response
        const downloadLink = `http://localhost:3000/download/${encodeURIComponent(fileName)}`;
        res.json({ downloadLink });
      });
  
      downloadProcess.on('error', (error) => {
        console.error('Error downloading SoundCloud track:', error);
        res.status(500).send('Error downloading SoundCloud track');
      });
    } catch (error) {
      console.error('Error retrieving track information:', error);
      res.status(500).send('Error retrieving track information');
    }
  });
