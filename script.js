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

const Player = (inName) => {
  let name = inName;
  // TODO
  // Bikin variabel untuk nyimpan url avatarnya
  let belajar = new Status("belajar", 0, 10, 0); 
  let makan = new Status("makan", 500, 100, 4); 
  let main = new Status("main", 500, 60, 8); 
  let tidur = new Status("tidur", 500, 20, 1); 
  
  let semester = 1;

  const status = { belajar, makan, main, tidur };
  const update = () => {
    belajar.update();
    makan.update();
    main.update();
    tidur.update();
  }

  return {
    name,
    semester,
    status,
    update,
  }
};

const DOM = (() => {
  // TODO
  // BIKIN BERKEDIP KALAU DIBAWAH 10%
  const updateProgress = (status, val) => {
    const el = document.querySelector(`#${status}-progressBar`);
    el.style.width = `${val}%`;
    el.innerText = `${val}%`;
  }
  const updateSemester = (val) => {
    const el = document.querySelector("#semester-now");
    el.innerText = val;
  }

  const updateClock = ([hours, minutes]) => {
    hours = hours >= 10 ? hours : "0" + hours;
    minutes = minutes >= 10 ? minutes : "0" + minutes;
    const clock = document.querySelector("#jam");
    clock.innerText = `${hours}:${minutes}`;
  }

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
  
  // TODO 
  // BIKIN JADI SATU AJA ALERTNYA
  // GA BANYAK

  const addAlert = (status, message) => {
    const el = document.querySelector("#game-alert");
    const alert = document.createElement("div");
    alert.className = "alert alert-danger alert-dismissible fade show in";
    alert.innerText = message;
    alert.id = `alert-${status}`;
    el.appendChild(alert);
  }
  const removeAlert = (status) => {
    const el = document.querySelector(`#game-alert`);
    const alert = document.querySelector(`#alert-${status}`);
    el.removeChild(alert);
  }

  const changeBg = (url) => {
    const bg = document.querySelector("#bg-image");
    if(bg.style.backgroundImage.includes(url)) return;
    bg.style.backgroundImage = `url(${url})`;
  }

  const changeName = (name) => {;
    const el = document.querySelector("#nama-player");
    el.innerText = name;
  }

  return {
    addAlert,
    removeAlert,
    updateSemester,
    changeName,
    changeBg,
    updateProgress,
    updateClock,
    updateButton,
  }
})();

const gameController = (() => {
  let clock = new Date();
  let player = Player("Rivo");

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
    let alert = {
      makan: false,
      main: false,
      tidur: false,
    }

    const toggleAlert = (status) => {
      let val = player.status[status].amount;
      if( val < 100 && alert[status] === false) {
        alert[status] = true;
        DOM.addAlert(status, `${status} is running out!`);
      } else if ( val >= 100 && alert[status] === true) {
        alert[status] = false;
        DOM.removeAlert(status);
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
          // TODO
          // Kasih prompt ketika udah kurang dari 100
        } else {
          player.status["belajar"].reset();
        }
      }
    }
  })();

  const gameClock = setInterval(() => {
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
    })
  }, 1000);

  const init = (() => {
    DOM.changeName(player.name);
    DOM.updateSemester(player.semester);
    initClock();
  })();

  return {
    init,
    changeClock,
    toggleActive,
    player,
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
      gameController.player.status["belajar"].amount = 950;
    },
    turuninSemua: () => {
      gameController.player.status["tidur"].amount = 150;
      gameController.player.status["makan"].amount = 150;
      gameController.player.status["main"].amount = 150;
    },
    naikinSemua: () => {
      gameController.player.status["tidur"].amount = 900;
      gameController.player.status["makan"].amount = 900;
      gameController.player.status["main"].amount = 900;
    }
  }
})();
