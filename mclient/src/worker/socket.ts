import io from 'socket.io-client';
import { SocketMsgTypes } from '../constants/workerMessageTypes'
const socket = io();

// socket.on('event', this.getEvent.bind(this))
// socket.on('geojson', this.getGeoJson.bind(this))
// socket.on('lines', this.getLines.bind(this))

// socket.on('viewstate', this.getViewState.bind(this))

socket.on('disconnect', () => { console.log('Socket.IO disconnected!') })
const worker = self as any
self.addEventListener("message", (e: any) => {
    const type = e.data[0];
    console.log(e);
});
// start socket server
socket.on('connect', () => {
    console.log('Socket.IO connected!')
    worker.postMessage([SocketMsgTypes.CONNECTED]);
    console.log('Get mapbox token')
    socket.emit('get_mapbox_token', {})
})

socket.on('mapbox_token', (token: string) => {
    console.log('token Got:' + token)
    worker.postMessage([
        SocketMsgTypes.NOTIFY_MAPBOX_TOKEN,
        token
    ]);
    startRecivedData();
})

function startRecivedData() {
    socket.on('bargraphs', (str: string) => {
        const data = JSON.parse(str)
        worker.postMessage([SocketMsgTypes.RECIVED_BAR_GRAPHS, data])
    })
}
