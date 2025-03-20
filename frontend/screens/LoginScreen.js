import { StyleSheet, Text, View, Image } from "react-native"
import React, { useState, useFocusEffect, useCallback } from "react"
import { getRandomImage } from "../utils/Utils"

export default function LoginScreen() {
  const [randomImage, setRandomImage] = useState(null)

  useFocusEffect(
    useCallback(() => {
      setRandomImage(getRandomImage)
    }, [])
  )

  return (
    <View style={styles.container}>
      <Image source={randomImage} style={styles.backgroundImage} />
      <View style={styles.overlay}>
        <Text style={styles.title}> Welcome</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
})
