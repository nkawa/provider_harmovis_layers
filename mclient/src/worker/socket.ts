import io from 'socket.io-client';
import { SocketMsgTypes } from '../constants/workerMessageTypes'
import { BarData } from '../constants/bargraph';
const socket = io();

socket.on('disconnect', () => { console.log('Socket.IO disconnected!') })
const worker = self as any
self.addEventListener("message", (e: any) => {
    const type = e.data[0];
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


const toArrayColor = (color: number) => {
	return [
		((color & 0xFF0000) >> 16),
		((color & 0x00FF00) >> 8),
		(color & 0x0000FF)
	]
}

const getColor = (index: number) => {
    let red = 0;
    let green = 0;
    let blue = 0;
    index++;
    const ratio = Math.floor(index/3);
    if (index%3 === 0) {
        green = 0xff - 0x11 * ratio;
    } else if (index%3 === 1) {
        blue = 0xff - 0x11 * ratio;
    } else {
        red = 0xff - 0x11 * ratio;
    }
    return [red, green, blue]
}

const getData = (bar: any) => {
    const time = bar.ts.seconds;
    const barType = bar.type;
    const isFixColor = barType === 0 || barType === 2;
    const isHexa = barType === 2 || barType === 3;
    return {
        id: bar.id,
        movesbaseidx: bar.id,
        sourcePosition: [],
        sourceColor: [],
        targetPosition: [],
        targetColor: [],
        elapsedtime: time,
        position: [bar.lon, bar.lat, 0],
        angle: 0,
        speed: 0,
        shapeType: isHexa ? 6 : 4,
        areaColor: toArrayColor(bar.color),
        data: bar.barData.map((b: any, index: number) => {
            const color = b.color;
            return {
                value: b.value,
                color: isFixColor ? getColor(index) : toArrayColor(color),
                label: b.label,
            }
        }),
        radius: bar.radius,
        width: bar.width,
        min: bar.min,
        max: bar.max,
        text: bar.text,
    } as BarData
}

function startRecivedData() {
    socket.on('bargraphs', (str: string) => {
        const rawData = JSON.parse(str);
        const bars = rawData.bars;     
        const data = bars.map((b: any) => getData(b));
        worker.postMessage([SocketMsgTypes.RECIVED_BAR_GRAPHS, data])
    })
}
