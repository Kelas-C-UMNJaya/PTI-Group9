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
  let belajar = new Status("belajar", 0, 40, 0); // NOTE: Gw nyoba naikin 10% biar lebih cepet
  let makan = new Status("makan", 500, 100, 20); // NOTE: Gw nyoba naikin 10% biar lebih cepet
  let main = new Status("main", 500, 60, 10); // NOTE: Gw nyoba naikin 10% biar lebih cepet
  let tidur = new Status("tidur", 500, 20, 5); // NOTE: Gw nyoba naikin 10% biar lebih cepet
  
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

  const changeBg = (hours) => {
    const bg = document.querySelector("#bg-image");
    if (hours >= 6 && hours <= 16) {
      bg.style.backgroundImage = "url('./assets/day.png')";
    } else if (hours >= 16 && hours <= 20) {
      bg.style.backgroundImage = "url('./assets/evening.png')";
    } else {
      bg.style.backgroundImage = "url('./assets/night.png')";
    }
  }

  const changeName = (name) => {;
    const el = document.querySelector("#nama-player");
    el.innerText = name;
  }

  return {
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
    DOM.changeBg(hours);
  };
  const updateClock = () => {
    const [hours, minutes] = [clock.getHours(), clock.getMinutes()];
    DOM.updateClock([hours, minutes]);
    changeClock(hours, minutes + 5);
  }

  // create a function that would increase the player's semester
  // everytime the belajar status of the player is reaching 1000
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
          player.status["makan"].changeShrink(60); // NOTE: Gw nyoba naikin 10% biar lebih cepet
          player.status["main"].changeShrink(30); // NOTE: Gw nyoba naikin 10% biar lebih cepet
        } else {
          player.status["makan"].reset();
          player.status["main"].reset();
        }
      },
      tidur: () => {
        if (player.status["tidur"].amount < 200) {
          player.status["belajar"].changeGrowth(10); // NOTE: Gw nyoba naikin 10% biar lebih cepet
          player.status["main"].changeShrink(30); // NOTE: Gw nyoba naikin 10% biar lebih cepet

          // TODO
          // Kasih prompt ketika udah kurang dari 100
        } else {
          player.status["belajar"].reset();
          player.status["main"].reset();
        }
      },
      makan: () => {
        if (player.status["makan"].amount < 200) {
          player.status["belajar"].changeGrowth(10); // NOTE: Gw nyoba naikin 10% biar lebih cepet
          player.status["main"].changeShrink(30); // NOTE: Gw nyoba naikin 10% biar lebih cepet

          // TODO
          // Kasih prompt ketika udah kurang dari 100
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
        if (player.status["main"].amount < 200) {
          player.status["belajar"].changeGrowth(20); // NOTE: Gw nyoba naikin 10% biar lebih cepet
        }
        else if (player.status["main"].amount < 100) {
          player.status["belajar"].changeGrowth(10); // NOTE: Gw nyoba naikin 10% biar lebih cepet
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
  const timetravel = (jam) => {
    switch(jam) {
      case "pagi":
        gameController.changeClock(9, 55);
        break;
      case "siang":
        gameController.changeClock(12, 55);
        break;
      case "sore":
        gameController.changeClock(16, 55);
        break;
      case "malam":
        gameController.changeClock(23, 55);
        break;
      default:
        console.log("Menunya tidak ada");
        break;
    }
  }
  const maxBelajar = () => {
    gameController.player.status["belajar"].amount = 950;
  }
  return {
    timetravel,
    maxBelajar,
  }
})();
