import { MD3LightTheme as DefaultTheme } from "react-native-paper"

const secBlue = "#2b464e"
const secOrange = "#FFBA60"
const secGrey = "#868686"

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: secBlue,
    secundary: secOrange,
    grey: secGrey,
  },
}

export default theme
