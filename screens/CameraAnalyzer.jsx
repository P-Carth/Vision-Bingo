// CameraAnalyzer.js
import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Gpt from '../services/Gpt'; // Ensure you have a Gpt.js that exports an instance of a Gpt class

const CameraAnalyzer = ({route, navigation}) => {
  const cameraRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const [hasPermission, setHasPermission] = useState(null);
  const [imageUri, setImageUri] = useState(null); // State to hold the captured image URI
  const [successMessage, setSuccessMessage] = useState('');

  const {itemName, onAnalysisComplete} = route.params;

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        const res = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        setHasPermission(res === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        setHasPermission(true);
      }
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const takePicture = async () => {
    if (cameraRef.current && !isRecording) {
      setIsRecording(true);
      setIsLoading(true); // Start loading
      try {
        const options = {quality: 0.5, base64: true};
        const data = await cameraRef.current.takePictureAsync(options);

        setImageUri(data.uri); // Save the image URI to state

        const imageBase64 = data.base64;
        const messages = [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `is there a ${itemName} in this image? True or False`,
              },
              {
                type: 'image_url',
                image_url: `data:image/jpg;base64,${imageBase64}`,
              },
            ],
          },
        ];

        const result = await Gpt.createChatCompletion(messages);

        console.log('result', result);

        if (result.choices && result.choices.length > 0) {
          const analysisResult = result.choices[0].message.content;
          const foundItem = analysisResult.toLowerCase().includes('true');
          onAnalysisComplete(foundItem, data.uri); // Pass image URI
          // Set a success message
          setSuccessMessage(foundItem ? 'Item found! ✅' : 'Item not found ❌');
        } else {
          onAnalysisComplete(false);
          setSuccessMessage('Analysis failed ❌');
        }
      } catch (error) {
        console.error('Error processing image:', error);
        onAnalysisComplete(false);
        setSuccessMessage('Error processing image ❌');
      } finally {
        setIsLoading(false); // Stop loading regardless of the result
        // Wait for a short period before navigating back
        setTimeout(() => {
          setSuccessMessage(''); // Reset the success message
          setIsRecording(false);
          navigation.goBack(); // Go back after processing is complete
        }, 2000); // 2 seconds delay
      }
    }
  };

  // Render the loading indicator when the image is being processed
  // Update the loading indicator render to include the success message
  if (isLoading || successMessage) {
    return (
      <View style={styles.loadingContainer}>
        {imageUri && (
          <Image source={{uri: imageUri}} style={styles.capturedImage} />
        )}
        <Text style={styles.loadingText}>
          {isLoading ? 'Inspecting image...' : successMessage}
        </Text>
        {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      </View>
    );
  }

  // Camera UI
  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.auto}
        captureAudio={false}
      />
      <TouchableOpacity onPress={takePicture} style={styles.capture}>
        <Text style={styles.buttonText}> SNAP </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    position: 'absolute', // Position absolutely
    bottom: 20, // Distance from the bottom
    margin: 20,
  },
  buttonText: {
    fontSize: 14,
    color: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  capturedImage: {
    width: '100%', // You might want to adjust this depending on your layout
    aspectRatio: 1, // Keep the aspect ratio of the image
  },
  loadingText: {
    fontSize: 18,
    color: 'white',
    marginTop: 20,
  },
});

export default CameraAnalyzer;
