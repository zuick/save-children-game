module.exports = {
  menu: {
    backgroundColor: '#003050',
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
      left: 250,
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
      left: 250,
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
      left: 150,
    },
    types: {
      0: 'levelItemCity',
      1: 'levelItemCountrySide',
      2: 'levelItemHouse'
	},
	blockScaleForSmallAspect: 0.8
  },
  help: {
    fadeDuration: 300,
    header: {
      style: { font: "32px KZSupercell", fill: "#fff", align: "center" },
      offsetY: 100
    }
  },
  game: {
    backgroundColor: {
      0: '#546405',
      1: '#776F5E',
      2: '#5E3916'
    },
    desktop: {
      scale: 1,
      timer: {
        top: 10,
        offsetX: -220, // from center
      },
      status: {
        top: 50,
        right: 150
      },
      timerText: {
        top: 47,
        offsetX: -90, // from center
        style: { font: "22px KZSupercell", fill: "#fff", align: "center" },
        stroke: { color: '#111', thickness: 2 }
      },
      levelNumberText: {
        top: 45,
        right: 60,
        style: { font: "42px Bangers", fill: "#fff", align: "center" },
        stroke: { color: '#111', thickness: 3 }
      },
      statusText: {
        top: 50,
        right: 160,
        style: { font: "28px KZSupercell", fill: "#579D00", align: "center" }
      },
      pauseButton: {
        top: 48,
        offsetX: 60, // from center
      },
      backButton: {
        top: 48,
        left: 48
      },
    },
    mobile: {
      scale: 1.5,
      timer: {
        top: 20,
        offsetX: -280, // from center
      },
      status: {
        top: 80,
        right: 265
      },
      timerText: {
        top: 75,
        offsetX: -80, // from center
        style: { font: "30px KZSupercell", fill: "#fff", align: "center" },
        stroke: { color: '#111', thickness: 2 }
      },
      levelNumberText: {
        top: 70,
        right: 130,
        style: { font: "52px Bangers", fill: "#fff", align: "center" },
        stroke: { color: '#111', thickness: 3 }
      },
      statusText: {
        top: 80,
        right: 280,
        style: { font: "34px KZSupercell", fill: "#579D00", align: "center" }
      },
      pauseButton: {
        top: 75,
        offsetX: 140, // from center
      },
      backButton: {
        top: 75,
        left: 100
      },
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
    mobileScale: 1.5,
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
    quiz: {
      mobileScale: 1.2,
      opacity: 0.5,
      scale: 1,
      question: {
        offsetY: -220,
        text: {
          style: { font: "22px KZSupercell", fill: "#EEFFB2", align: "center" },
          offsetY: 30
        }
      },
      answers: {
        offsetY: 210,
        tweenY: 20,
        waveTweenDuration: 750,
        scaleTweenDuration: 750,
        scaleCorrectTween: 1.2,
        scaleIncorrectTween: 0.9,
        closeDelay: 2500,
        w: 250,
        h: 251,
        padding: 20,
        iconOffsetX: 80,
        iconOffsetY: 80,
        iconAlphaTweenDuration: 500,
        iconAlphaTweenDelay: 200
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
  },
  borders: {
    0: {
      back: 'borderC1',
      front: 'borderC1',
      fronth: 52,
      side: 'borderC2',
      leftSideAnchorX: -0.2,
      rightSideAnchorX: 1.2,
      w: 32,
      h: 55,
      offsetX: 0,
      offsetY: 20
    },
    1: {
      back: 'borderA2',
      front: 'borderA2',
      fronth: 64,
      side: 'borderA1',
      corner: 'borderA3',
      leftSideAnchorX: 0,
      rightSideAnchorX: 0,
      w: 105,
      h: 84,
      offsetX: -3,
      offsetY: 20
    },
	  2: {
      back: 'borderB3',
      front: 'borderB2',
      fronth: 63,
      side: 'borderB1',
      leftSideAnchorX: 0,
      rightSideAnchorX: 1,
      w: 239,
      h: 105,
      offsetX: -3,
      offsetY: 20
    }
  }
}
