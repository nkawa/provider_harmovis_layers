import io from 'socket.io-client';
import { BarData } from '../constants/bargraph';
import { AgentData } from '../constants/agent';
import { SocketMessage } from '../constants/workerMessageTypes';
const socket = io();

socket.on('disconnect', () => { console.log('Socket.IO disconnected!') })
const worker = self as any
self.addEventListener("message", (e: any) => {
    const type = e.data[0];
});
// start socket server

socket.on('connect', () => {
    console.log('Socket.IO connected!')
    worker.postMessage({ type: 'CONNECTED'} as SocketMessage<void>);
    console.log('Get mapbox token')
    socket.emit('get_mapbox_token', {})
})

socket.on('mapbox_token', (payload: string) => {
    console.log('token Got:' + payload)
    worker.postMessage({
        type: 'RECIVED_MAPBOX_TOKEN',
        payload
    } as SocketMessage<string> );
    startRecivedData();
})


const toArrayColor = (color: number) => {
	return [
		((color & 0xFF0000) >> 16),
		((color & 0x00FF00) >> 8),
		(color & 0x0000FF)
	]
}

const createGradientColorGenerator = (minValue:number|undefined, maxValue:number|undefined) => {
    const min = minValue ?? 0
    const max = maxValue ?? 0
    const basegreen = 0;
    const basered = 255;
    const ratio = 255/(max-min)
    return (value: number|undefined) => {
        const v = value ? (value > max ? max : (value < min ? min : value)) : 0
        let green = basegreen + ratio*(v - min)
        let red = basered - ratio*(v - min)
        return [Math.floor(red),  Math.floor(green), 0]
    }
}

const getData = (bar: any) => {
    const time = bar.ts.seconds;
    const barType = bar.type;
    const isFixColor = barType === 0 || barType === 2;
    const isHexa = barType === 2 || barType === 3;
    const colorGenerator = createGradientColorGenerator(bar.min, bar.max)
//    console.log('time is ' + time)
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
                color: isFixColor ? toArrayColor(color): colorGenerator(b.value),
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
        const payload: BarData[] = bars.map((b: any) => getData(b));
        worker.postMessage({
            type: 'RECIVED_BAR_GRAPHS',  
            payload
        } as SocketMessage<BarData[]>)
    })
    socket.on('agents', (str: string) => {
        const payload: AgentData = JSON.parse(str);
        worker.postMessage({
            type: 'RECIVED_AGENT',
            payload
        } as SocketMessage<AgentData>)
    })
}
