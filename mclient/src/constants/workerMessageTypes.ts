export interface WorkerMessage {}

export interface SocketMessage<T> extends WorkerMessage {
    type: SocketMsgTypes;
    payload: T;
}

export enum SocketMsgTypes {
    AGENT='AGENET',
    CONNECTED='CONNECTED',
    NOTIFY_MAPBOX_TOKEN='NOTIFY_MAPBOX_TOKEN',
    RECIVED_BAR_GRAPHS='RECIVED_BAR_GRAPHS'
}
