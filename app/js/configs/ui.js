module.exports = {
  menu: {
    playButton: {
      offsetX: 0,
      offsetY: 300
    },
    soundButton: {
      offsetX: -320,
      offsetY: 280
    },
    soundButtonSprite: {
      offsetX: -320,
      offsetY: 255
    },
    levelsButton: {
      offsetX: 320,
      offsetY: 280
    },
    levelsButtonSprite: {
      offsetX: 320,
      offsetY: 255
    },
    languageButtonRU: {
      offsetX: -710,
      offsetY: -420,
      flag: {
        x: 110,
        y: -5
      },
      text: {
        style: { font: "28px KZSupercell", fill: "#fff", align: "center" },
        x: -50,
        y: -2
      }
    },
    languageButtonBA: {
      offsetX: -710,
      offsetY: -300,
      flag: {
        x: 110,
        y: -5
      },
      text: {
        style: { font: "28px KZSupercell", fill: "#fff", align: "center" },
        x: -50,
        y: -2
      }
    }
  },
  levels: {
    backgroundColor: '#000',
    levelItem: { width: 215, height: 260 },
    levelItemsPadding: 0,
    blockWidthScale: 0.85,
    blockMarginTop: 200,
    blockArrowMarginLeft: 50,
    levelItemTextStyle: { font: "64px KZSupercell", fill: "#fff", align: "center" },
    levelItemTextShadow: { x: 8, y: 8, alpha: 0.7, style: { font: "70px KZSupercell", fill: "#111s", align: "center" } },
    levelItemTextOffsetY: 20,
    levelItemTextOffsetX: -5,
    levelItemCheckOffsetY: 80,
    levelItemCheckOffsetX: 50,
    headerTextStyle: { font: "36px KZSupercell", fill: "#fff", align: "center" },
    headerHeight: 100,
    backButton: {
      offsetY: -440,
      offsetX: -800, // from center
    },
    types: {
      0: 'levelItemCity',
      1: 'levelItemCountrySide',
      2: 'levelItemHouse'
    }
  },
  game: {
    backgroundColor: '#271212',
    timer: {
      marginTop: 10,
      offsetX: -220, // from center
    },
    status: {
      marginTop: 5,
      offsetX: 600, // from center
    },
    timerText: {
      marginTop: 47,
      offsetX: -90, // from center
      style: { font: "22px KZSupercell", fill: "#fff", align: "center" },
      stroke: { color: '#111', thickness: 2 }
    },
    levelNumberText: {
      marginTop: 50,
      offsetX: 836, // from center
      style: { font: "42px Bangers", fill: "#fff", align: "center" },
      stroke: { color: '#111', thickness: 2 }
    },
    statusText: {
      marginTop: 55,
      offsetX: 735, // from center
      style: { font: "28px KZSupercell", fill: "#579D00", align: "center" }
    },
    pauseButton: {
      marginTop: 48,
      offsetX: 60, // from center
    },
    backButton: {
      marginTop: 48,
      offsetX: -800, // from center
    },
    sparks: {
      simple: {
        yRange: -60,
        duration: 1000,
        yoyo: false,
        emptyFramesRange: 15
      }
    }
  },
  popups: {
    textButtonStyle: { font: "36px KZSupercell", fill: "#fff", align: "center" },
    pause: {
      textStyle: { font: "48px KZSupercell", fill: "#dd0", align: "center" },
      opacity: 0.5
    },
    confirm: {
      opacity: 0.5,
      description: {
        style: { font: "24px KZSupercell", fill: "#B04E0D", align: "center" },
        offsetY: -40
      },
      buttons: {
        offsetY: 85,
        acceptOffsetX: -105,
        cancelOffsetX: 105,
        style: { font: "22px KZSupercell", fill: "#fff", align: "center" }
      }
    },
    success: {
      opacity: 0.5,
      header: {
        style: { font: "26px KZSupercell", fill: "#fff", align: "center" },
        offsetY: -265,
        titleOffsetY: -260,
        stroke: "#111",
        strokeThickness: 2,
        scale: 1.1
      },
      icon: {
        offsetY: -100
      },
      stat: {
        style: { font: "22px KZSupercell", fill: "#B04E0D", align: "center" },
        offsetY: 40
      },
      time: {
        style: { font: "22px KZSupercell", fill: "#B04E0D", align: "center" },
        offsetY: 85
      },
      buttons: {
        offsetY: 165,
        toMenuOffsetX: -190,
        toLevelsOffsetX: -115,
        replayOffsetX: -40,
        nextOffsetX: 105,
        nextTextStyle: { font: "22px KZSupercell", fill: "#fff", align: "center" }
      }
    },
    gameover: {
      opacity: 0.5,
      header: {
        style: { font: "26px KZSupercell", fill: "#fff", align: "center" },
        offsetY: -235,
        titleOffsetY: -230,
        stroke: "#111",
        strokeThickness: 2,
        scale: 1.1
      },
      icon: {
        offsetY: -75
      },
      stat: {
        style: { font: "22px KZSupercell", fill: "#B04E0D", align: "center" },
        offsetY: 45
      },
      time: {
        style: { font: "22px KZSupercell", fill: "#B04E0D", align: "center" },
        offsetY: 85
      },
      buttons: {
        offsetY: 150,
        toMenuOffsetX: -150,
        replayOffsetX: 0,
        toLevelsOffsetX: 150
      }
    }
  }
}
