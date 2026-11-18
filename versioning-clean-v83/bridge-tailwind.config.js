export default {
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
      },
      screens: {
        tablet: "600px", // => @media (min-width: 600px)
        desktop: "900px", // => @media (min-width: 900px)
        desktopLarge: "1200px", // => @media (min-width: 1200px)
      },
      spacing: {
        // OLD -- TO DELETE REPLACE with 16
        15: "3.75rem",
        // TOKENS -- TO DELETE
        none: 0,
        xxxxxs: 2,
        //x-1
        xxxxs: 4,
        //x-2
        xxxs: 8,
        xxs: 10,
        //x-3
        xs: 12,
        s: 14,
        //x-4
        sm: 16,
        //x-5
        m: 20,
        //x-6
        ml: 24,
        //x-8
        l: 32,
        //x-10
        xl: 40,
        //x-12
        xxl: 48,
        //x-14
        xxxl: 56,
        //x-16
        xxxxl: 64,
      },
      borderRadius: {
        // OLD
        "1/2": "50%",
        "3xs": "1px",
        // TOKENS
        none: 0,
        xs: 2,
        s: 4,
        m: 6,
        l: 8,
        xl: 10,
        xxl: 12,
        full: 360,
      },
      display: ["group-hover"],
      fontSize: {
        xxs: "10px",
      },
      transitionProperty: {
        right: "right",
      },
      width: {
        21: "5.5rem",
        26: "6.5rem", // 104px
        35: "8.75rem", // 140px
        50: "12.5rem", // 200px
        84: "21rem",
        116: "29rem",
      },
      height: {
        15: "3.75rem", // 60px
        21: "5.5rem", // 88px
        26: "6.5rem", // 104px
        35: "8.75rem", // 140px
        45: "11.25rem", // 180px
        50: "12.5rem", // 200px
        86: "21.5rem", // 344px
      },
      maxWidth: {
        88: "88vw",
        84: "21rem",
        116: "29rem",
        130: "32.5rem",
      },
      zIndex: {
        "-1": "-1",
      },
      strokeWidth: {
        5: "5",
      },
      backgroundSize: {
        "60%": "60%",
        "95%": "95%",
      },
      animation: {
        shake: "shake 0.5s ease-in-out",
        marquee: "marquee var(--marquee-duration, 20s) linear infinite", // Animation duration variable is configured in ScrollingTitle
        rotate: "rotate 2s linear infinite",
        dash: "dash 1.5s ease-in-out infinite",
        dots: "dots 2s linear infinite",
        shineLine: "shineLine 1.5s infinite linear",
        shineSquare: "shineSquare 1.5s infinite linear",
        eqBar: "eqBar 1s ease-in-out infinite",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "15%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        rotate: {
          "100%": { transform: "rotate(360deg)" },
        },
        dash: {
          "0%": { strokeDasharray: "1, 150", strokeDashoffset: "0" },
          "50%": { strokeDasharray: "90, 150", strokeDashoffset: "-35" },
          "100%": { strokeDasharray: "90, 150", strokeDashoffset: "-124" },
        },
        dots: {
          "0%, 20%": { content: "'.'" },
          "40%": { content: "'..'" },
          "60%": { content: "'...'" },
          "90%, 100%": { content: "''" },
        },
        // Skeleton
        shineLine: {
          "0%": {
            backgroundPosition: "-130%",
          },
          "100%": {
            backgroundPosition: "230%",
          },
        },
        // Skeleton
        shineSquare: {
          "0%": {
            backgroundPosition: "-1500%",
          },
          "100%": {
            backgroundPosition: "1500%",
          },
        },
        // Playing track equalizer bars (min/max height overridden per bar via CSS variables)
        eqBar: {
          "0%, 100%": { height: "var(--eq-bar-min, 30%)" },
          "50%": { height: "var(--eq-bar-max, 100%)" },
        },
      },
      boxShadow: {
        "down-01": "0px 1px 2px rgba(52, 43, 61, 0.05), 0px 2px 4px rgba(52, 43, 61, 0.05)",
        "down-03":
          "0px 1px 2px rgba(52, 43, 61, 0.05), 0px 2px 4px rgba(52, 43, 61, 0.05), 0px 4px 8px rgba(52, 43, 61, 0.05), 0px 8px 16px rgba(52, 43, 61, 0.05)",
        "up-01": "0px -1px 2px rgba(52, 43, 61, 0.05), 0px -2px 4px rgba(52, 43, 61, 0.05)",
        "up-02": "0px -1px 2px rgba(37,36,40,0.05), 0 -2px 4px rgba(37,36,40,0.05)",
        "elevation-up-hard":
          "0px -1px 2px 0px rgba(119, 116, 129, 0.1), 0px -2px 4px 0px rgba(119, 116, 129, 0.1)",
        "elevation-up-soft":
          "0px -18px 40px 0px rgba(119, 116, 129, 0.12), 0px -9px 20px 0px rgba(119, 116, 129, 0.06)",
        "elevation-down-soft":
          "0px 18px 40px 0px rgba(119, 116, 129, 0.12), 0px 9px 20px 0px rgba(119, 116, 129, 0.06)",
        mainShadow:
          "0px 3px 1px -2px color-mix(in srgb, var(--primaryDarkContent) 20%, transparent), 0px 2px 2px 0px color-mix(in srgb, var(--primaryDarkContent) 14%, transparent), 0px 1px 5px 0px color-mix(in srgb, var(--primaryDarkContent) 12%, transparent)",
        mainShadowActive:
          "0px 3px 1px -2px color-mix(in srgb, var(--primaryDarkContent) 20%, transparent), 0px 2px 2px 0px color-mix(in srgb, var(--primaryDarkContent) 14%, transparent), 0px 1px 5px 0px color-mix(in srgb, var(--primaryDarkContent) 12%, transparent)",
        mainShadowHover:
          "0px 2px 4px -1px color-mix(in srgb, var(--primaryDarkContent) 20%, transparent), 0px 4px 5px 0px color-mix(in srgb, var(--primaryDarkContent) 14%, transparent), 0px 1px 10px 0px color-mix(in srgb, var(--primaryDarkContent) 12%, transparent)",
      },
      colors: {
        red: {
          50: "#FFE0E0",
          100: "#FFC7C7",
          200: "#FF5342",
          300: "#D13D31",
          400: "#A4352F",
          500: "#7B2823",
        },
        orange: {
          50: "#FFF6F0",
          100: "#FFE1CC",
          200: "#FFA566",
          300: "#FF9143",
          400: "#FF730F",
        },
        gold: {
          50: "#FFF3D6",
          100: "#FFE6A8",
          200: "#FFC533",
          300: "#D1A331",
          400: "#7B5F28",
        },
        yellow: {
          50: "#FFF9EB",
          100: "#FFF1CC",
          200: "#FFD666",
          300: "#FFC833",
          400: "#C79100",
        },
        green: {
          50: "#F5FDE3",
          100: "#E6F9B8",
          200: "#9DCF63",
          300: "#5B9A16",
          400: "#4B7B1A",
        },
        lime: {
          50: "#EEFBF4",
          100: "#D6F5E4",
          200: "#82E3AF",
          300: "#3DC27A",
          400: "#26A661",
        },
        blue: {
          50: "#E5F0FF",
          100: "#C2DCFF",
          200: "#3385FF",
          300: "#2E70D4",
          400: "#275094",
        },
        indigo: {
          25: "#F6F7FE",
          50: "#E0E3FA",
          100: "#CFD3F7",
          200: "#7586FF",
          300: "#5C6CE5",
          400: "#2F43DE",
          500: "#1E30BD",
        },
        purple: {
          50: "#FDF0FF",
          100: "#F9D6FF",
          200: "#D85EED",
          300: "#A110BC",
          400: "#820099",
        },
        magenta: {
          50: "#FFF0F3",
          100: "#FFD6E0",
          200: "#FF668B",
          300: "#FF3364",
          400: "#D92651",
        },
        grey: {
          0: "#FFFFFF",
          25: "#FCFCFC",
          50: "#F7F7F8",
          100: "#DCDCE0",
          200: "#CBCACE",
          300: "#777481",
          400: "#434149",
          500: "#252428",
          600: "#1E1D20",
          700: "#19181B",
          800: "#030401",
        },
        platinum: {
          25: "#F0F0F5",
          50: "#E1E1EA",
          100: "#B3B4CC",
          200: "#6B719E",
          300: "#343851",
          400: "#2D3045",
          500: "#26293B",
          600: "#1B1C28",
        },
        // BRAND
        primary: {
          110: "#172591",
          100: "#2F43DE",
          90: "#5C6CE5",
          50: "#8894EC",
          20: "#B4BBF3",
          10: "#E0E3FA",
        },
        // SECONDARY - YELLOW
        secondary: {
          100: "#FFC833",
          90: "#FFD666",
          20: "#FFF1CC",
          10: "#FFF9EB",
        },
        // NEUTRAL
        neutral: {
          100: "#252428",
          80: "#434149",
          60: "#777481",
          40: "#CBCACE",
          // grey-100 is the new neutral-30
          30: "#E7E7E9",
          10: "#F7F7F8",
          5: "#F9F9FB",
          0: "#FFFFFF",
        },
        // STATUS
        success: {
          110: "#1B5904",
          100: "#6BBA11",
          80: "#86EA15",
          10: "#EEFBD0",
        },
        warning: {
          110: "#7F5B00",
          100: "#FFC533",
          80: "#FFD466",
          10: "#FFF3D6",
        },
        danger: {
          110: "#7F0B00",
          100: "#FF4533",
          80: "#FF7366",
          10: "#FFF4F4",
        },
        information: {
          110: "#003D99",
          100: "#3385FF",
          80: "#99C2FF",
          10: "#E5F0FF",
        },
        // UTILITY
        overlay: "#373640",
        /* Content -------------------- */
        primaryWhiteContent: "var(--primaryWhiteContent)",
        primaryDarkContent: "var(--primaryDarkContent)",
        primaryXtraDarkContent: "var(--primaryXtraDarkContent)",
        primarySoftContent: "var(--primarySoftContent)",
        secondaryContent: "var(--secondaryContent)",
        tertiaryContent: "var(--tertiaryContent)",
        accentContent: "var(--accentContent)",
        disabledContent: "var(--disabledContent)",
        successContent: "var(--successContent)",
        informationContent: "var(--informationContent)",
        warningContent: "var(--warningContent)",
        dangerContent: "var(--dangerContent)",
        dangerSoftContent: "var(--dangerSoftContent)",

        /* Content - reversed */
        reversedPrimaryContent: "var(--reversedPrimaryContent)",
        reversedSecondaryContent: "var(--reversedSecondaryContent)",
        reversedTertiaryContent: "var(--reversedTertiaryContent)",
        reversedDarkContent: "var(--reversedDarkContent)",

        /* Surface */
        primarySurface: "var(--primarySurface)",
        secondarySurface: "var(--secondarySurface)",
        overlaySurface: "var(--overlaySurface)",

        /* Icon */
        primaryIcon: "var(--primaryIcon)",
        neutralPrimaryIcon: "var(--neutralPrimaryIcon)",
        neutralSecondaryIcon: "var(--neutralSecondaryIcon)",
        neutralTertiaryIcon: "var(--neutralTertiaryIcon)",
        libraryIcon: "var(--libraryIcon)",
        projectIcon: "var(--projectIcon)",
        shareIcon: "var(--shareIcon)",
        inboxIcon: "var(--inboxIcon)",
        analyticsIcon: "var(--analyticsIcon)",
        settingsIcon: "var(--settingsIcon)",
        informationIcon: "var(--informationIcon)",
        warningIcon: "var(--warningIcon)",
        dangerIcon: "var(--dangerIcon)",
        successIcon: "var(--successIcon)",
        primarySoftIcon: "var(--primarySoftIcon)",
        neutralPrimarySoftIcon: "var(--neutralPrimarySoftIcon)",

        /* Icon - reversed */
        reverseWhiteIcon: "var(--reverseWhiteIcon)",
        reverseDarkIcon: "var(--reverseDarkIcon)",

        /* Border */
        darkBorder: "var(--darkBorder)",
        accentBorder: "var(--accentBorder)",
        primaryBorder: "var(--primaryBorder)",
        secondaryBorder: "var(--secondaryBorder)",
        tertiaryBorder: "var(--tertiaryBorder)",
        dangerBorder: "var(--dangerBorder)",
        warningBorder: "var(--warningBorder)",
        successBorder: "var(--successBorder)",

        /* Border - reversed */
        reversedNeutralDividerBorder: "var(--reversedNeutralDividerBorder)",
        reversedNeutralBorder: "var(--reversedNeutralBorder)",

        /* Background */
        whiteBg: "var(--whiteBg)",
        primaryBg: "var(--primaryBg)",
        primaryDarkBg: "var(--primaryDarkBg)",
        primarySoftBg: "var(--primarySoftBg)",
        primaryXlSoftBg: "var(--primaryXlSoftBg)",
        primary2XlSoftBg: "var(--primary2XlSoftBg)",
        primary3XlSoftBg: "var(--primary3XlSoftBg)",
        secondaryBg: "var(--secondaryBg)",
        secondaryDarkBg: "var(--secondaryDarkBg)",
        secondarySoftBg: "var(--secondarySoftBg)",
        neutralSoftBg: "var(--neutralSoftBg)",
        neutralSofterBg: "var(--neutralSofterBg)",
        neutralBg: "var(--neutralBg)",
        neutralDarkBg: "var(--neutralDarkBg)",
        neutralXlDarkBg: "var(--neutralXlDarkBg)",
        neutral2XlDarkBg: "var(--neutral2XlDarkBg)",
        informationBg: "var(--informationBg)",
        successBg: "var(--successBg)",
        warningBg: "var(--warningBg)",
        dangerBg: "var(--dangerBg)",
        dangerSoftBg: "var(--dangerSoftBg)",
        dangerdarkBg: "var(--dangerdarkBg)",
        librarySoftBg: "var(--librarySoftBg)",
        libraryBg: "var(--libraryBg)",
        shareSoftBg: "var(--shareSoftBg)",
        shareBg: "var(--shareBg)",
        inboxSoftBg: "var(--inboxSoftBg)",
        inboxBg: "var(--inboxBg)",
        projectSoftBg: "var(--projectSoftBg)",
        projectBg: "var(--projectBg)",
        analyticsSoftBg: "var(--analyticsSoftBg)",
        analyticsBg: "var(--analyticsBg)",
        settingsSoftBg: "var(--settingsSoftBg)",
        settingsBg: "var(--settingsBg)",
        disabledBg: "var(--disabledBg)",
        tabSelectedBg: "var(--tabSelectedBg)",
        tabUnselectedBg: "var(--tabUnselectedBg)",
        tabCounterBg: "var(--tabCounterBg)",
        navBg: "var(--navBg)",
        listBg: "var(--listBg)",
        sectionBg: "var(--sectionBg)",

        /* Background - reversed */
        reversedDarkBg: "var(--reversedDarkBg)",
        reversedWhiteBg: "var(--reversedWhiteBg)",
        reversedWhiteSoftBg: "var(--reversedWhiteSoftBg)",

        /* Covers */
        bgCover: "var(--bgCover)",
        borderCover: "var(--borderCover)",
        iconCover: "var(--iconCover)",
      },
    },
  },
};
