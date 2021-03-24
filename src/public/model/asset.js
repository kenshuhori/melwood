const Asset = class {
  constructor(amount_current_asset, amount_fixed_asset) {
    this.amount_current_asset = this.removeComma(amount_current_asset);
    this.amount_fixed_asset = this.removeComma(amount_fixed_asset);
    this.amount_all_asset = this.amount_current_asset + this.amount_fixed_asset;
  }

  removeComma(number) {
    let removed = number.replace(/,/g, '');
    return parseInt(removed, 10);
  }
}

module.exports = Asset;
