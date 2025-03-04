import { NavigationContainer } from "@react-navigation/native"
import StackNavigator from "./StackNavigator"
import FriendRegister from "./src/screens/FriendRegister"

const App = () =>{
  return(
    <NavigationContainer>
      <StackNavigator/>
    </NavigationContainer>
  )
}

export default App;