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
  let belajar = new Status("belajar", 0, 4, 0);
  let makan = new Status("makan", 500, 100, 4);
  let main = new Status("main", 500, 6, 1);
  let tidur = new Status("tidur", 500, 2, 1);

  const status = { belajar, makan, main, tidur };
  const update = () => {
    belajar.update();
    makan.update();
    main.update();
    tidur.update();
  }

  return {
    name,
    status,
    update,
  }
};

const DOM = (() => {
  const updateProgress = (status, val) => {
    const el = document.querySelector(`#${status}-progressBar`);
    el.style.width = `${val}%`;
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
    changeClock(hours, minutes + 1);
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
    return {
      belajar: () => {
        if (player.status["belajar"].isActive) {
          player.status["makan"].changeShrink(6);
          player.status["main"].changeShrink(3);
        } else {
          player.status["makan"].reset();
          player.status["main"].reset();
        }
      },
      tidur: () => {
        if (player.status["tidur"].amount < 200) {
          player.status["belajar"].changeGrowth(1);
          player.status["main"].changeShrink(3);

          // TODO
          // Kasih prompt ketika udah kurang dari 100
        } else {
          player.status["belajar"].reset();
          player.status["main"].reset();
        }
      },
      makan: () => {
        if (player.status["makan"].amount < 200) {
          player.status["belajar"].changeGrowth(1);
          player.status["main"].changeShrink(3);

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
          player.status["belajar"].changeGrowth(2);
        }
        else if (player.status["main"].amount < 100) {
          player.status["belajar"].changeGrowth(1);
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

    Algorithm.belajar();
    Algorithm.tidur();
    Algorithm.makan();
    Algorithm.main();

    DOM.updateClock([clock.getHours(), clock.getMinutes()]);

    Object.keys(player.status).forEach(val => {
      DOM.updateProgress(
        val, Math.round(player.status[val].amount / 10)
      );
    })
  }, 1000);

  const init = (() => {
    DOM.changeName(player.name);
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
  return {
    timetravel,
  }
})();
