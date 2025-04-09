import { StyleSheet, Text, View, Image, Dimensions } from "react-native"
import React, { useState, useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useFocusEffect } from "@react-navigation/native"
import { TextInput, useTheme } from "react-native-paper"
import { getRandomImage } from "../utils/Utils"
import Ionicons from "@expo/vector-icons/Ionicons"
import { checkName } from "../redux/userSlice"

const { width, height } = Dimensions.get("window")
export default function LoginScreen({ navigation }) {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { loading, checkedUser, error } = useSelector((state) => state.user)
  const [randomImage, setRandomImage] = useState(null)
  const [text, setText] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  useFocusEffect(
    useCallback(() => {
      setRandomImage(getRandomImage)
    }, [])
  )

  // ovo treba tek nakon unosa passworda da se ide u Home screen
  //i treba UserInfo  nako login(name, password) umjesto  sheckedUser
  /*   useEffect(() => {
     checkedUser && navigation.navigate("Home") 
    error && console.log(error)
  }, [checkedUser, error]) */

  const togglePasswordVisibility = () => {
    setShowPassword(!setPassword)
  }

  const PressHandler = () => {
    dispatch(checkName(text))
  }

  const input = (
    <TextInput
      value={text}
      onChangeText={setText}
      label="Korisnik"
      mode="flat"
      style={styles.input}
      theme={{
        colors: {
          primary: theme.colors.secondary, // Boja bordera
          onSurfaceVariant: theme.colors.secondary,
        },
      }}
      selectionColor={theme.colors.secondary} // Boja selekcije (kursor)
      textColor={theme.colors.secondary}
      right={
        <TextInput.Icon
          icon="send"
          onPress={PressHandler}
          color={theme.colors.secondary}
        />
      }
    />
  )

  const passwordInput = (
    <TextInput
      label="Lozinka"
      value={password}
      onChangeText={setPassword}
      mode="flat"
      style={styles.input}
      theme={{
        colors: {
          primary: theme.colors.secondary, // Boja bordera
          onSurfaceVariant: theme.colors.secondary,
        },
      }}
      selectionColor={theme.colors.secondary} // Boja selekcije (kursor)
      textColor={theme.colors.secondary}
      secureTextEntry={!showPassword} // Prikazuje lozinku ili je sakriva
      right={
        <TextInput.Icon
          icon={showPassword ? "eye-off" : "eye"} // Menja ikonu na osnovu stanja
          onPress={togglePasswordVisibility}
          color={theme.colors.secondary}
        />
      }
    />
  )

  return (
    <View style={styles.container}>
      <Image source={randomImage} style={styles.backgroundImage} />
      <Ionicons
        name="person-circle-outline"
        size={60}
        color={theme.colors.secondary}
      />
      <Text style={[styles.title, { color: theme.colors.secondary }]}>
        LOGIN
      </Text>
      <View style={styles.overlay}>{!checkedUser ? input : passwordInput}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: height * 0.2,
  },
  backgroundImage: {
    position: "absolute",
    width: width, // Širina ekrana
    height: height, // Visina ekrana
    resizeMode: "cover", // Osigurava da slika pokrije cijeli ekran
  },
  title: {
    color: "white",
    fontSize: 24,
    alignItems: "center",
    marginBottom: 30,
  },
  overlay: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  input: {
    width: "80%",
    backgroundColor: "transparent",

    marginBottom: 10,
  },
})
