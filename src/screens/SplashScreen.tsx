import { useEffect } from "react";
import { Image, SafeAreaView } from "react-native";

const SplashScreen = ({navigation}:any) => {

    useEffect(()=>{
        setTimeout(() => {
            navigation.navigate('FriendRegister');
        }, 2000); // 2 seconds delay before navigating to the Home screen.
    },[])

    return (
        <SafeAreaView style={{ flex: 1 , backgroundColor: 'white' , alignItems:'center' , justifyContent:'center'}}>
            <Image
                source={require('../assets/celebration.png')}
                style={{
                    height: 100,
                    width: 100,
                    resizeMode: 'contain'
                }}
            />
        </SafeAreaView>
    )
};

export default SplashScreen;