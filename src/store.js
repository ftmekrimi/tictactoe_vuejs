import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const emptyPositions = () => [null, null, null, null, null, null, null, null, null];
const players =  {X:'X',O:'O'};
export default new Vuex.Store({
  state: {
    player: "X",
    winner: null,
    players: players,
    gameHistory: [],
    positions: emptyPositions(),
  },
  getters: {
    getMarker: state => index => state.positions[index],
    getPlayerName: state => state.players ? state.players[state.player] : '',
    getWinnerName: state => state.winner ? state.players[state.winner] : '',
    hasEmptyCells: state => {
      return state.positions.filter(position => !!position).length < 9;
    },
    
  },
  mutations: {
    changePlayer(state) {
      state.player = state.player === 'X' ? 'O' : 'X';
    },
    pushMarker(state, payload) {
      state.positions = state.positions.map((position, i) => {
        return payload.index === i ? state.player : position;
      });
    },
    checkWinning(state, payload) {
      const { positions } = state;
      const { player } = payload;

      if (
        (positions[0] === player && positions[1] === player && positions[2] === player) ||
        (positions[3] === player && positions[4] === player && positions[5] === player) ||
        (positions[6] === player && positions[7] === player && positions[8] === player) ||
        (positions[0] === player && positions[3] === player && positions[6] === player) ||
        (positions[1] === player && positions[4] === player && positions[7] === player) ||
        (positions[2] === player && positions[5] === player && positions[8] === player) ||
        (positions[0] === player && positions[4] === player && positions[8] === player) ||
        (positions[2] === player && positions[4] === player && positions[6] === player)
      ) {
        state.winner = player
        state.gameHistory.push(Object.freeze({
          winner: state.winner,
          positions: state.positions,
          winnerName: state.players[state.winner],
        }));
      }
    },
    flushPositions(state) {
      state.positions = emptyPositions();
    },
    flushWinner(state) {
      state.winner = null;
    }
  },
  actions: {
    addMarker({commit}, payload){
      commit('pushMarker', {...payload});
      commit('changePlayer');
    },
    newGame({commit}) {
      commit('flushPositions')
      commit('flushWinner')
    }
  }
})
