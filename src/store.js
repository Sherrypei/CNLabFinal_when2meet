import { createStore } from "vuex";
import { instance } from "./api";
import { timeLabelGenerator, getLabelTop, splitToChunks } from "./utils";
import { isEmpty, isNil, chunk } from "lodash";

export default createStore({
  state() {
    return {
      eventData: {},
      userID: "",
    };
  },
  mutations: {
    FETCH_AVAILABILITY(state, data) {
      state.eventData = data;
    },
    ADD_AVAILABILITY(state, content) {
      const { unixtime } = content;
      const userID = state.userID;
      if (state.eventData.availability[unixtime].indexOf(userID) === -1) {
        state.eventData.availability[unixtime].push(userID);
      }
    },
    REMOVE_AVAILABILITY(state, content) {
      const { unixtime } = content;
      const userID = state.userID;
      state.eventData.availability[unixtime] = state.eventData.availability[
        unixtime
      ].filter((val) => {
        return val !== userID;
      });
    },
    ADD_USERNAME(state, content) {
      const { username, id } = content;
      state.eventData.users.push({ id, username });
      state.userID = id;
    },
    RETRIEVE_USERID(state, eventID) {
      state.userID = localStorage.getItem(eventID);
    },
  },
  actions: {
    async fetchAvailabilities({ commit }, eventID) {
      const response = await instance.get(eventID);
      commit("FETCH_AVAILABILITY", response.data);
      commit("RETRIEVE_USERID", response.data._id);
    },
    addEvent({ commit }, { unixtime, eventID }) {
      commit("ADD_AVAILABILITY", { unixtime, eventID });
    },
    removeEvent({ commit }, { unixtime, eventID }) {
      commit("REMOVE_AVAILABILITY", { unixtime, eventID });
    },
    async updateDatabase({ state }) {
      await instance.put(`/${state.eventData._id}/update`, {
        availability: state.eventData.availability,
      });
    },
    async addUserName({ commit }, { username, eventID }) {
      // add user entry to database
      const response = await instance.put(`/${eventID}/adduser`, {
        user: username,
      });
      // update local storage
      localStorage.setItem(eventID, response.data.id);
      commit("ADD_USERNAME", { username, id: response.data.id });
    },
  },
  getters: {
    usernameExist(state) {
      return isNil(state.userID);
    },
    getUserID(state) {
      return state.userID;
    },
    getEventData(state) {
      return state.eventData;
    },
    getAvailability(state) {
      return state.eventData.availability;
    },
    getSplitAvailabilities(state) {
      if (isEmpty(state.eventData)) {
        return;
      }
      return splitToChunks(state.eventData.availability, 6);
    },
    getEventName(state) {
      return state.eventData.event_name;
    },
    getTimeLabels(state, getters) {
      if (isEmpty(state.eventData)) {
        return [];
      }
      return timeLabelGenerator(getters.getSplitAvailabilities[0]);
    },
    getTopLabel(state, getters) {
      const avail = state.eventData.availability;
      if (isNil(avail)) {
        return;
      }
      return getLabelTop(
        Object.keys(avail)[0],
        Object.keys(avail)[Object.keys(avail).length - 1]
      );
    },
    getParticipantList(state) {
      if (isEmpty(state.eventData)) {
        return [];
      }
      return state.eventData.users;
    },
  },
});
