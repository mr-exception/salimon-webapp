import Contact from "Classes/Contact/Contact";
import Host from "Classes/Host/Host";
import Message from "Classes/Message/Message";
import { IReportRequest } from "Classes/Queue/def";
import Queue from "Classes/Queue/Queue";
import Client from "Classes/Client/Client";
import { ConnectionStatus } from "Classes/Connection/def";
import Key from "Classes/Key/Key";
import Storage from "Storage/Storage";
import WorkerSubscriber from "Worker/WorkerSubscriber";
/**
 * this state is when user just has opened the webapp
 */
export interface IInitialState {
  is_online: boolean;

  profile: {
    first_name: string;
    last_name: string;
  };

  app_key?: Key;
  storage: Storage;
  client: Client;
  modals: {
    add_contact: {
      show: boolean;
    };
    contact_details: {
      show: boolean;
      contact?: Contact;
    };
    add_host: {
      show: boolean;
    };
    confirmation: {
      show: boolean;
      message: string;
      callback: (result: boolean) => void;
    };
  };
  hosts: Host[];
  contacts: Contact[];

  host_connections: {
    connection_id: number;
    state: ConnectionStatus;
  }[];
  contact_connections: {
    contact_id: number;
    online: boolean;
    last_online: number;
  }[];

  selected_contact_id?: number;
  selected_conversation_messages: Message[];

  // request queues
  report_queue: Queue<IReportRequest>;

  // background thread
  worker: WorkerSubscriber;
}
/**
 * this state is when user is logged into the account
 * and key pairs are loaded into store
 */
export interface ILogedState extends IInitialState {
  app_key: Key;
  client: Client;
}