import { LayerProps, CompositeLayer, ColumnLayer, ScatterplotLayer, TextLayer } from 'deck.gl'
import { MovedData } from 'harmoware-vis'
import { Layer } from '@deck.gl/core';
import { BarData } from '../constants/bargraph';

interface BarLayerProps extends LayerProps {
    data: MovedData[];
    widthRatio: number;
    heightRatio: number;
    radiusRatio: number;
    titlePositionOffset: number;
    selectBarGraph: (barId: BarData|null) => void; 
}


const BarType = [
    "BT_BOX_FIXCOLOR",
    "BT_BOX_VARCOLOR",
    "BT_HEX_FIXCOLOR",
    "BT_HEX_VARCOLOR",
]

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

const isBarData = (data: MovedData): data is BarData => {
    const bar = data as BarData;
    return bar.data !== undefined &&
        bar.barType !== undefined &&
        bar.width !== undefined;
}

const extractCharCode = (data: BarData[]) => {
    const charSet: string[] = []
    data.forEach((d) => {
        const text = d.text;
        for (let i = 0; i < text.length; i++) {
            charSet.push(text[i])
        }
    })
    return charSet;
}

export default class BarLayer extends CompositeLayer<BarLayerProps> {

  constructor(props: BarLayerProps){
    super({...props, pickable: true});
  }

  static layerName = 'BarLayer'

  getPickingInfo(obj: any) {
    if (obj.mode !== 'query') {
        return;
    }
    const { selectBarGraph } = this.props;
    const o = obj.info.object;
    if (o) {
        const data = obj.info.object;
        selectBarGraph(data);
    }
  }

  renderLayers () {
    const { data, visible, heightRatio, widthRatio, radiusRatio, titlePositionOffset } = this.props
    const barData = data.filter((b) => isBarData(b)) as BarData[]
    const charset = extractCharCode(barData)
    const layers = [
        new ScatterplotLayer({
            id: 'bargraph-scatterplot-layer',
            visible,
            extruded: true,
            opacity: 1,
            data: barData,
            radiusScale: radiusRatio,
            pickable: true,
            onClick: (ev) => {
            },
            onHover: (ev) => {
            },
            getRadius: (d: BarData) => d.radius,
            getPosition: (d: BarData) => [d.longitude, d.latitude],
            getFillColor: (d: BarData) =>  d.areaColor,
        }),
        new TextLayer({
            id: 'bargraph-text-layer',
            data: barData,
            characterSet: charset,
            getPosition: (d: BarData) => [d.longitude, d.latitude],
            getPixelOffset: () => [0, titlePositionOffset],
            fontFamily: 'Noto Sans JP',
            getSize: 32,
            getColor: [255,255,255],
            getTextAnchor: 'middle',
            getAlignmentBaseline: 'top',
            getText: (d: BarData) => {
                return d.text
            },
        }),
    ] as Layer[];
    const columnDataMap = barData
        .flatMap( d => {
            return d.data.map((vdata, index) => {
                return {
                    index,
                    name: d.text,
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
            const key = data.index+'_'+data.type+'_'+data.width
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
            pickable: true,
            diskResolution: type.includes('HEX') ? 4 : 6,
            offset: [2.5*index-2.5, 0],
            radius: width * widthRatio,
            elevationScale: heightRatio,
            getPosition: (d: any) => [d.longitude, d.latitude],
            getFillColor: (d: any) => {
                return isFixColor ? getColor(index) : d.color
            },
            getElevation: (d: any) => d.value,
        });
    });
    return layers.concat(columnlayers)
  }
}
