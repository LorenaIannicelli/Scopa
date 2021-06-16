<template>
  <div class="play" v-if="user">
    <div class="clickToPlay" v-if="!gameInSession">
      <button
        type="submit"
        class="pure-button pure-button-primary"
        @click.prevent="startGame"
      >
        Click to play!
      </button>
      <div id="howToPlay">
        <p>How to play Scopa:</p>
        <p>
          Goal: Get more points than your opponent by picking up high scoring
          cards
        </p>
        <p>On your turn: There are three things you can do on your turn</p>
        <ul>
          <li>
            Look at your cards. If you have a card with the same value as a card
            on the table, you can use the card in your hand to pick up the
            matching card on the table and add both to your "won cards" pile
          </li>
          <li>
            If you don't have a matching card, maybe you can do some math to
            pick up a card! Look on the table- are there two cards whose values
            add up to a card in your hand? If so, you can use the one card in
            your hand to pick up both of the cards on the table and add them to
            your "won cards" pile. But be careful, if the card in your hand
            matches a card on the table, you must use the card in your hand to
            pick up the exact match, not the sum
          </li>
          <li>
            Finally, if you can't pick up any cards, then you must put a card
            from your hand onto the table. Now your opponent can try and get
            that card, or you can win it back on your next turn
          </li>
        </ul>
        <p>
          Getting a scopa: Sometimes, you will have the opportunity to pick up
          all the cards on the table!! When this happens, it is called a scopa,
          because you 'swept' the table clean of cards. After you pick up all
          the cards in the center, the next player has to put one of their cards
          back on the table.
        </p>
        <p>Scoring:</p>
        <ul>
          <li>Having the most cards: 1 point</li>
          <li>
            Having the most denari, which is the suit with gold coins: 1 point
          </li>
          <li>Having the most sevens: 1 point</li>
          <li>Earning a scopa: 1 point per scopa</li>
          <li>
            Having the settebello, which is the 7 of denari (coins): 1 point
          </li>
        </ul>
      </div>
    </div>
    <div id="results" v-else-if="finishedGame">
      <p class="pointHeader"><u>Opponent's points:</u></p>
      <p v-if="cpuAwards.length == 0">None :/</p>
      <div v-for="award in cpuAwards" v-bind:key="award._id">
        <p>{{ award }}</p>
      </div>
      <p>Total: {{ this.cpuPoints }}</p>

      <p class="pointHeader"><u>Your points:</u></p>
      <p v-if="playerAwards.length == 0">None :/</p>

      <div v-for="award in playerAwards" v-bind:key="award._id">
        <p>{{ award }}</p>
      </div>
      <p>Total: {{ this.playerPoints }}</p>

      <p id="winMesesage">{{ winMessage }}</p>
      <div class="clickToPlay">
        <button
          type="submit"
          class="pure-button pure-button-primary"
          @click.prevent="startGame"
        >
          Click to play again!
        </button>
      </div>
    </div>

    <div v-else-if="gameInSession">
      <div>
        <p class="turn" v-if="playerTurn">
          It's your turn! Click on a card in your hand to play!
        </p>
        <p class="turn" v-else>It's your opponent's turn!</p>
      </div>
      <div id="redBar">
        <p>Opponent's Hand:</p>
        <div id="opponentCards">
          <div v-for="card in cpuActiveCards" v-bind:key="card._id">
            <img src="/images/backOfCard.jpg" />
          </div>
          <img
            class="wonCards"
            v-if="cpuWonCards.length != 0"
            src="/images/backOfCard.jpg"
          />
        </div>
      </div>
      <div id="tableCards">
        <div v-if="tableCards.length == 0">
          <p id="table">!!Scopa!!</p>
        </div>
        <div v-else v-for="card in tableCards" v-bind:key="card._id">
          <img :src="card.Path" />
        </div>
      </div>
      <div id="greenBar">
        <p>Your Hand:</p>
        <div id="playerCards">
          <div v-for="card in playerActiveCards" v-bind:key="card._id">
            <img :src="card.Path" v-on:click="imageClicked(card)" />
          </div>
          <img
            class="wonCards"
            v-if="playerWonCards.length != 0"
            src="/images/backOfCard.jpg"
          />
        </div>
      </div>
    </div>
  </div>

  <Login v-else />
</template>

