import random from 'lodash/random'

class RewardSystem {
  constructor() {
    this.texts = [
      ['You are the real MVP!', 'Killing spree!', 'King of the Hill!', 'GG EZ', '/all ff@15 ?'],
      ['I\'m impressed!', 'You are fast learner', 'Just a little bit!', 'Good job', 'Good score'],
      ['You can do better', 'Maybe next time...', 'At least you tried...', 'Really?.. plz', 'Try harder!'],
    ]
  }

  getRewardText(index) {
    return this.texts[index][random(this.texts[index].length - 1)]
  }
}

export default new RewardSystem()
