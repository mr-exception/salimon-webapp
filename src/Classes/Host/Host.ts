import Entity from "Classes/Entity/Entity";
import {
  ConnectionStatus,
  IClientState,
  IPacket,
  IPacketGot,
  IPacketTTD,
} from "core/Connection/def";
import Key from "core/Key/Key";
import { Subject } from "rxjs";
import { io, Socket } from "socket.io-client";
import Storage from "storage/Storage";

export default class Host extends Entity<IHost> {
  // props
  private _socket?: Socket;
  private _host_key?: Key;
  private _ttr_avg = 0;
  private _ttr_count = 0;
  private _pending_ttd_packets: IPacketTTD[] = [];
  // observables
  private _finished$ = new Subject<void>();
  private _connectionStatus$ = new Subject<ConnectionStatus>();
  private _onPacketGot$ = new Subject<IPacketTTD>();
  constructor(
    public name: string,
    public address: string,
    public score: number,
    public type: HostType,
    public protocl: HostProtocol,
    public advertise_period: number,
    public client_key: Key,
    public packetReceived: (packet: IPacket) => void,
    public updateClientState: (state: IClientState) => void,
    storage: Storage
  ) {
    super(storage, "hosts");
  }
  /**
   * returns the object of entity based on entity interface
   */
  public getFormattedObject(): IHost {
    return {
      name: this.name,
      address: this.address,
      score: this.score,
      type: this.type,
      protocl: this.protocl,
      advertise_period: this.advertise_period,
    };
  }
  public getAdvertisePeriod(): string {
    if (this.advertise_period > 1000000000) {
      return `${(this.advertise_period / 1000000000).toFixed(2)}GB`;
    }
    if (this.advertise_period > 1000000) {
      return `${(this.advertise_period / 1000000).toFixed(2)}MB`;
    }
    if (this.advertise_period > 1000) {
      return `${(this.advertise_period / 1000).toFixed(2)}KB`;
    }
    return `${this.advertise_period}B`;
  }

  /**
   * listen to an event once and async
   */
  public static async onAsyncStatic<T>(
    socket: Socket,
    event: string
  ): Promise<T> {
    return new Promise((resolve) => {
      socket.once(event, (data: T) => {
        resolve(data);
      });
    });
  }
  /**
   * start the handshake progress with host node
   */
  public async connect(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      this._socket = io(this.address);
      this._socket.on("connect_error", (error) => {
        this._connectionStatus$.next("NETWORK_ERROR");
        reject("connection error");
        this.close();
      });
      // listen to socket on disconnecting
      this._socket.on("disconnect", () => {
        this._connectionStatus$.next("DISCONNECTED");
      });
      this._connectionStatus$.next("CONNECTING");
      // HK: waits for host node to send its public key
      const host_public_key = await Host.onAsyncStatic<string>(
        this._socket,
        "HK"
      );

      // set time out for connection progrss
      const timeout = setTimeout(() => {
        reject("timeout");
      }, 3000);

      this._connectionStatus$.next("HK");
      // got HK, creates the host key
      this._host_key = Key.generateKeyByPublicKey(host_public_key);
      // CK: sends client node public key to host node
      this._socket.emit("CK", this.client_key.getPublicKey());
      this._connectionStatus$.next("CK");
      // VQ: waits for host node to return a verfication question
      // encrypted by client node public key
      const vq_cipher = await Host.onAsyncStatic<string>(this._socket, "VQ");
      this._connectionStatus$.next("VQ");
      // decrypts the verification question by client node private key
      const va = this.client_key.decryptPrivate(vq_cipher);
      // encrypts the verifiction answer by host node public key
      const va_cipher = this._host_key.encryptPublic(va);
      // VA: sends the verification answer
      this._socket.emit("VA", va_cipher);
      this._connectionStatus$.next("VA");
      // VS: waits if host accepted the verifictaion
      this._socket.once("VS", () => {
        resolve(true);
        this._connectionStatus$.next("CONNECTED");
        this.startListeningToHost();
        clearTimeout(timeout);
      });
      // VF: waits if host refused the verification
      this._socket.once("VF", () => {
        this._connectionStatus$.next("VF");
      });
    });
  }
  /**
   * closes all the events on this connection
   */
  public close() {
    if (this._socket) {
      this._socket.disconnect();
      this._socket.close();
    }
    this._finished$.next();
  }
  /**
   * start listening host node events
   */
  public startListeningToHost() {
    if (!this._socket) {
      throw new Error("connection is dead");
    }
    // listen to packet event from host node
    this._socket.on("pck", (packet_cipher: string, ackCallback) => {
      const packet_buffer = this.client_key.decryptPrivate(packet_cipher);
      const packet = JSON.parse(packet_buffer.toString()) as IPacket;
      this.packetReceived(packet);
      ackCallback("got");
    });
    // listen to packet got event from host node
    this._socket.on("pck_got", (packet_got_chiper: string, ackCallback) => {
      const packet_got_buffer = this.client_key.decryptPrivate(
        packet_got_chiper
      );
      const packet_got: IPacketGot = JSON.parse(packet_got_buffer.toString());
      const packet_tdd = this.getPacketTTD(packet_got.id, packet_got.position);
      if (packet_tdd) {
        this._onPacketGot$.next({
          id: packet_got.id,
          position: packet_got.position,
          time: Date.now() - packet_tdd.time,
        });
        this.removePacketTTD(packet_got.id, packet_got.position);
      }
      ackCallback("got");
    });
    // listen to any client state changed through this connection
    this._socket.on("status_update", (cipher: string, ackCallback) => {
      if (!this._socket) return;
      const state = JSON.parse(
        this.client_key.decryptPrivate(cipher).toString()
      ) as IClientState;
      // send client state into upper layout
      this.updateClientState(state);
    });
  }
  /**
   * get the TTD information of a packet
   */
  public getPacketTTD(id: string, position: number): IPacketTTD | undefined {
    return this._pending_ttd_packets.find(
      (packet) => packet.id === id && packet.position === position
    );
  }
  /**
   * remove the information of a packet TTD
   */
  public removePacketTTD(id: string, position: number) {
    this._pending_ttd_packets = this._pending_ttd_packets.filter((packet) =>
      packet.id === id && packet.position === position ? null : packet
    );
  }
}

export interface IHost {
  address: string;
  type: HostType;
  protocl: HostProtocol;
  name: string;
  score: number;
  advertise_period: number;
}

export type HostType = "RELAY" | "STORAGE" | "ADVERTISOR";
export type HostProtocol = "LIVE" | "REST";
