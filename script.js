class Status {
  isActive = false;
  constructor(name, amount, growth, shrink) {
    this.name = name;
    this.amount = amount;
    this.growth = growth;
    this.shrink = shrink;
    this.default = { growth: growth, shrink: shrink };
  }

  update = () => {
    this.isActive ? this.amount += this.growth : this.amount -= this.shrink;
    this.amount = this.amount > 1000 ? 1000
      : this.amount = this.amount <= 0 ? 0
        : this.amount;
  }

  active = () => this.isActive = true;
  inactive = () => this.isActive = false;

  changeGrowth = (val) => { this.growth = val; }
  changeShrink = (val) => { this.shrink = val; }
  changeDefault = (growth, shrink) => { this.default = { growth: growth, shrink: shrink }; };

  reset = () => {
    [this.growth, this.shrink] = [this.default.growth, this.default.shrink];
  }
};

const Player = (inName, inAvatar, inSemester, inStatus) => {
  let name = inName;
  let avatar = inAvatar;
  let status = inStatus ? {
    belajar: new Status(inStatus.belajar.name, inStatus.belajar.amount, inStatus.belajar.growth, inStatus.belajar.shrink),
    makan: new Status(inStatus.makan.name, inStatus.makan.amount, inStatus.makan.growth, inStatus.makan.shrink),
    main: new Status(inStatus.main.name, inStatus.main.amount, inStatus.main.growth, inStatus.main.shrink),
    tidur: new Status(inStatus.tidur.name, inStatus.tidur.amount, inStatus.tidur.growth, inStatus.tidur.shrink),
  }: {
    belajar: new Status("belajar", 0, 10, 0),
    makan: new Status("makan", 500, 100, 4),
    main: new Status("main", 500, 60, 8),
    tidur:  new Status("tidur", 500, 20, 1),
  }
    
  let semester = inSemester ? inSemester : 1;

  const update = () => {
    status.belajar.update();
    status.makan.update();
    status.main.update();
    status.tidur.update();
  }

  return {
    name,
    avatar,
    semester,
    status,
    update,
  }
};

