import React, { useEffect, useState, useRef } from 'react';
import { View, Text, PermissionsAndroid, Platform } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FaceDetection from '@react-native-ml-kit/face-detection';

const FaceRecognitionScreen = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [recognizedFriends, setRecognizedFriends] = useState([]);

  console.log('recognized =====> ',recognizedFriends)

  const [faceCount, setFaceCount] = useState(0);
  const [device, setDevice] = useState(null);
  const devices = useCameraDevices();
  const cameraRef = useRef(null);

  // ✅ Request Camera Permission
  const requestCameraPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const alreadyGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
        if (alreadyGranted) {
          setHasPermission(true);
          return true;
        }
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      setHasPermission(true);
      return true;
    } catch (error) {
      console.warn('Permission request error:', error);
      return false;
    }
  };

  // ✅ Initialize Camera
  useEffect(() => {
    const initializeCamera = async () => {
      const permission = await requestCameraPermission();
      if (permission && devices) {
        const cameraDevice = devices.find((d) => d.position === 'front'); // Always use back camera
        if (cameraDevice) {
          setDevice(cameraDevice);
        } else {
          console.log('No Camera Available');
        }
      }
    };
    initializeCamera();
  }, [devices]);

  // ✅ Face Detection with Friend Matching
  useEffect(() => {
    const interval = setInterval(async () => {
      if (cameraRef.current) {
        try {
          const photo = await cameraRef.current.takePhoto();
          const faces = await FaceDetection.detect(`file://${photo.path}`, { landmarkMode: 'all' });

          console.log('Detected Faces:', faces);
          setFaceCount(faces.length);

          if (faces.length > 0) {
            const storedFriends = await AsyncStorage.getItem('friends');
            const friendsList = storedFriends ? JSON.parse(storedFriends) : [];

            // Compare detected faces with stored friends
            const matchedFriends = friendsList.filter((friend) =>
              faces.some((face) => isFaceMatch(face.boundingBox, friend.faceData))
            );

            console.log('Matched Friends:', matchedFriends);

            setRecognizedFriends(matchedFriends);
          } else {
            setRecognizedFriends([]);
          }
        } catch (error) {
          console.log('Face detection error:', error);
        }
      }
    }, 2000); // Runs every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // ✅ Function to Check Face Match
  const isFaceMatch = (detectedBoundingBox, storedBoundingBox) => {
    if (!storedBoundingBox) return false;

    return (
      Math.abs(detectedBoundingBox.x - storedBoundingBox.x) < 10 &&
      Math.abs(detectedBoundingBox.y - storedBoundingBox.y) < 10 &&
      Math.abs(detectedBoundingBox.width - storedBoundingBox.width) < 10 &&
      Math.abs(detectedBoundingBox.height - storedBoundingBox.height) < 10
    );
  };

  // ✅ Render UI
  if (!device) return <Text>No camera available</Text>;
  if (!hasPermission) return <Text>No permission to access camera</Text>;

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} device={device} isActive={true} ref={cameraRef} photo={true} />
      <View style={{ position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 5 }}>
        <Text style={{ color: 'white' }}>Faces Detected: {faceCount}</Text>
      </View>
      {recognizedFriends.length > 0 && (
        <View style={{ position: 'absolute', bottom: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 5 }}>
          {recognizedFriends.map((friend) => (
            <Text key={friend.id} style={{ color: 'white' }}>
              {friend.name} (ID: {friend.id})
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default FaceRecognitionScreen;
