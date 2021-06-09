<template>
  <div class="home">
    <div id="welcome">
      <p id="ciao">Ciao!</p>
      <p id="welcome">Benevenuti a Scopa ~~ Welcome to Scopa!</p>
    </div>
    <div id="funFacts">
      <p>Scopa Fun Facts:</p>
      <ul>
        <li>
          Scopa is an Italian card-game that originated during the 18th century
        </li>
        <li>The word scopa means "sweep" in Italian.</li>
        <li>
          Even though Italy wasn't unified until 1870, Scopa was widely popular
          in many different regions
        </li>
        <li>There are only 40 cards in a traditional Italian deck of cards</li>
        <li>
          Many of the regions in Italy have their own, uniquely decorated
          playing cards
        </li>
        <li>
          There are lots of different versions of Scopa still being played today
          and having your own house-rules is very common!
        </li>
        <li>
          Along with Briscola, Scopa is one of Italy's national card games
        </li>
      </ul>
    </div>
    <div id="cards">
      <p>Understanding the cards:</p>
    </div>
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
          on the table, you can pick that card up and add both to your "won
          cards" pile
        </li>
        <li>
          If you don't have a matching card, maybe you can do some math to pick
          up a card! Look on the table- are there two cards whose values add up
          to a card in your hand? If so, you can use the one card in your hand
          to pick up both of the cards on the table and add them to your "won
          cards" pile. But be careful, if the card in your hand matches a card
          on the table, you must use the card in your hand to pick up the exact
          match, not the sum
        </li>
        <li>
          Finally, if you can't pick up any cards, then you must put a card from
          your hand onto the table. Now your opponent can try and get that card,
          or you can win it back on your next turn
        </li>
      </ul>
      <p>
        Getting a scopa: Sometimes, you will have the opportunity to pick up all
        the cards on the table!! When this happens, it is called a scopa,
        because you 'swept' the table clean of cards. After you pick up all the
        cards in the center, the next player has to put one of their cards back
        on the table.
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
    <div id="play">
      <p>Click here to play!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",

  computed: {
    user() {
      return this.$root.$data.user;
    },
  },
};
</script>

<style scoped>
#ciao {
  font-size: 1.5em;
}
#welcome {
  font-size: 1.2em;
}
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#funFacts {
  width: 70%;
  border: solid;
  margin-bottom: 1em;
  text-align: left;
  padding-right: 1em;
  padding-left: 1em;
}

#howToPlay {
  width: 70%;
  justify-self: center;
  border: solid;
  text-align: left;
  padding-left: 1em;
  padding-right: 1em;
}

#cards {
  width: 70%;
  border: solid;
  margin-bottom: 1em;
  text-align: left;
  padding-right: 1em;
  padding-left: 1em;
}
</style>