const DOM = (() => {
  const updateButton = (() => {
      let buttons = document.querySelectorAll(".togglebutton");
      buttons.forEach(button => {
        button.addEventListener("click", (e) => {
          gameController.toggleActive(e.target.dataset.name);
          DOM.changeAvatarOverlay(e.target.dataset.name);
          button.classList.remove("btn-light");
          button.classList.add("btn-warning");
          buttons.forEach(button => {
            if (button != e.target) {
              button.classList.remove("btn-warning");
              button.classList.remove("active");
              button.classList.add("btn-light");
            }
          });
          if (!(button.classList.contains("active"))) {
            button.classList.remove("btn-warning");
            button.classList.add("btn-light");
            DOM.changeAvatarOverlay("none");
          }
        });
      })
    })();

  const greetingPlayer = (hour) => {
    let greeting = document.querySelector("#greeting-player");
    let greetingText = "";
    if (hour >= 5 && hour <= 10) greetingText = "Selamat Pagi";
    else if (hour >= 11 && hour <= 15) greetingText = "Selamat Siang";
    else if (hour >= 16 && hour <= 18) greetingText = "Selamat Sore";
    else if (hour >= 19 && hour <= 24) greetingText = "Selamat Malam";
    else if (hour >= 0 && hour <= 4) greetingText = "Selamat Malam";
    greeting.innerText = greetingText;
  };

  const getUserInit = (() => {
    let submitBtn = document.querySelector("#avatar-button");
    let textbox = document.querySelector("#name-input");
    submitBtn.addEventListener("click", () => {
      let name = textbox.value;
      let image = document.querySelector(".carousel-item.active").querySelector("img").getAttribute("src");
      gameController.init(name, image);
    })

    textbox.addEventListener("keyup", (e) => {
      if (e.key == "Enter") {
        e.preventDefault();
        submitBtn.click();
      }
    })
  })();
  const pauseMenu = (() => {
    let pause = document.querySelector("#pause-button");
    let resume = document.querySelector("#resume-btn");
    let restart = document.querySelector("#restart-btn");
    let save = document.querySelector("#save-btn");
    pause.addEventListener("click", () => {
      gameController.gameClock.stop();
    })
    resume.addEventListener("click", () => {
      gameController.gameClock.start();
    })
    restart.addEventListener("click", () => {
      gameController.reset();
      DOM.scene("avatar-selection");
    })
    save.addEventListener("click", () => {
      gameController.saveGame();
      DOM.addAlert("Game berhasil disave!", "save")
      setTimeout(() => {
        DOM.removeAlert("save");
      }, 2000);
    });
  })();
 
  return {
    updateButton,
    resetButton: () => {
      let buttons = document.querySelectorAll(".togglebutton");
      buttons.forEach(el => {
        el.classList.remove("btn-warning");
        el.classList.remove("active");
        el.classList.add("btn-light");
      });
    },
    greetingPlayer,
    gameOver: (status) => {
      DOM.scene("game-over");
      let gameOverMsg = document.querySelector("#gameover-message");
      let reset = document.querySelector("#gameover-resetbtn");

      switch (status) {
        case "makan": gameOverMsg.innerText = "Anda mati kelaparan!"; break;
        case "main": gameOverMsg.innerText = "Anda stress kurang hiburan!"; break;
        case "tidur": gameOverMsg.innerText = "Anda mati kurang tidur!"; break;
        case "belajar": gameOverMsg.innerText = "Anda DO karena tidak belajar!"; break;
      }
      reset.addEventListener("click", ()=> {
        gameController.reset();
        DOM.scene("avatar-selection");
      })
    },
    winGame: (avatar) => {
      DOM.scene("win-game");
      const img = document.querySelector("#win-img");
      const resetBtn = document.querySelector("#win-reset");
      img.src = avatar;
      resetBtn.addEventListener("click", () => {
        gameController.reset();
        DOM.scene("avatar-selection");
      });
    },
    changeAvatar: (url) => {
      let el = document.querySelector("#avatar");
      el.src = url;
    },
    changeAvatarOverlay: (status) => {
      let el = document.querySelector("#avatar-overlay");
      const makan = "./assets/avatar/status/act_makan.png";
      const main = "./assets/avatar/status/act_main.png";
      const belajar = "./assets/avatar/status/act_belajar.png";
      const tidur = "./assets/avatar/status/act_tidur.png";
      console.log(status);
      switch (status) {
        case "makan": el.src = makan; break;
        case "main": el.src = main; break;
        case "belajar": el.src = belajar; break;
        case "tidur": el.src = tidur; break;
        case "none": el.src = ""; break;
      }
    },
    updateProgress: (status, val) => {
      const el = document.querySelector(`#${status}-progressBar`);
      el.style.width = `${val}%`;
      el.innerText = `${val}%`;
      if (val >= 20 && val <= 30) {
        el.classList.add("bg-warning");
        el.classList.remove("bg-danger");
      }
      else if (val < 20) {
        el.classList.add("bg-danger");
        el.classList.remove("bg-warning");
      } else {
        el.classList.remove("bg-danger");
        el.classList.remove("bg-warning");
      }
    },
    updateSemester: (val) => {
      const el = document.querySelector("#semester-now");
      el.innerText = val;
    },

    updateClock: ([hours, minutes]) => {
      hours = hours >= 10 ? hours : "0" + hours;
      minutes = minutes >= 10 ? minutes : "0" + minutes;
      const clock = document.querySelector("#jam");
      clock.innerText = `${hours}:${minutes}`;
    },

    addAlert: (message, id) => {
      const el = document.querySelector("#game-alert");
      const alert = document.createElement("div");
      alert.className = "alert alert-danger fade show in";
      alert.innerText = message;
      alert.id = `alert-${id}`;
      el.appendChild(alert);
    },
    removeAlert: (id) => {
      const el = document.querySelector(`#game-alert`);
      const alert = document.querySelector(`#alert-${id}`);
      if (!alert) return;
      el.removeChild(alert);
    },

    changeBg: (url) => {
      const bg = document.querySelector("#bg-image");
      if(bg.style.backgroundImage.includes(url)) return;
      bg.style.backgroundImage = `url(${url})`;
    },

    changeName: (name) => {;
      const el = document.querySelector("#nama-player");
      el.innerText = name;
    },

    fadeOut: (el) => {
      const body = document.querySelector("body");
      el.classList.add("fadeOut");
      body.classList.add("overflow-hidden");
      setTimeout(() => {
        el.classList.add("d-none")
        body.classList.remove("overflow-hidden");
      }, 1000);
    },
    fadeIn: (el) => {
      const body = document.querySelector("body");
      el.classList.remove("d-none")
      body.classList.add("overflow-hidden");
      setTimeout(() => {
        el.classList.remove("fadeOut")
        body.classList.remove("overflow-hidden");
      }, 1000);
    },
    scene: (scene) => {
      const all = document.querySelectorAll(".fadeBase");
      all.forEach(el => {
        if (el.id === scene) {
          DOM.fadeIn(el);
        }
        else {
          DOM.fadeOut(el);
        }
      })
    },
  }
})();

