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
        button.classList.remove("btn-primary");
        button.classList.add("btn-warning");
        buttons.forEach(button => {
          if (button != e.target) {
            button.classList.remove("btn-warning");
            button.classList.remove("active");
            button.classList.add("btn-primary");
          }
        });
        if (!(button.classList.contains("active"))) {
          button.classList.remove("btn-warning");
          button.classList.add("btn-primary");
        }
      });
    })
  })();
  return {
    updateProgress,
    updateClock,
    updateButton,
  }
})();

class Status {
  isActive = false;
  constructor(name, inAmount, inGrowth, inShrink) {
    this.name = name
    this.amount = inAmount;
    this.growth = inGrowth;
    this.shrink = inShrink;
  }

  // get = { this.amount, growth, shrink };
  shrinkStats = () => {
    if (!(this.amount <= 0)) {
      this.amount -= this.shrink;
    }
  }

  growStats = () => {
    this.amount += this.growth;
    if (this.amount === 1000) this.amount = 1000;
  }

  active = () => this.isActive = true;
  inactive = () => this.isActive = false;

  changeGrowth = (val) => { this.growth = val; }
  changeShrink = (val) => { this.shrink = val; }
};

const Player = (inName) => {
  let name = inName;
  // TODO
  // let avatar = null;
  let belajar = new Status("belajar", 0, 4, 0);
  let makan = new Status("makan", 500, 100, 4);
  let main = new Status("main", 500, 6, 1);
  let tidur = new Status("tidur", 500, 2, 1);

  const status = { belajar, makan, main, tidur };
  const update = () => {
    belajar.shrinkStats();
    makan.shrinkStats();
    main.shrinkStats();
    tidur.shrinkStats();
  }

  return {
    status,
    update,
  }
};

const gameController = (() => {
  let clock = new Date();
  let player = Player("Rivo");

  const initClock = () => {
    clock.setHours(9);
    clock.setMinutes(55);
    clock.setSeconds(0);
  };

  const incClock = () => clock.setMinutes((clock.getMinutes()) + 1)

  const toggleActive = (status) => {
    player.status[status].active();
    Object.keys(player.status).forEach((obj) => {
      if (obj != status) {
        player.status[obj].inactive()
      }
    })
  }

  const gameClock = setInterval(() => {
    player.update()
    incClock();

    DOM.updateClock([clock.getHours(), clock.getMinutes()]);

    Object.keys(player.status).forEach(val => {
      DOM.updateProgress(
        val, Math.round(player.status[val].amount / 10)
      );
    })
  }, 1000);

  const init = (() => {
    initClock();
  })();

  return {
    init,
    toggleActive,
  }
})();

