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
          }
        });
      })
    })();

  const greetingPlayer = (() => {
    setInterval(() => { 
      let greeting = document.querySelector("#greeting-player");
      let time = document.querySelector("#jam").innerHTML;
      let hour = parseInt(time.split(":")[0]);
      let greetingText = "";
      if (hour >= 5 && hour <= 10) greetingText = "Selamat Pagi";
      else if (hour >= 11 && hour <= 15) greetingText = "Selamat Siang";
      else if (hour >= 16 && hour <= 18) greetingText = "Selamat Sore";
      else if (hour >= 19 && hour <= 24) greetingText = "Selamat Malam";
      else if (hour >= 0 && hour <= 4) greetingText = "Selamat Malam";
      greeting.innerHTML = greetingText;
    }, 1000);
  })();

  const getUserInit = (() => {
    let submitBtn = document.querySelector("#avatar-button");
    submitBtn.addEventListener("click", () => {
      let name = document.querySelector("#name-input").value;
      let image = document.querySelector(".carousel-item.active").querySelector("img").getAttribute("src");
      gameController.init(name, image);
    })
  })()
  
  return {
    updateButton,
    changeAvatar: (url) => {
      let el = document.querySelector("#avatar");
      el.src = url;
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

    addAlert: (message) => {
      const el = document.querySelector("#game-alert");
      const alert = document.createElement("div");
      alert.className = "alert alert-danger fade show in";
      alert.innerText = message;
      alert.id = "alert-msg"
      el.appendChild(alert);
    },
    removeAlert: () => {
      const el = document.querySelector(`#game-alert`);
      const alert = document.querySelector(`#alert-msg`);
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
      el.classList.add("fadeOut");
      setTimeout(() => {
        el.classList.add("d-none")
      }, 1000);
    },
    fadeIn: (el) => {
      el.classList.remove("d-none")
      setTimeout(() => el.classList.remove("fadeOut"), 1000);
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

    const toggleAlert = (status) => {
      let val = player.status[status].amount;
      if( val < 100 && alert === false) {
        alert = true;
        DOM.addAlert(`Kondisi anda memburuk!`);
      } else if ( val >= 100 && alert === true) {
        alert = false;
        DOM.removeAlert();
      }
    }
    return {
      semesterUp: () => {
        if (player.status.belajar.amount >= 1000) {
          player.semester += 1;
          player.status["belajar"].amount = 0;
        }
        DOM.updateSemester(player.semester);
      },
      belajar: () => {
        if (player.status["belajar"].isActive) {
          player.status["makan"].changeShrink(8); 
          player.status["main"].changeShrink(10); 
        } else {
          player.status["makan"].reset();
          player.status["main"].reset();
        }
      },
      tidur: () => {
        let hours = clock.getHours();
        toggleAlert("tidur")
        if (player.status["tidur"].amount < 200) {
          player.status["belajar"].changeGrowth(10); 
          player.status["main"].changeShrink(30); 
        } else {
          player.status["belajar"].reset();
          player.status["main"].reset();
        }

        if (!(hours > 6 && hours < 22)) {
          player.status["tidur"].changeShrink(10);
        } else {
          player.status["tidur"].reset();
        }
      },
      makan: () => {
        toggleAlert("makan");
        if (player.status["makan"].amount < 200) {
          player.status["belajar"].changeGrowth(10); 
          player.status["main"].changeShrink(30);

        } else {
          player.status["belajar"].reset();
          player.status["main"].reset();
        }

        if (player.status["makan"].amount === 1000 && makanBoost) {
          player.status["main"].amount += 20;
          makanBoost = false;
        }
        if(player.status["makan"].amount === 800) {
          makanBoost = true;
        }
      },
      main: () => {
        toggleAlert("main")
        if (player.status["main"].amount < 200) {
          player.status["belajar"].changeGrowth(20); 
        }
        else if (player.status["main"].amount < 100) {
          player.status["belajar"].changeGrowth(10); 
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

      Algorithm.semesterUp();
      Algorithm.belajar();
      Algorithm.tidur();
      Algorithm.makan();
      Algorithm.main();

      Object.keys(player.status).forEach(val => {
        DOM.updateProgress(
          val, Math.round(player.status[val].amount / 10)
        );
        if (val != "belajar" && player.status[val].amount <= 0) {
          gameOver();
        }
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
    let data = JSON.stringify(player);
    localStorage.setItem("player", data);
  }

  const loadGame = () => {
    let data = JSON.parse(localStorage.getItem("player"));
    if (data) {
      player = Player(data.name, data.avatar, data.semester, data.status);
      console.log(player);
      DOM.changeName(player.name);
      DOM.changeAvatar(player.avatar);
      DOM.updateSemester(player.semester);
      gameClock.start();
      return true;
    }
    return false;
  }

  // TODO
  // Bikin message custom per status
  const gameOver = () => {
    gameClock.stop();
    DOM.fadeOut(document.querySelector("#main-game"));
    DOM.fadeIn(document.querySelector("#game-over"));
  }

  const init = (playerName, avatar) => {
    player = Player(playerName, avatar);
    console.log([player, gameController.player])
    DOM.changeName(player.name);
    DOM.changeAvatar(player.avatar);
    DOM.updateSemester(player.semester);
    initClock();
    DOM.fadeOut(document.querySelector("#avatar-selection"));
    DOM.fadeIn(document.querySelector("#main-game"));
    gameClock.start();
  }

  return {
    init,
    changeClock,
    saveGame,
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
  }
})();

const gameStart = () => {
  if (gameController.loadGame()) {
    DOM.scene("main-game");
  }
  else {
    DOM.scene("avatar-selection");
  }
}