class Status {
  constructor(inAmount, inGrowth, inShrink) {
    this.amount = inAmount;
    this.growth = inGrowth;
    this.shrink = inShrink;
  }

  // get = { this.amount, growth, shrink };
  updateAmount = () => {
    if(!(this.amount >= 1000)) {
      this.amount += this.growth;
      this.amount += this.shrink;
    }
  }
  changeGrowth = (val) => { this.growth = val; }
  changeShrink = (val) => { this.shrink = val; }
};

const Player = (inName) => {
  let name = inName;
  let belajar = new Status(0, 4, 0);
  let makan = new Status(500, 100, 4);
  let main = new Status(500, 6, 1);
  let tidur = new Status(500, 2, 1);

  const getStatus = { belajar, makan, main, tidur };
  const update = () => {
    belajar.updateAmount();
    makan.updateAmount();
    main.updateAmount();
    tidur.updateAmount();
  }
  return {
    getStatus,
    update,
  }
};

const DOM = (() => {
  const updateProgress = (status, val) => {
    const el = document.querySelector(`#${status}-progressBar`);
    el.style.width = `${val}%`;
  }
  return {
    updateProgress,
  }
})();

const gameController = (() => {
  let player = Player("Rivo");
  setInterval(() => {
    player.update()
    Object.keys(player.getStatus).forEach(val => {
      console.log(`${val}, ${player.getStatus[val].amount}`)
      DOM.updateProgress(val, Math.round(player.getStatus[val].amount / 10));
    })
  }, 1000);
});

