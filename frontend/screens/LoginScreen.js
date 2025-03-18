import { StyleSheet, Text, View } from "react-native"
import React, { useState } from "react"
import CustomTextInput from "../components/basics/CustomTextInput"

export default function LoginScreen() {
  const [text, setText] = useState("")
  const [password, setPassword] = useState("")
  return (
    <View>
      <Text>LoginScreen</Text>
      <CustomTextInput
        label="Username"
        value={text}
        onChangeText={setText}
        placeholder="Enter your username"
      />
      <CustomTextInput
        label="Password"
        isPassword={true}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
      />
    </View>
  )
}

const styles = StyleSheet.create({})
