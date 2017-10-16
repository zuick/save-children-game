module.exports = {
  levels: {
    backgroundColor: '#000',
    levelItem: { width: 215, height: 260 },
    levelItemsPadding: 0,
    blockWidthScale: 0.85,
    blockMarginTop: 170,
    blockArrowMarginLeft: 50,
    levelItemTextStyle: { font: "72px Arial", fill: "#fff", align: "center" },
    levelItemTextOffsetY: 20,
    levelItemTextOffsetX: -5,
    headerTextStyle: { font: "48px Arial", fill: "#fff", align: "center" },
    headerHeight: 80,
    types: {
      0: 'levelItemCity',
      1: 'levelItemCountrySide',
      2: 'levelItemHouse'
    }
  },
  game: {
    backgroundColor: '#271212',
    timerText: {
      marginTop: 50,
      offsetX: -60, // from center
      style: { font: "48px Arial", fill: "#fff", align: "center" }
    },
    levelNumberText: {
      marginTop: 50,
      offsetX: 600, // from center
      style: { font: "48px Arial", fill: "#dd0", align: "center" }
    },
    statusText: {
      marginTop: 50,
      offsetX: 500, // from center
      style: { font: "42px Arial", fill: "#fff", align: "center" }
    },
    pauseButton: {
      marginTop: 48,
      offsetX: 60, // from center
    },
    backButton: {
      marginTop: 48,
      offsetX: -600, // from center
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
    textButtonStyle: { font: "36px Arial", fill: "#fff", align: "center" },
    pause: {
      textStyle: { font: "64px Arial", fill: "#dd0", align: "center" },
      opacity: 0.5
    },
    success: {
      width: 900,
      height: 500,
      opacity: 0.5,
      header: {
        style: { font: "40px Arial", fill: "#fff", align: "center" },
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
        style: { font: "36px Arial", fill: "#B04E0D", align: "center" },
        offsetY: 40
      },
      time: {
        style: { font: "36px Arial", fill: "#B04E0D", align: "center" },
        offsetY: 85
      },
      buttons: {
        offsetY: 165,
        toMenuOffsetX: -190,
        toLevelsOffsetX: -115,
        replayOffsetX: -40,
        nextOffsetX: 105,
        nextTextStyle: { font: "36px Arial", fill: "#fff", align: "center" }
      }
    },
    gameover: {
      width: 900,
      height: 500,
      opacity: 0.5,
      header: {
        style: { font: "40px Arial", fill: "#fff", align: "center" },
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
        style: { font: "36px Arial", fill: "#B04E0D", align: "center" },
        offsetY: 45
      },
      time: {
        style: { font: "36px Arial", fill: "#B04E0D", align: "center" },
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
