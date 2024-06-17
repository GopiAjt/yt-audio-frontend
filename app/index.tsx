import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, Platform } from 'react-native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function App() {
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const handleDownload = async () => {
    if (!youtubeUrl) {
      Alert.alert('Error', 'YouTube URL is required');
      return;
    }

    try {
      const response = await axios.post('https://yt-audio-backend-fskt.onrender.com/download_audio', { youtube_url: youtubeUrl }, {
        responseType: Platform.OS === 'web' ? 'blob' : 'arraybuffer'
      });

      if (Platform.OS === 'web') {
        // Handle download for web
        const blob = new Blob([response.data], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${youtubeUrl.split('v=')[1]}.mp3`);
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        Alert.alert('Success', 'Audio downloaded successfully');
      } else {
        // Handle download for native platforms
        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        const fileUri = `${FileSystem.documentDirectory}${youtubeUrl.split('v=')[1]}.mp3`;
        
        await FileSystem.writeAsStringAsync(fileUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        Alert.alert('Success', 'Audio downloaded successfully');
        await Sharing.shareAsync(fileUri);
      }

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to download audio');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>YouTube Audio Downloader</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter YouTube URL"
        value={youtubeUrl}
        onChangeText={setYoutubeUrl}
      />
      <Button title="Download Audio" onPress={handleDownload} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
});