<script>
import Login from "@/components/Login.vue";
import axios from "axios";
export default {
  name: "play",
  components: {
    Login,
  },
  data() {
    return {
      gameInSession: Boolean,
      playerTurn: Boolean,
      finishedGame: Boolean,
      tableCards: [],
      cpuActiveCards: [],
      playerActiveCards: [],
      cpuWonCards: [],
      playerWonCards: [],
      deck: [],
      cpuPoints: Number,
      playerPoints: Number,
      playedCard: Object,
      playerPickedLast: Boolean,
      cpuAwards: [],
      playerAwards: [],
      winMessage: String,
      playerWon: Boolean,
      playerHadSetebello: Boolean,
    };
  },
  async created() {
    this.gameInSession = false;
    this.finishedGame = false;
    try {
      let response = await axios.get("/api/users");
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }
  },

  computed: {
    user() {
      return this.$root.$data.user;
    },
  },
  methods: {
    //start the game when button is pressed
    startGame() {
      this.gameInSession = true;
      this.finishedGame = false;
      this.playerAwards = [];
      this.cpuAwards = [];
      this.playerWon = false;
      this.initializePoints();
      this.getDeck();
      this.shuffle();
      this.initialDeal();
    },
    //return everyone's points to zero
    initializePoints() {
      this.cpuPoints = 0;
      this.playerPoints = 0;
    },
    //make the deck of cards
    getDeck() {
      var suits = ["cups", "swords", "clubs", "coins"];
      var values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      let deck = new Array();
      for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < values.length; j++) {
          let path = "/images/cards/";
          if (values[j] == 8) {
            path += suits[i] + "_l.jpg";
          } else if (values[j] == 9) {
            path += suits[i] + "_h.jpg";
          } else if (values[j] == 10) {
            path += suits[i] + "_k.jpg";
          } else {
            path += suits[i] + "_" + values[j] + ".jpg";
          }
          let card = { Value: values[j], Suit: suits[i], Path: path };
          deck.push(card);
        }
      }
      this.deck = deck;
    },
    //shuffle the deck
    shuffle() {
      // for 1000 turns
      // switch the values of two random cards
      for (var i = 0; i < 1000; i++) {
        var location1 = Math.floor(Math.random() * this.deck.length);
        var location2 = Math.floor(Math.random() * this.deck.length);
        var tmp = this.deck[location1];

        this.deck[location1] = this.deck[location2];
        this.deck[location2] = tmp;
      }
    },
    //deal the players and the table
    initialDeal() {
      //deal the players
      for (let i = 0; i < 3; i++) {
        this.cpuActiveCards.push(this.deck[0]);
        this.deck.splice(0, 1);
        this.playerActiveCards.push(this.deck[0]);
        this.deck.splice(0, 1);
      }
      //deal the table
      for (let i = 0; i < 4; i++) {
        this.tableCards.push(this.deck[0]);
        this.deck.splice(0, 1);
      }
    },

    //deal just the players
    deal() {
      //deal the players
      for (let i = 0; i < 3; i++) {
        this.cpuActiveCards.push(this.deck[0]);
        this.deck.splice(0, 1);
        this.playerActiveCards.push(this.deck[0]);
        this.deck.splice(0, 1);
      }
    },

    //player took their turn
    imageClicked(card) {
      this.play(card);
    },

    //take a turn
    async play(card) {
      //make sure there are still cards to be played
      if (
        this.playerActiveCards.length > 0 &&
        this.cpuActiveCards.length > 0 &&
        this.playerTurn
      ) {
        this.playedCard = card;
        this.determinePoints();
        this.playerTurn = false;
        await setTimeout(this.executeCPUMove, 3000);
      }
    },

    //have the cpu play a card. Redeal the table when necessary
    executeCPUMove() {
      let cpuIndex = this.determineCPUMove(); //cpu move
      this.playedCard = this.cpuActiveCards[cpuIndex];
      this.determinePoints(); //cpu plays
      //if there are no more cards on table, deal
      if (
        this.cpuActiveCards.length == 0 &&
        this.playerActiveCards.length == 0 &&
        this.deck.length > 0
      ) {
        this.deal();
      } //if there are no cards left, end the game
      else if (
        this.deck.length == 0 &&
        this.cpuActiveCards.length == 0 &&
        this.playerActiveCards.length == 0
      ) {
        this.finishedGame = true;
        this.endGame();
      }
      this.playerTurn = true;
    },

    //returns index of card to play
    determineCPUMove() {
      //go through all of CPU cards
      for (let i = 0; i < this.cpuActiveCards.length; i++) {
        let playedCard = this.cpuActiveCards[i];

        //check if there is a match on the table!!!
        for (let x = 0; x < this.tableCards.length; x++) {
          if (playedCard.Value == this.tableCards[x].Value) {
            return i;
          }
        }

        //there was no match, check if playedCard is sum
        for (let x = 0; x < this.tableCards.length - 1; x++) {
          for (let j = x + 1; j < this.tableCards.length; j++) {
            let sum = this.tableCards[x] + this.tableCards[j];
            if (playedCard.Value == sum) {
              return i;
            }
          }
        }
      }
      //there were no good moves
      return 0;
    },
    //determine the points and won cards from last played card.
    determinePoints() {
      //first, find index in current player's hand
      let index = -1;
      if (this.playerTurn) {
        for (let i = 0; i < this.playerActiveCards.length; i++) {
          if (
            this.playedCard.Value == this.playerActiveCards[i].Value &&
            this.playedCard.Suit == this.playerActiveCards[i].Suit
          )
            index = i;
        }
      } else {
        for (let i = 0; i < this.cpuActiveCards.length; i++) {
          if (
            this.playedCard.Value == this.cpuActiveCards[i].Value &&
            this.playedCard.Suit == this.cpuActiveCards[i].Suit
          )
            index = i;
        }
      }
      //check if there is a match on the table!!!
      for (let i = 0; i < this.tableCards.length; i++) {
        if (this.playedCard.Value == this.tableCards[i].Value) {
          let wonHandCard = {
            Value: this.playedCard.Value,
            Suit: this.playedCard.Suit,
            Path: this.playedCard.Path,
          };
          //player's turn
          if (this.playerTurn) {
            this.playerWonCards.push(wonHandCard);
            this.playerWonCards.push(this.tableCards[i]);
            this.playerActiveCards.splice(index, 1);
            //you picked up the last card, so you get a point for scopa
            if (this.checkForScopa(1)) {
              this.incrementPlayerPoints();
            }
            this.playerPickedLast = true;
          }
          //cpu's turn
          else {
            this.cpuWonCards.push(wonHandCard);
            this.cpuWonCards.push(this.tableCards[i]);
            this.cpuActiveCards.splice(index, 1);
            //you picked up the last card, so you get a point for scopa
            if (this.checkForScopa(1)) {
              this.incrementCPUPoints();
            }
            this.playerPickedLast = false;
          }
          this.tableCards.splice(i, 1);
          this.playedCard = null;
          return;
        }
      }

      //there was no match, check if playedCard is sum
      for (let i = 0; i < this.tableCards.length - 1; i++) {
        for (let j = i + 1; j < this.tableCards.length; j++) {
          let sum = this.tableCards[i].Value + this.tableCards[j].Value;
          if (this.playedCard.Value == sum) {
            let wonHandCard = {
              Value: this.playedCard.Value,
              Suit: this.playedCard.Suit,
              Path: this.playedCard.Path,
            };
            if (this.playerTurn) {
              this.playerWonCards.push(wonHandCard);
              this.playerWonCards.push(this.tableCards[i]);
              this.playerWonCards.push(this.tableCards[j]);
              this.playerActiveCards.splice(index, 1);
              if (this.checkForScopa(2)) {
                this.incrementPlayerPoints();
              }
              this.playerPickedLast = true;
            } else {
              this.cpuWonCards.push(wonHandCard);
              this.cpuWonCards.push(this.tableCards[i]);
              this.cpuWonCards.push(this.tableCards[j]);
              this.cpuActiveCards.splice(index, 1);
              if (this.checkForScopa(2)) {
                this.incrementCPUPoints();
              }
              this.playerPickedLast = false;
            }
            //remove cards from table
            this.tableCards.splice(i, 1);
            this.tableCards.splice(j - 1, 1);
            this.playedCard = null;
            return;
          }
        }
      }

      //no possible moves
      this.tableCards.push(this.playedCard);
      if (this.playerTurn) {
        this.playerActiveCards.splice(index, 1);
      } else {
        this.cpuActiveCards.splice(index, 1);
      }
      this.playedCard = null;
      return;
    },
    //check if there was a scopa
    checkForScopa(emptyTable) {
      if (this.tableCards.length == emptyTable) return true;
      return false;
    },
    //increment player points
    incrementPlayerPoints() {
      this.playerPoints += 1;
    },
    //add to cpu points
    incrementCPUPoints() {
      this.cpuPoints += 1;
    },
    //end of game, determine who got what points
    calculateScore() {
      //give remaining cards to last player to pick up (if applicable)
      if (this.tableCards.length > 0) {
        let numCards = this.tableCards.length;
        //user picked up cards last, they get the rest
        if (this.playerPickedLast) {
          //go through all the cards
          for (let i = 0; i < numCards; i++) {
            this.playerWonCards.push(this.tableCards[0]);
            this.tableCards.splice(0, 1);
          }
        } else {
          //go through all the cards
          for (let i = 0; i < numCards; i++) {
            this.cpuWonCards.push(this.tableCards[0]);
            this.tableCards.splice(0, 1);
          }
        }
      }

      let playerSevens = 0;
      let cpuSevens = 0;
      let playerDenari = 0;
      let cpuDenari = 0;
      this.playerHadSetebello = false;

      //assign scopa points
      if (this.playerPoints > 0) {
        this.playerAwards.push("Scopa x" + this.playerPoints);
      }

      if (this.cpuPoints > 0) {
        this.cpuAwards.push("Scopa x" + this.cpuPoints);
      }

      //figure out how many of each points player had
      for (let i = 0; i < this.playerWonCards.length; i++) {
        if (this.playerWonCards[i].Suit == "coins") {
          playerDenari++;
        }
        if (this.playerWonCards[i].Value == 7) {
          playerSevens++;
        }
        if (
          this.playerWonCards[i].Value == 7 &&
          this.playerWonCards[i].Suit == "coins"
        ) {
          this.playerHadSetebello = true;
        }
      }

      //figure out how many of each points cpu had
      for (let i = 0; i < this.cpuWonCards.length; i++) {
        if (this.cpuWonCards[i].Suit == "coins") {
          cpuDenari++;
        }
        if (this.cpuWonCards[i].Value == 7) {
          cpuSevens++;
        }
      }

      //determine who had mostCards
      if (this.playerWonCards.length > this.cpuWonCards.length) {
        this.incrementPlayerPoints();
        this.playerAwards.push("Most Cards");
      } else if (this.cpuWonCards.length > this.playerWonCards.length) {
        this.incrementCPUPoints();
        this.cpuAwards.push("Most Cards");
      }

      //determine who had the most sevens
      if (playerSevens > cpuSevens) {
        this.incrementPlayerPoints();
        this.playerAwards.push("Primiera (most sevens)");
      } else if (cpuSevens > playerSevens) {
        this.incrementCPUPoints();
        this.cpuAwards.push("Primiera (most sevens)");
      }

      //determine who had the most coins
      if (playerDenari > cpuDenari) {
        this.incrementPlayerPoints();
        this.playerAwards.push("Denari (most coins)");
      } else if (cpuDenari > playerDenari) {
        this.incrementCPUPoints();
        this.cpuAwards.push("Denari (most coins)");
      }

      //determine who had setebello
      if (this.playerHadSetebello) {
        this.incrementPlayerPoints();
        this.playerAwards.push("Setebello");
      } else {
        this.incrementCPUPoints();
        this.cpuAwards.push("Setebello");
      }
      //determine who won
      if (this.playerPoints > this.cpuPoints) {
        this.winMessage = "You won!";
        this.playerWon = true;
      } else if (this.cpuPoints > this.playerPoints) {
        this.winMessage = "You lost :(";
      } else {
        this.winMessage = "tie!";
      }
    },

    //end the game, calculate points and update database
    async endGame() {
      let gamesLost = 0;
      let gamesWon = 0;
      let wonScopas = this.playerPoints;
      let setebellos = 0;
      this.calculateScore();
      //calculate point values
      if (this.playerWon) {
        gamesWon = 1;
      } else {
        gamesLost = 1;
      }
      if (this.playerHadSetebello) {
        setebellos = 1;
      }
      try {
        await axios.put("/api/playerStats/", {
          gamesLost: gamesLost,
          gamesWon: gamesWon,
          wonScopas: wonScopas,
          setebellos: setebellos,
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
button {
  margin-top: 1em;
}
#redBar {
  background-color: #bf211e;
  color: #f4edea;
}

#redBar p {
  padding-top: 1em;
}

#greenBar {
  background-color: #134611;
  color: #f4edea;
}
#greenBar p {
  padding-top: 1em;
  margin-top: 0em;
}

