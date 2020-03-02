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
    showTitle: boolean;
    selectBarGraph: (barId: BarData|null) => void; 
}

const isBarData = (data: MovedData): data is BarData => {
    const bar = data as BarData;
    return bar.data !== undefined &&
        bar.shapeType !== undefined &&
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
    const { data, showTitle, visible, heightRatio, widthRatio, radiusRatio, titlePositionOffset } = this.props
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

    ] as Layer[];

    if (showTitle) {
     layers.push(new TextLayer({
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
        })
     );
    }

    const columnDataMap = barData
        .flatMap( d => {
            return d.data.map((vdata, index) => {
                return {
                    index,
                    name: d.text,
                    shapeType: d.shapeType,
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
            const key = data.index+'_'+data.shapeType+'_'+data.width
            const prevData = prev[key]
            if (prevData) {
                prevData.push(data)
            } else {
                prev[key] = [data]
            }
            return prev
        }, {} as any)
    const columnlayers = Object.values(columnDataMap).map((column: any) => {
        const shapeType = column[0].shapeType;
        const width = column[0].width;
        const index = column[0].index;
        return new ColumnLayer({
            id: 'grid-cell-layer-' + index + shapeType +window,
            data: column,
            extruded: true,
            pickable: true,
            diskResolution: shapeType,
            offset: [2.5*index-2.5, 0],
            radius: width * widthRatio,
            elevationScale: heightRatio,
            getPosition: (d: any) => [d.longitude, d.latitude],
            getFillColor: (d: any) => {
                return d.color
            },
            getElevation: (d: any) => d.value,
        });
    });
    return layers.concat(columnlayers)
  }
}
