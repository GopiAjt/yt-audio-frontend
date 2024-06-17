import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
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
      const response = await axios.post('http://your-server-ip:5000/download_audio', { youtube_url: youtubeUrl }, {
        responseType: 'blob'
      });

      const fileUri = `${FileSystem.documentDirectory}${youtubeUrl.split('v=')[1]}.mp3`;
      await FileSystem.writeAsStringAsync(fileUri, response.data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      Alert.alert('Success', 'Audio downloaded successfully');
      await Sharing.shareAsync(fileUri);

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