#opponentCards {
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: #bf211e;
  height: 30%;
  align-items: center;
}

#tableCards {
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: #f4edea;
  height: 30%;
  align-items: center;
}

#playerCards {
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 30%;
  align-items: center;
}

#howToPlay {
  width: 70%;
  justify-self: center;
  border: solid;
  text-align: left;
  padding-left: 1em;
  padding-right: 1em;
  margin: auto;
  margin-top: 2em;
}

.wonCards {
  margin-left: 10em;
  border: black;
}

.clickToPlay {
  height: 50em;
}

.cardCount {
  color: #f4edea;
}

#table {
  height: 300%;
  font-size: 1.4em;
}

.turn {
  font-size: 1.4em;
}

#winMesesage {
  font-size: 1.2em;
}

.pointHeader {
  font-size: 1.1em;
}

img {
  width: 7em;
  margin-left: 1em;
  margin-top: 0.5em;
  margin-bottom: 2em;
}

/* Masonry on medium-sized screens */
@media only screen and (max-width: 1023px) and (min-width: 768px) {
  img {
    width: 4em;
    margin-left: 0.5em;
    margin-top: 0.25em;
    margin-bottom: 1em;
  }
}

/* Masonry on small screens */
@media only screen and (max-width: 767px) and (min-width: 540px) {
  img {
    width: 2em;
    margin-left: 0.25em;
    margin-top: 0.125em;
    margin-bottom: 0.5em;
  }
}
</style>
