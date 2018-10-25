const expect = require('chai').expect;
const user = require('../../models/user');
const request = require("request");

describe('User routes test', () => {
  describe('Name Validation', () => {
    it('Checks valid names', () => {
      const test1 = validators.nameValidation({ name: 'John Doe' });
      const test2 = validators.nameValidation({ name: 'Jane Doe' });

      expect(test1 === { valid: true, msg: 'name accepted' });
      expect(test2 === { valid: true, msg: 'name accepted' });
    });
    it('Checks invalid names', () => {
      const test1 = validators.nameValidation({ name: '' });
      const test2 = validators.nameValidation({ name: 'a' });
      const test3 = validators.nameValidation({ name: 'John Doe @' });

      expect(test1 === { valid: false, msg: 'name is required' });
      expect(test2 === { valid: false, msg: 'name is too short' });
      expect(test3 === { valid: false, msg: 'name contains invalid characters' });
    });
    it('Checks invalid messages', () => {
      const test1 = validators.nameValidation({ email: 'Jon Doe' });
      const test2 = validators.nameValidation({});
      const test3 = validators.nameValidation();

      expect(test1 === { valid: false, msg: 'wrong message format' });
      expect(test2 === { valid: false, msg: 'wrong message format' });
      expect(test3 === { valid: false, msg: 'wrong message format' });
    });
  });

});