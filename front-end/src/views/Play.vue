<template>
  <div class="play" v-if="user">
    <div id="clickToPlay" v-if="!gameInSession">
      <button
        type="submit"
        class="pure-button pure-button-primary"
        @click.prevent="startGame"
      >
        Click to play!
      </button>
    </div>
    <div v-else>
      <div>
        <p v-if="playerTurn">It's your turn!</p>
        <p v-else>It's your opponent's turn!</p>
      </div>
      <div id="opponentCards">
        <div v-for="card in cpuActiveCards" v-bind:key="card._id">
          <!-- <img src="/images/backOfCard.jpg" /> -->
          <img :src="card.Path" />
        </div>
        <div v-if="cpuWonCards.length > 0">
          <img src="/images/backOfCard.jpg" />
          <p class="cardCount">{{ cpuWonCards.length }}</p>
        </div>
      </div>
      <div id="tableCards">
        <div v-for="card in tableCards" v-bind:key="card._id">
          <img :src="card.Path" />
        </div>
      </div>
      <div id="playerCards">
        <div v-for="card in playerActiveCards" v-bind:key="card._id">
          <img :src="card.Path" v-on:click="imageClicked(card)" />
        </div>
        <div v-if="playerWonCards.length > 0">
          <img src="/images/backOfCard.jpg" />
          <p class="cardCount">{{ playerWonCards.length }}</p>
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
    };
  },
  async created() {
    this.gameInSession = false;
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
    startGame() {
      this.gameInSession = true;
      this.finishedGame = false;
      this.initializePoints();
      this.getDeck();
      this.shuffle();
      this.initialDeal();
    },
    initializePoints() {
      this.cpuPoints = 0;
      this.playerPoints = 0;
    },
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

    deal() {
      //deal the players
      for (let i = 0; i < 3; i++) {
        this.cpuActiveCards.push(this.deck[0]);
        this.deck.splice(0, 1);
        this.playerActiveCards.push(this.deck[0]);
        this.deck.splice(0, 1);
      }
    },

    imageClicked(card) {
      this.play(card);
    },

    play(card) {
      if (
        this.playerActiveCards.length > 0 &&
        this.cpuActiveCards.length > 0 &&
        this.playerTurn
      ) {
        this.playedCard = card;
        this.determinePoints();
        this.playerTurn = false;
        setTimeout(this.executeCPUMove(), 1000000000);
      }
    },

    executeCPUMove() {
      let cpuIndex = this.determineCPUMove();
      this.playedCard = this.cpuActiveCards[cpuIndex];
      this.determinePoints();
      if (
        this.cpuActiveCards.length == 0 &&
        this.playerActiveCards.length == 0 &&
        this.deck.length > 0
      ) {
        this.deal();
      } else if (this.deck.length == 0) {
        this.finishedGame = true;
        this.gameInSession = false;
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
          for (let j = x; j < this.tableCards.length; j++) {
            let sum = this.tableCards[x] + this.tableCards[j];
            if (playedCard.Value == sum) {
              return i;
            }
          }
        }
        //there were no good moves
        return 0;
      }
    },
    determinePoints() {
      //first, find index in hand
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
      console.log("The index is " + index);
      //check if there is a match on the table!!!
      for (let i = 0; i < this.tableCards.length; i++) {
        if (this.playedCard.Value == this.tableCards[i].Value) {
          let wonHandCard = {
            Value: this.playedCard.Value,
            Suit: this.playedCard.suit,
            Path: this.playedCard.path,
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
          }
          this.tableCards.splice(i, 1);
          this.playedCard = null;
          return;
        }
      }

      //there was no match, check if playedCard is sum
      for (let i = 0; i < this.tableCards.length - 1; i++) {
        for (let j = i; j < this.tableCards.length; j++) {
          let sum = this.tableCards[i].Value + this.tableCards[j].Value;
          if (this.playedCard.Value == sum) {
            let wonHandCard = {
              Value: this.playedCard.Value,
              Suit: this.playedCard.suit,
              Path: this.playedCard.path,
            };
            if (this.playerTurn) {
              this.playerWonCards.push(wonHandCard);
              this.playerWonCards.push(this.tableCards[i]);
              this.playerWonCards.push(this.tableCards[j]);
              this.playerActiveCards.splice(index, 1);
              if (this.checkForScopa(2)) {
                this.incrementPlayerPoints();
              }
            } else {
              this.cpuWonCards.push(wonHandCard);
              this.cpuWonCards.push(this.tableCards[i]);
              this.cpuWonCards.push(this.tableCards[j]);
              this.cpuActiveCards.splice(index, 1);
              if (this.checkForScopa(2)) {
                this.incrementCPUPoints();
              }
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
    checkForScopa(emptyTable) {
      if (this.tableCards.length == emptyTable) return true;
      return false;
    },

    incrementPlayerPoints() {
      this.playerPoints += 1;
    },

    incrementCPUPoints() {
      this.cpuPoints += 1;
    },
  },
};
</script>

<style scoped>
#opponentCards {
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: #bf211e;
  height: 30%;
}

#tableCards {
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: #f4edea;
  height: 30%;
}

#playerCards {
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: #134611;
  height: 30%;
}

img {
  width: 20%;
}

#clickToPlay {
  height: 50em;
}
.cardCount {
  color: #f4edea;
}
</style>
