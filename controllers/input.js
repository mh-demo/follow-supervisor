/* eslint-disable no-useless-escape */

export default class ValidInput {
  static #optional = ['email', 'phoneNumber', 'contactPref'];

  static #minLength = {
    contactPref: 4,
    supervisor: 36,
    firstName: 1,
    lastName: 1,
    phoneNumber: 9,
    email: 5,
  };

  static #maxLength = {
    contactPref: 5,
    supervisor: 36,
    firstName: 64,
    lastName: 64,
    phoneNumber: 16,
    email: 256,
  };

  static #pattern = {
    contactPref: /^(text|email)$/,
    supervisor: /^[a-fA-F0-9-]+$/,
    firstName: /^[a-zA-Z'-]+$/,
    lastName: /^[a-zA-Z'-]+$/,
    phoneNumber: /^[0-9\+\-\(\)\.]+$/,
    email:
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  };

  static compare(type, value) {
    return (
      (this.#optional.includes(type) && !value) ||
      (value.length >= this.#minLength[type] &&
        value.length <= this.#maxLength[type] &&
        this.#pattern[type].test(value))
    );
  }
}
