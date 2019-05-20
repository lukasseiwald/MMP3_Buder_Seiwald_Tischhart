let assert = require('assert');

class Particle {
  constructor(type, offset = 0, lifetime, amount){
    this.type = type;
    this.amount = amount;
    this.game = {};
    this.lifetime = lifetime;
    this.offset = offset;
    // this.setParticle(this.type);
  }

  getType() {
    return this.type;
  }

  getAmount() {
    return this.amount;
  }

  getLifetime() {
    return this.lifetime;
  }

  getOffset() {
    return this.offset;
  }
}


let glowingParticles = new Particle('spark', 30, 5000, 100);

describe('particle tests', function() {
  describe('when creating sparkParticles members should be set', function() {
    it('should return spark member', function() {
      assert.equal(glowingParticles.getType(), 'spark');
      assert.expec
    });
    it('should return amount member', function() {
      assert.equal(glowingParticles.getAmount(), 100);
    });
    it('should return offset member', function() {
      assert.equal(glowingParticles.getOffset(), 30);
    });
    it('should return lifetime member', function() {
      assert.equal(glowingParticles.getLifetime(), 5000);
    });
  });
});
