declare module "@deck.gl/geo-layers" {
  import { Layer } from '@deck.gl/core';
  class Tile3DLayers<P, S = {}> extends Layer<P, S> {}


}

declare module "deck.gl" {
  
  import * as React from 'react';
  import { Layer } from '@deck.gl/core';
  import { vec3 } from 'gl-matrix';
  import { number } from 'prop-types';

  interface Uniforms {
    extruded: boolean,
    opacity: number,
    coverage: number
  }
  interface LayerProps {
    id?: string;
    data?: any[];
    visible?: boolean;
    pickable?: boolean;
    opacity?: number;
    onHover?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    coordinateSystem?: number;
  }
  

  interface HexagonLayerProps extends LayerProps {
    radius?: number,
    elevationScale?: number,
    getPosition: (d: any) => number[],
    pickable?: boolean,
    extruded?: boolean,
  }

  interface GridLayerProps extends LayerProps {
    pickable?: boolean,
    extruded?: boolean,
    cellSize?: number,
    elevationScale?: number,
    getPosition: (d: any) => number[],
  }


  interface ColumnLayerProps<D> extends LayerProps {
    diskResolution?: number; 
    angle?: number;
    vertics?: [];
    offset?: number[];
    coverage?: number;
    elevationScale?: number;
    filled?: boolean;
    wireframe?: boolean;
    lineWidthUnits?: 'meters'|'pixels';
    getPosition?: (d: D) => (number|undefined)[],
    getFillColor?: (d: D) => (number|undefined)[],
    getElevation?: (d: D) => number|undefined,
    getLineWidth?: (d: D) => (number|undefined)[],
  }

  export default class DeckGL extends React.Component<any> {}

  class CompositeLayer<P extends LayerProps = LayerProps, S = {}> extends Layer<P, S> {}
  class GeoJsonLayer<P extends LayerProps = LayerProps, S = {}> extends Layer<P, S> {}
  class ScatterplotLayer<P extends LayerProps = LayerProps, S = {}> extends Layer<P, S> {}

  class GridCellLayer<P extends LayerProps = LayerProps, S = {}> extends Layer<P, S> {}
  class IconLayer<P extends LayerProps = LayerProps, S = {}> extends Layer<P, S> {}

  class LineLayer<P extends LayerProps = LayerProps, S = {}> extends Layer<P, S> {}
  class TextLayer<P extends LayerProps = LayerProps, S = {}> extends Layer<P, S> {}

  class HexagonLayer<P extends HexagonLayerProps, S = {}> extends Layer<P, S> {}
  class GridLayer<P extends HexagonLayerProps, S = {}> extends Layer<P, S> {}
  class ColumnLayer<P extends ColumnLayerProps<any>, S = {}> extends Layer<P, S> {
    offset: number[];
  }

  class ArcLayer<P extends LayerProps = LayerProps, S = {}> extends Layer<P, S> {}

  class PolygonLayer<P extends LayerProps = LayerProps, S = {}> extends CompositeLayer<P, S> {}

  class AttributeManager {
    addInstanced(attributes: object, updaters?: object): void;
  }
}

declare module "@deck.gl/core" {

  import * as React from 'react';
  import { Uniforms, LayerProps } from 'deck.gl';

  class Layer <P extends LayerProps = LayerProps, S = {}> {
    constructor(props: P);
    context: any;
    props: P;
    state: S;
    setUniforms(uniforms: Uniforms): any;
    draw({uniforms}:{uniforms: Uniforms}): any;
    setState<K extends keyof S>(
      state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
      callback?: () => void
    ): void;
    updateState(state: {
      props: P,
      oldProps: P,
      changeFlags: any,
    }): void;
  }
}