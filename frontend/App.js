import { StatusBar } from "expo-status-bar"
import { Provider } from "react-redux"
import store from "./redux/store"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StyleSheet } from "react-native"
import { Provider as PaperProvider } from "react-native-paper"
import LoginScreen from "./screens/LoginScreen"
import theme from "./utils/PaperTheme"
import HomeScreen from "./screens/HomeScreen"

const Stack = createNativeStackNavigator()
export default function App() {
  return (
    <>
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <StatusBar style="auto" />
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </Provider>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
})