const gameController = (() => {
  let clock = new Date();
  let player;

  const getPlayer = () => { return player; }
  const initClock = () => {
    clock.setHours(9);
    clock.setMinutes(55);
    clock.setSeconds(0);
  };

  const changeClock = (hours, minutes) => {
    clock.setHours(hours);
    clock.setMinutes(minutes);
    let day = "./assets/day.png";
    let evening = "./assets/evening.png";
    let night = "./assets/night.png";
    if (clock.getHours() >= 6 && clock.getHours() < 16) {
      DOM.changeBg(day);
    } else if (clock.getHours() >= 16 && clock.getHours() < 19) {
      DOM.changeBg(evening);
    } else if ((clock.getHours() >= 19 && clock.getHours() <= 24) 
            || (clock.getHours() >= 0 && clock.getHours() < 6)) {
      DOM.changeBg(night);
    }
  };
  const updateClock = () => {
    const [hours, minutes] = [clock.getHours(), clock.getMinutes()];
    DOM.updateClock([hours, minutes]);
    changeClock(hours, minutes + 5);
  }

  const toggleActive = (status) => {
    player.status[status].isActive ?
      player.status[status].inactive() :
      player.status[status].active();
    Object.keys(player.status).forEach((obj) => {
      if (obj != status) {
        player.status[obj].inactive()
      }
    })
  }

  const Algorithm = (() => {
    let makanBoost = true;
    let alert = false;
    let alertDO = false;
    let changes = {
      belajar: {makan: 0, main: 0},
      tidur: {belajar: 0, main: 0, shrink: 0},
      makan: {belajar: 0, main: 0, boost: 0},
      main: {belajar20: 0, belajar10: 0},
    };
    let countBeforeDO = 0;

    const toggleAlert = (status) => {
      let val = player.status[status].amount;
      if( val < 100 && alert === false) {
        alert = true;
        DOM.addAlert(`Kondisi anda memburuk!`, "status");
      } else if ( val >= 100 && alert === true) {
        alert = false;
        DOM.removeAlert("status");
      }
    }

    const toggleAlertDO = () => {
      console.log(countBeforeDO);
      if (countBeforeDO > 72) {
        gameController.gameOver("belajar");
      } else if (countBeforeDO >= 36 && alertDO === false) {
        alertDO = true;
        DOM.addAlert("Segera belajar sebelum DO!", "belajar");
      } else if (countBeforeDO < 36 && alertDO === true) {
        alertDO = false;
        DOM.removeAlert("belajar");
      }
    }

    return {
      getChanges: () => {
        return changes;
      },
      countBeforeDO,
      semesterUp: () => {
        if (player.semester > 8) {
          gameController.gameClock.stop();
          DOM.winGame(player.avatar);
        }
        if (player.status.belajar.amount >= 1000) {
          player.semester += 1;
          player.status["belajar"].amount = 0;
        }     
        switch(player.semester) {
          case 1:
            player.status["belajar"].changeDefault(10, 0);
            player.status["makan"].changeDefault(100, 4);
            player.status["main"].changeDefault(60, 8);
            player.status["tidur"].changeDefault(20, 1);

            changes.belajar.makan = 8;
            changes.belajar.main = 10

            changes.tidur.belajar = 10
            changes.tidur.main = 30
            changes.tidur.shrink = 10

            changes.makan.belajar = 10
            changes.makan.main = 30;
            changes.makan.boost = 20;

            changes.main.belajar20 = 20;
            changes.main.belajar10 = 10;
            break;
          case 2:
            player.status["belajar"].changeDefault(10, 0);
            player.status["makan"].changeDefault(50, 5);
            player.status["main"].changeDefault(50, 10);
            player.status["tidur"].changeDefault(20, 1);

            changes.belajar.makan = 8;
            changes.belajar.main = 10

            changes.tidur.belajar = 10
            changes.tidur.main = 30
            changes.tidur.shrink = 10

            changes.makan.belajar = 10
            changes.makan.main = 30;
            changes.makan.boost = 20;

            changes.main.belajar20 = 20;
            changes.main.belajar10 = 10;
            break;
          case 3:
            player.status["belajar"].changeDefault(10, 0);
            player.status["makan"].changeDefault(50, 5);
            player.status["main"].changeDefault(50, 10);
            player.status["tidur"].changeDefault(20, 2);

            changes.belajar.makan = 10;
            changes.belajar.main = 12

            changes.tidur.belajar = 8 
            changes.tidur.main = 30
            changes.tidur.shrink = 10

            changes.makan.belajar = 10
            changes.makan.main = 30;
            changes.makan.boost = 20;

            changes.main.belajar20 = 20;
            changes.main.belajar10 = 10;
            break;

          case 4:
            player.status["belajar"].changeDefault(10, 0);
            player.status["makan"].changeDefault(50, 6);
            player.status["main"].changeDefault(50, 10);
            player.status["tidur"].changeDefault(18, 2);

            changes.belajar.makan = 10;
            changes.belajar.main = 12

            changes.tidur.belajar = 7
            changes.tidur.main = 32
            changes.tidur.shrink = 11

            changes.makan.belajar = 8 
            changes.makan.main = 32;
            changes.makan.boost = 18;

            changes.main.belajar20 = 18;
            changes.main.belajar10 = 8;
            break;

          case 5:
            player.status["belajar"].changeDefault(8, 0);
            player.status["makan"].changeDefault(40, 6);
            player.status["main"].changeDefault(45, 10);
            player.status["tidur"].changeDefault(18, 2);

            changes.belajar.makan = 12;
            changes.belajar.main = 14

            changes.tidur.belajar = 7
            changes.tidur.main = 32
            changes.tidur.shrink = 13

            changes.makan.belajar = 7 
            changes.makan.main = 32;
            changes.makan.boost = 16;

            changes.main.belajar20 = 16;
            changes.main.belajar10 = 7;
            break;
         
          case 6:
            player.status["belajar"].changeDefault(8, 0);
            player.status["makan"].changeDefault(40, 6);
            player.status["main"].changeDefault(40, 12);
            player.status["tidur"].changeDefault(17, 2);

            changes.belajar.makan = 13;
            changes.belajar.main = 15

            changes.tidur.belajar = 6
            changes.tidur.main = 33
            changes.tidur.shrink = 14

            changes.makan.belajar = 7 
            changes.makan.main = 33;
            changes.makan.boost = 16;

            changes.main.belajar20 = 16;
            changes.main.belajar10 = 7;
            break;         
          case 7:
            player.status["belajar"].changeDefault(7, 0);
            player.status["makan"].changeDefault(40, 6);
            player.status["main"].changeDefault(40, 12);
            player.status["tidur"].changeDefault(17, 2);

            changes.belajar.makan = 13;
            changes.belajar.main = 15

            changes.tidur.belajar = 6
            changes.tidur.main = 33
            changes.tidur.shrink = 14

            changes.makan.belajar = 6 
            changes.makan.main = 33;
            changes.makan.boost = 15;

            changes.main.belajar20 = 15;
            changes.main.belajar10 = 6;
            break;         
          case 8:
            player.status["belajar"].changeDefault(6, 0);
            player.status["makan"].changeDefault(40, 7);
            player.status["main"].changeDefault(40, 14);
            player.status["tidur"].changeDefault(16, 3);

            changes.belajar.makan = 14;
            changes.belajar.main = 16

            changes.tidur.belajar = 4
            changes.tidur.main = 35
            changes.tidur.shrink = 15

            changes.makan.belajar = 5 
            changes.makan.main = 35;
            changes.makan.boost = 14;

            changes.main.belajar20 = 12;
            changes.main.belajar10 = 5;
            break;
        };

        DOM.updateSemester(player.semester);
      },
      belajar: () => {
        toggleAlertDO();
        if (player.status["belajar"].isActive) {
          player.status["makan"].changeShrink(changes.belajar.makan); 
          player.status["main"].changeShrink(changes.belajar.main); 
          countBeforeDO--;
        } else {
          player.status["makan"].reset();
          player.status["main"].reset();
          countBeforeDO++;
        }
      },
      tidur: () => {
        let hours = clock.getHours();
        toggleAlert("tidur")
        if (player.status["tidur"].amount < 200) {
          player.status["belajar"].changeGrowth(changes.tidur.belajar); 
          player.status["main"].changeShrink(changes.tidur.main); 
        } else {
          player.status["belajar"].reset();
          player.status["main"].reset();
        }

        if (!(hours > 6 && hours < 22)) {
          player.status["tidur"].changeShrink(changes.tidur.shrink);
        } else {
          player.status["tidur"].reset();
        }
      },
      makan: () => {
        toggleAlert("makan");
        if (player.status["makan"].amount < 200) {
          player.status["belajar"].changeGrowth(changes.makan.belajar); 
          player.status["main"].changeShrink(changes.makan.main);

        } else {
          player.status["belajar"].reset();
          player.status["main"].reset();
        }

        if (player.status["makan"].amount === 1000 && makanBoost) {
          player.status["main"].amount += changes.makan.boost;
          makanBoost = false;
        }
        if(player.status["makan"].amount === 800) {
          makanBoost = true;
        }
      },
      main: () => {
        toggleAlert("main")
        if (player.status["main"].amount < 200) {
          player.status["belajar"].changeGrowth(changes.main.belajar20); 
        }
        else if (player.status["main"].amount < 100) {
          player.status["belajar"].changeGrowth(changes.main.belajar10); 
        } else {
          player.status["belajar"].reset();
        }
      }
    }
  })();

  const gameClock = (() => {
    let interval;
    const callback = () => {
      player.update();
      updateClock();
      DOM.greetingPlayer(clock.getHours());

      Algorithm.semesterUp();
      Algorithm.belajar();
      Algorithm.tidur();
      Algorithm.makan();
      Algorithm.main();

      Object.keys(player.status).forEach(val => {
        DOM.updateProgress(
          val, Math.round(player.status[val].amount / 10)
        );
        if (val != "belajar" && player.status[val].amount <= 0) gameOver(player.status[val].name);
        if((clock.getHours() === 0 && clock.getMinutes() === 0) 
         || (clock.getHours() === 12 && clock.getMinutes() === 0) ) saveGame();
      });
    };

    const start = () => {
      interval = setInterval(callback, 1000);
    }
    const stop = () => {
      clearInterval(interval);
    };
    return { start, stop }
  })();

  const saveGame = () => {
    let dataSave = JSON.stringify(player);
    let clockSave = JSON.stringify(clock);
    localStorage.setItem("player", dataSave);
    localStorage.setItem("clock", clockSave);
  }

  const loadGame = () => {
    let data = JSON.parse(localStorage.getItem("player"));
    let clockSave = new Date(JSON.parse(localStorage.getItem("clock")));
    if (data) {
      console.log(clockSave);
      clock = clockSave;
      player = Player(data.name, data.avatar, data.semester, data.status);
      // updateClock(clockSave.getHours, clockSave.getMinutes)
      DOM.changeName(player.name);
      DOM.changeAvatar(player.avatar);
      DOM.updateSemester(player.semester);
      gameClock.start();
      return true;
    }
    return false;
  }

  const reset = () => {
    localStorage.removeItem("player");
    localStorage.removeItem("clock");
    player = {};
  }

  // TODO
  // Bikin message custom per status
  const gameOver = (status) => {
    gameClock.stop();
    DOM.gameOver(status);
  }

  const init = (playerName, avatar) => {
    player = Player(playerName, avatar);
    DOM.changeName(player.name);
    DOM.changeAvatar(player.avatar);
    DOM.updateSemester(player.semester);
    Algorithm.countBeforeDO = 0;
    initClock();

    DOM.fadeOut(document.querySelector("#avatar-selection"));
    DOM.fadeIn(document.querySelector("#main-game"));
    DOM.resetButton();
    gameClock.start();
    saveGame();
  }

  return {
    init,
    reset,
    changeClock,
    saveGame,
    gameClock,
    loadGame,
    gameOver,
    toggleActive,
    getPlayer,
  }
})();

