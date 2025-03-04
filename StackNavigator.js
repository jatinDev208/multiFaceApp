import { createNativeStackNavigator } from "@react-navigation/native-stack"
import FriendRegister from "./src/screens/FriendRegister";
import SplashScreen from "./src/screens/SplashScreen";
import FaceRecognitionScreen from "./src/screens/FaceRecognization";

const StackNavigator = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="FriendRegister" component={FriendRegister} />
            <Stack.Screen name="FaceRecognization" component={FaceRecognitionScreen} />
        </Stack.Navigator>
    )
};

export default StackNavigator;
