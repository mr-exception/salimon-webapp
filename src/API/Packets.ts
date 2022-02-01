import { IPacket } from "Structs/Packet";
import { createAxios, IAxiosConfigs } from "./axios-inital";

interface ISendPacketParams {
  dst: string;
  data: string;
  position: number;
  msg_count: number;
  msg_id: string;
}
export async function sendPacket(params: ISendPacketParams, configs: IAxiosConfigs): Promise<IPacket> {
  return createAxios(configs)
    .post<IPacket>("/packets/send", params, {})
    .then((response) => response.data);
}

interface IFetchPacketsParam {
  dst?: string;
  src?: string;
  position?: number;
  msg_count?: number;
  msg_id?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}
export async function fetchPackets(params: IFetchPacketsParam, configs: IAxiosConfigs): Promise<IPacket[]> {
  return createAxios(configs)
    .get<{ data: IPacket[] }>("/packets/send", { params })
    .then((response) => response.data.data);
}