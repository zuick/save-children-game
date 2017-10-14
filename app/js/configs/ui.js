module.exports = {
  levels: {
    backgroundColor: '#000',
    levelItem: { width: 150, height: 150 },
    levelItemsPadding: 20,
    blockWidthScale: 0.5,
    blockMarginTop: 120,
    blockArrowMarginLeft: 50,
    levelItemTextStyle: { font: "64px Arial", fill: "#fff", align: "center" },
    headerTextStyle: { font: "32px Arial", fill: "#fff", align: "center" },
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
      offsetX: -50, // from center
      style: { font: "48px Arial", fill: "#fff", align: "center" }
    },
    levelNumberText: {
      marginTop: 50,
      offsetX: 500, // from center
      style: { font: "48px Arial", fill: "#dd0", align: "center" }
    },
    statusText: {
      marginTop: 50,
      offsetX: 400, // from center
      style: { font: "42px Arial", fill: "#fff", align: "center" }
    },
    pauseButton: {
      marginTop: 48,
      offsetX: 50, // from center
    }
  },
  popups: {
    textButtonStyle: { font: "48px Arial", fill: "#fff", align: "center" },
    pause: {
      textStyle: { font: "64px Arial", fill: "#dd0", align: "center" },
      opacity: 0.5
    },
    success: {
      width: 900,
      height: 500,
      opacity: 0.5,
      header: {
        style: { font: "48px Arial", fill: "#fff", align: "center" },
        offsetY: -180
      },
      stat: {
        style: { font: "48px Arial", fill: "#fff", align: "center" },
        offsetY: -50
      },
      time: {
        style: { font: "48px Arial", fill: "#fff", align: "center" },
        offsetY: 50
      },
      buttons: {
        offsetY: 200,
        toMenuOffsetX: -310,
        toLevelsOffsetX: -100,
        replayOffsetX: 110,
        nextOffsetX: 320
      }
    },
    gameover: {
      width: 900,
      height: 500,
      opacity: 0.5,
      header: {
        style: { font: "48px Arial", fill: "#fff", align: "center" },
        offsetY: -180
      },
      stat: {
        style: { font: "48px Arial", fill: "#fff", align: "center" },
        offsetY: -50
      },
      time: {
        style: { font: "48px Arial", fill: "#fff", align: "center" },
        offsetY: 50
      },
      buttons: {
        offsetY: 200,
        toMenuOffsetX: -210,
        replayOffsetX: 0,
        toLevelsOffsetX: 210
      }
    }
  }
}
