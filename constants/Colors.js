const tintColor = '#f7b733', //active icon color
      buttonBG_light = "#669999",
      buttonBG_dark = "#000",
      text_light = "#fff",
      text_dark = "#fff",
      backgroundGrad_light = ['#F2994A', '#F2C94C'],
      backgroundGrad_dark = ['#000', '#000'],
      noteIcon_light = "#334d4d",
      noteIcon_dark = "#fff",
      listItem_light = "#66999980",
      listItem_dark = "#66999980",
      playerBG_light = "#669999",
      playerBG_dark = "#669999",
      spinner_light = "#fff",
      spinner_dark = "#fff";

export default {
  tintColor,
  tabIconDefault: '#fff',
  tabIconSelected: tintColor,
  tabBar: '#fefefe',
  errorBackground: 'red',
  errorText: '#fff',
  warningBackground: '#EAEB5E',
  warningText: '#666804',
  noticeBackground: tintColor,
  noticeText: '#fff',
};

export const lightTheme = {
  theme: "light",
  buttonBG:buttonBG_light,
  text: text_light,
  backgroundGrad: backgroundGrad_light,
  noteIcon: noteIcon_light,
  listItem: listItem_light,
  playerBG: playerBG_light,
  spinner: spinner_light,
}
export const darkTheme = {
  theme: "dark",
  buttonBG:buttonBG_dark,
  text: text_dark,
  backgroundGrad: backgroundGrad_dark,
  noteIcon: noteIcon_dark,
  listItem: listItem_dark,
  playerBG: playerBG_dark,
  spinner: spinner_dark,
}
