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
    }

    addCard(card) {
      this.cards.push(card);
    }

    getScore() {
      let total = 0;
      let aces = 0;
      for (const card of this.cards) {
        if (card.value === 1) {
          aces++;
          total += 11;
        } else {
          total += card.value;
        }
      }
      while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
      }
      return total;
    }

    getDisplayHand(hidden = false) {
      if (hidden) {
        return ["Hidden", ...this.cards.slice(1).map(c => `${c.value} of ${c.suit}`)].join(', ');
      }
      return this.cards.map(c => `${c.value} of ${c.suit}`).join(', ');
    }
  }

  let player, dealer, deck, balance = 1000, currentBet, gameOver = false, hideDealerCard = true, wins = 0, losses = 0;

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
    document.getElementById('newGameButton').style.display = 'none';
    document.getElementById('message').textContent = '';
    document.getElementById('hitButton').disabled = false;
    document.getElementById('standButton').disabled = false;
    hideDealerCard = true;
    gameOver = false;

    player.addCard(deck.draw());
    dealer.addCard(deck.draw());
    player.addCard(deck.draw());
    dealer.addCard(deck.draw());

    updateDisplay();

    const score = player.getScore();
    if (score === 21) {
      if (dealer.getScore() === 21) {
        balance += currentBet;
        pauseAndReveal(() => endGame("Both have Blackjack! It's a draw."));
      } else {
        balance += currentBet * 2.5;
        pauseAndReveal(() => endGame("Blackjack! You win."));
        wins++;
      }
    } else if (score > 21) {
      pauseAndReveal(() => {
        endGame('Bust on deal! Dealer wins.');
        losses++;
      });
    }
  }

  window.playerHit = function () {
    if (gameOver) return;

    player.addCard(deck.draw());
    const score = player.getScore();
    updateDisplay();
    if (score > 21) {
      pauseAndReveal(() => {
        endGame('Bust! Dealer wins.');
        losses++;
      });
    }
  }

  window.stand = function () {
    if (gameOver) return;
    hideDealerCard = false;
    while (dealer.getScore() < 17) {
      dealer.addCard(deck.draw());
    }
    updateDisplay();

    const playerScore = player.getScore();
    const dealerScore = dealer.getScore();

    pauseAndReveal(() => {
      if (dealerScore > 21 || playerScore > dealerScore) {
        balance += currentBet * 2;
        endGame('You win!');
        wins++;
      } else if (dealerScore > playerScore) {
        endGame('Dealer wins.');
        losses++;
      } else {
        balance += currentBet;
        endGame("It's a draw.");
      }
    });
  }

  function updateDisplay() {
    document.getElementById('playerHand').textContent = player.getDisplayHand();
    document.getElementById('dealerHand').textContent = dealer.getDisplayHand(hideDealerCard);
    document.getElementById('playerScore').textContent = player.getScore();
    document.getElementById('dealerScore').textContent = hideDealerCard ? '?' : dealer.getScore();
    document.getElementById('winLoss').textContent = `Wins: ${wins} | Losses: ${losses}`;
  }

  function endGame(message) {
    gameOver = true;
    hideDealerCard = false;
    updateDisplay();

    const dealerInfo = ` (Dealer: ${dealer.getDisplayHand()} — ${dealer.getScore()})`;
    const messageEl = document.getElementById('message');
    
    // Clear previous highlight
    messageEl.className = '';

    // Add styling based on outcome
    if (message.toLowerCase().includes('win')) {
      messageEl.classList.add('highlight-win');
    } else if (message.toLowerCase().includes('lose')) {
      messageEl.classList.add('highlight-lose');
    } else {
      messageEl.classList.add('highlight-draw');
    }

    messageEl.textContent = message + dealerInfo;

    document.getElementById('balance').textContent = balance;
    document.getElementById('hitButton').disabled = true;
    document.getElementById('standButton').disabled = true;
    document.getElementById('gameArea').style.display = 'none';
    document.getElementById('newGameButton').style.display = 'inline-block';
  }

  window.newGame = function () {
    document.getElementById('newGameButton').style.display = 'none';
    startGame();
  }

  window.resetStats = function () {
    wins = 0;
    losses = 0;
    balance = 1000;
    document.getElementById('balance').textContent = balance;
    document.getElementById('winLoss').textContent = 'Wins: 0 | Losses: 0';
  }

  window.pauseAndReveal = function (callback) {
    const overlay = document.getElementById('overlay');
    if (overlay) {
      overlay.style.display = 'flex';
      setTimeout(() => {
        overlay.style.display = 'none';
        callback();
      }, 800);
    } else {
      callback();
    }
  }
};
