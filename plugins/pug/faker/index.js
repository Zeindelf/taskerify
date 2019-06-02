
const Faker = require('faker');
const assert = require('assert');

const _setLocale = Symbol('setLocale');
const _requiredPackage = Symbol('requiredPackage');
const _verify = Symbol('verify');

/**
 * @description
 * Add faker.js in plug-pug
 * @class FakerPlugin
 */
class FakerPlugin {
  /**
   * Creates an instance of FakerPlugin.
   * @param {any} [fakerLocale=undefined] locale string or nothing
   */
  constructor(fakerLocale = undefined) {
    this.package = 'faker';
    this[_verify](fakerLocale);

    return this[_requiredPackage]();
  }

  /**
   * @description
   * Check if the locale exits and sets the correct package
   * else throw an error
   * @returns {void}
   */
  [_setLocale]() {
    if ( this.isValidLocale() ) {
      this.package = `${this.package}/locale/${this.fakerLocale}`;
    } else {
      throw new Error(`Invalid locale: ${this.fakerLocale}, search in faker.js documentation for a valid locale name`);
    }
  }

  /**
   * @description
   * Check if the locale exists in fakers.js
   * @returns {boolean} isValidLocale
   */
  isValidLocale() {
    return this.fakerLocale in Faker.locales;
  }

  /**
   * @description
   * @returns {Object} package
   */
  [_requiredPackage]() {
    return this.package;
  }

  /**
   * @description
   * Verifies the given locale
   * @param {string} fakerLocale faker locale
   * @returns {void} verify
   */
  [_verify](fakerLocale) {
    assert(
      typeof fakerLocale === 'undefined' || typeof fakerLocale === 'string',
      'Invalid locale: Search in faker.js documentation for a valid locale name'
    );

    if (typeof fakerLocale === 'string') {
      this.fakerLocale = fakerLocale;

      try {
        this[_setLocale]();
      } catch (error) {
        throw error;
      }
    }
  }
}

module.exports = FakerPlugin;
