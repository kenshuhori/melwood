const NetAsset = class {
    constructor(amount_net_asset) {
      this.amount_net_asset = this.removeComma(amount_net_asset);
    }

    removeComma(number) {
      if (!number) return 0;

      let removed = number.replace(/,/g, '');
      return parseInt(removed, 10);
    }
  }

  module.exports = NetAsset;
