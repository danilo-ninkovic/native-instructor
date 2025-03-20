const images = [
  require("../assets/g1.jpg"),
  require("../assets/g2.jpg"),
  require("../assets/g3.jpg"),
  require("../assets/g4.jpg"),
  require("../assets/g5.jpg"),
  require("../assets/g6.jpg"),
  require("../assets/g7.jpg"),
]

export const getRandomImage = () =>
  images[Math.floor(Math.random() * images.length)]
