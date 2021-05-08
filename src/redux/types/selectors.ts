import { IInitialState, ILogedState } from "./states";

export const selectClient = (state: ILogedState) => state.client;
export const selectStorage = (state: IInitialState) => state.storage;
export const selectAppKey = (state: ILogedState) => state.app_key;
export const selectHostConnectionStates = (state: IInitialState) =>
  state.host_connections;
export const selectContacts = (state: IInitialState) => state.contacts;
export const selectedConversation = (state: IInitialState) =>
  state.selected_conversation;
export const selectConversationMessages = (state: IInitialState) =>
  state.selected_conversation_messages;
export const selectSelectedContact = (state: IInitialState) => {
  if (state.selected_conversation !== undefined) {
    return state.contacts[state.selected_conversation];
  } else {
    return undefined;
  }
};