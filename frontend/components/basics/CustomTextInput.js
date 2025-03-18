import React, { useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

export default function CustomTextInput({
  label,
  isPassword = false,
  ...props
}) {
  const [secureText, setSecureText] = useState(isPassword)
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          secureTextEntry={secureText}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setSecureText(!secureText)}>
            <Icon name={secureText ? "eye-off" : "eye"} size={20} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
})
