window.onload = () => {
  class Card {
    constructor(suit, value) {
      this.suit = suit;
      this.value = value;
    }

    getDisplay() {
      return `${this.value} of ${this.suit}`;
    }
  }

  class Deck {
    constructor() {
      this.cards = [];
      const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
      for (const suit of suits) {
        for (let value = 1; value <= 13; value++) {
          const val = Math.min(value, 10);
          this.cards.push(new Card(suit, val));
        }
      }
      this.shuffle();
    }

    shuffle() {
      for (let i = this.cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
      }
    }

    draw() {
      return this.cards.length > 0 ? this.cards.pop() : new Card("None", 0);
    }
  }

  class Hand {
    constructor() {
      this.cards = [];
      this.score = 0;
    }

    addCard(card) {
      this.cards.push(card);
      if (card.value === 1) {
        this.score += (this.getScore() + 11 <= 21) ? 11 : 1;
      } else {
        this.score += card.value;
      }
    }

    getScore() {
      return this.score;
    }

    getCards() {
      return this.cards;
    }

    getDisplayHand() {
      return this.cards.map(c => `${c.value} of ${c.suit}`).join(', ');
    }
  }

  let player, dealer, deck, balance = 1000, currentBet;

  window.startGame = function () {
    const betInput = document.getElementById('betInput');
    currentBet = parseInt(betInput.value);
    if (isNaN(currentBet) || currentBet <= 0 || currentBet > balance) {
      alert('Invalid bet.');
      return;
    }

    deck = new Deck();
    player = new Hand();
    dealer = new Hand();
    balance -= currentBet;
    document.getElementById('balance').textContent = balance;

    document.getElementById('gameArea').style.display = 'block';
    document.getElementById('message').textContent = '';

    player.addCard(deck.draw());
    dealer.addCard(deck.draw());
    player.addCard(deck.draw());
    dealer.addCard(deck.draw());

    updateDisplay();
  }

  window.playerHit = function () {
    player.addCard(deck.draw());
    updateDisplay();

    if (player.getScore() > 21) {
      endGame('Bust! Dealer wins.');
    }
  }

  window.stand = function () {
    while (dealer.getScore() < 17) {
      dealer.addCard(deck.draw());
    }
    updateDisplay();

    if (dealer.getScore() > 21 || player.getScore() > dealer.getScore()) {
      balance += currentBet * 2;
      endGame('You win!');
    } else if (dealer.getScore() > player.getScore()) {
      endGame('Dealer wins.');
    } else {
      balance += currentBet;
      endGame("It's a draw.");
    }
  }

  function updateDisplay() {
    document.getElementById('playerHand').textContent = player.getDisplayHand();
    document.getElementById('dealerHand').textContent = dealer.getDisplayHand();
    document.getElementById('playerScore').textContent = player.getScore();
    document.getElementById('dealerScore').textContent = dealer.getScore();
  }

  function endGame(message) {
    document.getElementById('message').textContent = message;
    document.getElementById('balance').textContent = balance;
    document.getElementById('gameArea').style.display = 'none';
  }
};
