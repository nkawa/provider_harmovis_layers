import { LayerProps, CompositeLayer, ColumnLayer, ScatterplotLayer } from 'deck.gl'
import { MovedData } from 'harmoware-vis'
import { GridType } from '../constants/MapSettings';
import { Layer } from '@deck.gl/core';

interface BarLayerProps extends LayerProps {
    gridType: GridType;
    movedData: MovedData[];
}

interface BarData extends MovedData {
    value: number,
    radius: number,
    width: number,
    min: number,
    max: number,
    text: number,
    barType: string,
}

export default class BarLayer extends CompositeLayer<BarLayerProps> {

  static layerName = 'BarLayer'

  renderLayers () {
    const { data, visible } = this.props
    const barData = data as BarData[];
    const width = barData[0] && barData[0].width? barData[0].width : 10;
    const type = barData[0] && barData[0].barType? barData[0].barType : 10;
    const layers = [
        new ScatterplotLayer({
            visible,
            extruded: true,
            opacity: 1,
            data: barData,
            radiusScale: 20,
            getRadius: (d: BarData) => d.radius,
            getPosition: (d: BarData) => [d.longitude as number, d.latitude as number],
            getFillColor: (d: BarData)=> d.color,
        })
    ] as Layer[];
    layers.push(
        new ColumnLayer({
            id: 'grid-cell-layer',
            data: barData,
            extruded: true,
            diskResolution: type === 'BT_BOX_FIXCOLOR ' ? 4 : 6,
            radius: width,
            elevationScale: 100,
            getPosition: (d: BarData) => [d.longitude, d.latitude],
            getFillColor: (d: BarData) => d.color as number[],
            getElevation: (d: BarData) => d.value,
        })
    );
    return layers
  }
}
