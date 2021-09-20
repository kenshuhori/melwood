const Liability = class {
  constructor(amount_current_liability, amount_fixed_liability) {
    this.amount_current_liability = this.removeComma(amount_current_liability);
    this.amount_fixed_liability = this.removeComma(amount_fixed_liability);
    this.amount_all_liability = this.amount_current_liability + this.amount_fixed_liability;
  }

  removeComma(number) {
    if (!number) return 0;

    let removed = number.replace(/,/g, '');
    return parseInt(removed, 10);
  }
}

module.exports = Liability;
