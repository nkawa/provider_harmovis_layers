import { AgentData } from "./agent";
import { BarData } from "./bargraph";

export interface WorkerMessage {
    type: SocketMsgTypes;
}

export interface SocketMessage<T> extends WorkerMessage  {
    payload: T
}

export const isBarGraphMsg = (msg: WorkerMessage): msg is SocketMessage<BarData[]> => {
    return msg.type === 'RECIVED_BAR_GRAPHS'
}
export const isAgentMsg = (msg: WorkerMessage): msg is SocketMessage<AgentData> => {
    return msg.type === 'RECIVED_AGENT'
}
export const isMapboxToken = (msg: WorkerMessage): msg is SocketMessage<string> => {
    return msg.type === 'RECIVED_MAPBOX_TOKEN'
}

export type SocketMsgTypes = 'RECIVED_AGENT'| 'CONNECTED'| 'RECIVED_MAPBOX_TOKEN' | 'RECIVED_BAR_GRAPHS';