const Debug = (() => {
  return {
    timetravel: (jam) => {
      switch(jam) {
        case "pagi":
          gameController.changeClock(9, 55);
          break;
        case "siang":
          gameController.changeClock(12, 55);
          break;
        case "sore":
          gameController.changeClock(15, 35);
          break;
        case "malam":
          gameController.changeClock(23, 55);
          break;
        default:
          console.log("Menunya tidak ada");
          break;
      }
    },
    turunin: (status) => {
      gameController.getPlayer().status[status].amount = 100
    },
    maxBelajar: () => {
      gameController.getPlayer().status["belajar"].amount = 950;
    },
    turuninSemua: () => {
      gameController.getPlayer().status["tidur"].amount = 100;
      gameController.getPlayer().status["makan"].amount = 100;
      gameController.getPlayer().status["main"].amount = 100;
    },
    naikinSemua: () => {
      gameController.getPlayer().status["tidur"].amount = 900;
      gameController.getPlayer().status["makan"].amount = 900;
      gameController.getPlayer().status["main"].amount = 900;
    },
    gantiSemester: (val) => {
      gameController.getPlayer().semester = val;
      DOM.updateSemester(gameController.getPlayer().semester);
    }
  }
})();

const gameStart = (() => {
  if (gameController.loadGame()) {
    DOM.scene("main-game");
    return;
  }
  DOM.scene("avatar-selection");
})();