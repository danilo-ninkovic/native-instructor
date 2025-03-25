import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { TextInput, IconButton, useTheme } from "react-native-paper";
import { getRandomImage } from "../utils/Utils";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");
export default function LoginScreen({ navigation }) {
  const theme = useTheme();
  const [randomImage, setRandomImage] = useState(null);
  const [text, setText] = useState("");

  useFocusEffect(
    useCallback(() => {
      setRandomImage(getRandomImage);
    }, [])
  );

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
      <View style={styles.overlay}>
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
              onPress={() => navigation.navigate("Home")}
              color={theme.colors.secondary}
            />
          }
        />
      </View>
    </View>
  );
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
});
