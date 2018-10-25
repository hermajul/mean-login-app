const expect = require('chai').expect;
const validators = require('../../scripts/validators');
var chai = require('chai');

describe('Validators API', () => {
  describe('Name Validation', () => {
    it('Checks valid names', () => {
      const test1 = validators.nameValidation({ name: 'JohnDoe' });
      const test2 = validators.nameValidation({ name: 'Jane Doe' });

      expect(test1).to.deep.equal({ valid: true, msg: 'name accepted' });
      expect(test2).to.deep.equal({ valid: true, msg: 'name accepted' });
    });
    it('Checks invalid names', () => {
      const test1 = validators.nameValidation({ name: '' });
      const test2 = validators.nameValidation({ name: 'a' });
      const test3 = validators.nameValidation({ name: 'John Doe @' });

      expect(test1).to.deep.equal({ valid: false, msg: 'name is required' });
      expect(test2).to.deep.equal({ valid: false, msg: 'name is too short' });
      expect(test3).to.deep.equal({ valid: false, msg: 'name contains invalid characters' });
    });
    it('Checks invalid messages', () => {
      const test1 = validators.nameValidation({ email: 'Jon Doe' });
      const test2 = validators.nameValidation({});
      const test3 = validators.nameValidation();

      expect(test1).to.deep.equal({ valid: false, msg: 'wrong message format' });
      expect(test2).to.deep.equal({ valid: false, msg: 'wrong message format' });
      expect(test3).to.deep.equal({ valid: false, msg: 'wrong message format' });
    });
  });

  describe('Email Validation', () => {
    it('Checks valid emails', (done) => {
      const test1 = validators.emailValidation({ email: 'John@Doe.de' });
      const test2 = validators.emailValidation({ email: 'Jane@Doe.com' });
      const test3 = validators.emailValidation({ email: 'test@test.org' });

      expect(test1).to.deep.equal({ valid: true, msg: 'email accepted' });
      expect(test2).to.deep.equal({ valid: true, msg: 'email accepted' });
      expect(test3).to.deep.equal({ valid: true, msg: 'email accepted' });
    });
    it('Checks invalid emails', () => {
      const test1 = validators.emailValidation({ email: '' });
      const test2 = validators.emailValidation({ email: 'janedoe@.de' });
      const test3 = validators.emailValidation({ email: 'John@doe' });

      expect(test1).to.deep.equal({ valid: false, msg: 'email not valid' });
      expect(test2).to.deep.equal({ valid: false, msg: 'email not valid' });
      expect(test3).to.deep.equal({ valid: false, msg: 'email not valid' });
    });
    it('Checks invalid messages', () => {
      const test1 = validators.emailValidation({ name: 'Jon Doe' });
      const test2 = validators.emailValidation({});
      const test3 = validators.emailValidation();

      expect(test1).to.deep.equal({ valid: false, msg: 'wrong message format' });
      expect(test2).to.deep.equal({ valid: false, msg: 'wrong message format' });
      expect(test3).to.deep.equal({ valid: false, msg: 'wrong message format' });
    });
  });

  describe('Email Validation on Update', () => {
    it('Checks valid emails', () => {
      const test1 = validators.emailValidationOnUpdate({ email: 'John@Doe.de' });
      const test2 = validators.emailValidationOnUpdate({ email: 'Jane@Doe.com' });
      const test3 = validators.emailValidationOnUpdate({ email: 'test@test.org' });

      expect(test1).to.deep.equal({ valid: true, msg: 'email accepted' });
      expect(test2).to.deep.equal({ valid: true, msg: 'email accepted' });
      expect(test3).to.deep.equal({ valid: true, msg: 'email accepted' });
    });
    it('Checks invalid emails', () => {
      const test1 = validators.emailValidationOnUpdate({ email: '' });
      const test2 = validators.emailValidationOnUpdate({ email: 'janedoe@.de' });
      const test3 = validators.emailValidationOnUpdate({ email: 'John@doe' });

      expect(test1).to.deep.equal({ valid: false, msg: 'email not valid' });
      expect(test2).to.deep.equal({ valid: false, msg: 'email not valid' });
      expect(test3).to.deep.equal({ valid: false, msg: 'email not valid' });
    });
    it('Checks invalid messages', () => {
      const test1 = validators.emailValidationOnUpdate({ name: 'Jon Doe' });
      const test2 = validators.emailValidationOnUpdate({});
      const test3 = validators.emailValidationOnUpdate();

      expect(test1).to.deep.equal({ valid: false, msg: 'wrong message format' });
      expect(test2).to.deep.equal({ valid: false, msg: 'wrong message format' });
      expect(test3).to.deep.equal({ valid: false, msg: 'wrong message format' });
    });
  });
});
