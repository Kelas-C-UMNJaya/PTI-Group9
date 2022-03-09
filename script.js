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

  const getStatus = { name, belajar, makan, main, tidur };
  const update = () => {
    belajar.updateAmount();
    makan.updateAmount();
    makan.updateAmount();
    main.updateAmount();
    console.log([belajar.amount, makan.amount, main.amount, tidur.amount]);
  }
  return {
    getStatus,
    update,
  }

};

const DOM = () => {

};

let rivo = Player("Rivo");
rivo.update();
