export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      padding: {
        "6": "6px"
      },
      borderRadius: {
        'custom-16': '16px',
      },
      boxShadow: {
        custom: '0px 1px 4px 0px #0C0C0D0D',
        custom50: `
          0px 4px 12px 0px rgba(255, 255, 255, 0.25) inset,
          0px -4px 12px 0px rgba(255, 255, 255, 0.25) inset,
          var(--sds-size-depth-0) var(--sds-size-depth-100) var(--sds-size-depth-100) var(--sds-size-depth-negative-100) var(--sds-color-black-100),
          var(--sds-size-depth-0) var(--sds-size-depth-400) var(--sds-size-depth-800) var(--sds-size-depth-negative-100) var(--sds-color-black-200)
        `,
        custom60: "0px 2px 6px -1px rgba(0, 0, 0, 0.06)",
        custom510: "0px 2px 8px 0px rgba(0, 0, 0, 0.05), 0px 2px 8px 0px rgba(0, 0, 0, 0.1)",
        custom80: "0px 1px 4px 0px rgba(0, 0, 0, 0.05), 0px 1px 4px 0px rgba(0, 0, 0, 0.1)",
        customMultiple: '0px 0px 3px 0px rgba(0, 0, 0, .25)',
        customShadow: "0px 1px 2px 0px #1F1F1F1F;",
        customCombined: '0px 2px 4px 0px rgba(0, 0, 0, 0.1), 0px 2px 4px 0px rgba(0, 0, 0, 0.2)',
        custom70: "0px 2px 5px rgba(0, 0, 0, 0.06)",
      },
      letterSpacing: {
        'extra-wide': '1px',
      },
      colors: {
        customBlue: 'rgba(0, 122, 255, 1)',
        customBlueLight: "rgba(0, 122, 255, 0.15)",
        customIndigo: "rgba(88, 86, 214, 1)",
        customIndigo100: "rgba(100, 99, 176, 1)",
        customIndigo500: "rgba(100, 99, 176, 0.5)",
        customIndigo120: "rgba(86, 148, 214, 0.12)",
        customIndigo150: "rgba(100, 99, 176, 0.15)",
        customIndigo600: "rgba(86, 148, 214, 0.5)",
        customIndigoLight: "rgba(88, 86, 214, 0.15)",
        customBlack: "rgba(0,0,0,0.2)",
        customBlack1: "rgba(0,0,0,0.12)",
        customBlack2: "rgba(64, 64, 64, 0.25)",
        customBlackLight: "rgba(27, 31, 38, 0.72)",
        customDark: "#000000",
        customDark1: "rgba(30, 30, 30, 1)",
        customBlack1E: "#1E1E1E",
        customGray: "#8080808C",
        customGray1: "rgba(182, 182, 182, 0.25)",
        customGray2: "rgba(120, 120, 128, 0.12)",
        customGrayDark: "rgba(112, 117, 121, 1)",
        customGrayLight: "rgba(235, 237, 240, 1)",
        customGrey1: "rgba(235, 237, 240, 1)",
        customGrey: "rgba(242, 242, 247, 1)",
        customGrey2: "rgba(242, 242, 247, .5)",
        customGrey3: "rgba(242, 242, 247, .12)",
        customGrey4: "rgba(12, 12, 13, 0.05)",
        customGreyLight: "rgba(0, 0, 0, 0.3)",
        customPurple: 'rgba(88, 86, 214, 1)',
        customPurpleLight: "rgba(88, 86, 214, 0.12)",
        customWhite: "rgba(254, 254, 254, 0.25)",
        customWhite121: "rgba(255, 255, 255, 0.12)",
        customWhite120: "rgba(254, 254, 254, 0.12)",
        customWhite1: "rgba(254, 254, 254, 0.6)",
        customWhite2: "rgba(254, 254, 254, 0.45)",
        customWhite3: "rgba(250, 250, 250, 0.5)",
        customRed1: "#FDD3D0",
        customYellow: "rgba(255, 204, 0, 1)",
        customYellow1: "rgba(255, 232, 163, 1)",
        customYellowLight: "rgba(255, 241, 194, 1)",
        customRed: "rgba(255, 59, 48, 1)",
        customRedLight: "rgba(253, 211, 208, 1)", 
        customGreen: "rgba(175, 244, 198, 1)",
      },
      fontSize: {
        "13": "13px"
      },
      backgroundImage: {
        'custom-gradient-blue': 'linear-gradient(180deg, rgba(0, 122, 255, 1) 0%, rgba(88, 86, 214, 1) 100%)',
        'custom-gradient-indigo': 'linear-gradient(to bottom, #5856D6 0%, #7FA7F4 100%)',
      },
      fontFamily: {
        'sfpro': ['"SF Pro Display"','sans-serif'],
      },
      screens: {
        'xsm': '300px',
        'xxsm': '380px',
      },
    },
  },
  plugins: [],
}