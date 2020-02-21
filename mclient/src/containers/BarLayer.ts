import { LayerProps, CompositeLayer, ColumnLayer, ScatterplotLayer, ColumnLayerProps } from 'deck.gl'
import { MovedData } from 'harmoware-vis'
import { GridType } from '../constants/MapSettings';
import { Layer } from '@deck.gl/core';

interface BarLayerProps extends LayerProps {
    gridType: GridType;
    movedData: MovedData[];
    widthRatio: number;
    heightRatio: number;
    radiusRatio: number;
}

interface BarData extends MovedData {
    data: {id: number, color: number[], value: number, label: string}[],
    radius: number,
    width: number,
    min: number,
    max: number,
    text: number,
    barType: number,
}

const BarType = [
    "BT_BOX_FIXCOLOR",
    "BT_BOX_VARCOLOR",
    "BT_HEX_FIXCOLOR",
    "BT_HEX_VARCOLOR",
]

const getColor = (index: number) => {
    let r = 0x00;
    let g = 0x00;
    let b = 0x00;
    index++;
    const ratio = Math.floor(index/3);
    if (index%3 === 0) {
        b = 0xff - 0x11 * ratio;
    } else if (index%3 === 1) {
        b = 0xff - 0x11 * ratio;
    } else {
        r = 0xff - 0x11 * ratio;
    }
    return [r, g, b]
}

export default class BarLayer extends CompositeLayer<BarLayerProps> {

  static layerName = 'BarLayer'

  renderLayers () {
    const { data, visible, heightRatio, widthRatio, radiusRatio } = this.props
    const barData = data as BarData[];
    const layers = [
        new ScatterplotLayer({
            visible,
            extruded: true,
            opacity: 1,
            data: barData,
            radiusScale: radiusRatio,
            getRadius: (d: BarData) => d.radius,
            getPosition: (d: BarData) => [d.longitude as number, d.latitude as number],
            getFillColor: [0,125,30],
        })
    ] as Layer[];
    const columnDataMap = barData
        .flatMap( d => {
            return d.data.map((vdata, index) => {
                return {
                    index,
                    type: d.barType,
                    width: d.width,
                    value: vdata.value,
                    color: vdata.color,
                    label: vdata.label,
                    longitude: d.longitude,
                    latitude: d.latitude,
                };
            });
        })
        .reduce((prev, data) => {
            const key = data.index+'_'+data.type+data.width
            const prevData = prev[key]
            if (prevData) {
                prevData.push(data)
            } else {
                prev[key] = [data]
            }
            return prev
        }, {} as any)
    const columnlayers = Object.values(columnDataMap).map((column: any) => {
        const type = BarType[column[0].type];
        const width = column[0].width;
        const index = column[0].index;
        const isFixColor = type.includes('FIXCOLOR')
        return new ColumnLayer({
            id: 'grid-cell-layer-' + index + type +window,
            data: column,
            extruded: true,
            diskResolution: type.includes('HEX') ? 4 : 6,
            offset: [2.5*index-2.5, 0],
            radius: width * widthRatio,
            elevationScale: heightRatio,
            getPosition: (d: any) => [d.longitude, d.latitude],
            getFillColor: (d: any) => {
                isFixColor ? getColor(index) : d.color
            },
            getElevation: (d: any) => d.value,
        });
    });
    return layers.concat(columnlayers)
  }
}
