import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, Alert, Platform, PermissionsAndroid, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera } from 'react-native-image-picker';

const FriendRegister = ({navigation}:any) => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [photo, setPhoto] = useState(null);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    const data = await AsyncStorage.getItem('friends');
    if (data) {
      setFriends(JSON.parse(data));
    }
  };

  const saveFriend = async () => {
    if (!name || !id || !photo) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const newFriend = { id, name, photo };
    const updatedFriends: any = [...friends, newFriend];

    await AsyncStorage.setItem('friends', JSON.stringify(updatedFriends));
    setFriends(updatedFriends);
    setName('');
    setId('');
    setPhoto(null);
  };

  const takePhoto = () => {
    console.log('57587578==========')
    launchCamera({ mediaType: 'photo', cameraType: 'back' }, (response: any) => {
      if (response.assets) {
        setPhoto(response.assets[0].uri);
      }
    });
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'App Camera Permission',
            message: 'App needs access to your camera ',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          takePhoto();
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else if (Platform.OS === 'ios') {
      takePhoto();
    }
  };

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'white'}}>
      <Button title="FaceRecognization" onPress={() => navigation.navigate('FaceRecognization')} />
      <View style={{ padding: 20 }}>
        <Text>Register Friend</Text>
        <TextInput placeholder="ID" placeholderTextColor='grey' value={id} onChangeText={setId} style={{ borderWidth: 1, marginBottom: 10, padding: 5 , color:'black'}} />
        <TextInput placeholder="Name" placeholderTextColor='grey' value={name} onChangeText={setName} style={{ borderWidth: 1, marginBottom: 10, padding: 5 , color:'black'}} />

        <Button title="Take Photo" onPress={requestCameraPermission} />
        {photo && <Image source={{ uri: photo }} style={{ width: 100, height: 100, marginVertical: 10 }} />}

        <Button title="Save Friend" onPress={saveFriend} />

        <Text style={{ marginTop: 20 }}>Invited Friends</Text>
        <FlatList
          data={friends}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
              <Image source={{ uri: item.photo }} style={{ width: 50, height: 50, marginRight: 10 }} />
              <Text>{item.name} (ID: {item.id})</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default FriendRegister;
