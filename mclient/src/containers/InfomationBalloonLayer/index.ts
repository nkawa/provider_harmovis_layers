import { LayerProps, CompositeLayer, IconLayer, TextLayer } from 'deck.gl'
import { Layer } from '@deck.gl/core';
import { BalloonInfo } from '../../constants/informationBalloon';


const toStrArray = (text: string, charset: string[]) => {
    for (let i = 0; i < text.length; i++) {
        charset.push(text[i])
    }
}
interface TextData {
    isTitle: boolean;
    position: number[];
    label: string;
    offset: number;
}


const fontSize = 16
const titleSize = 24
const iconSize = 300

interface InfomationBalloonProps extends LayerProps {
    infoList: BalloonInfo[];
    handleIconClicked: (id: string) => void;
}
export default class InfomationBalloonLayer extends CompositeLayer<InfomationBalloonProps> {

  constructor(props: InfomationBalloonProps){
    super({...props, pickable: true});
  }

  getPickingInfo(obj: any) {
    if (obj.mode !== 'query') {
        return;
    }
    const o = obj.info.object;
    if (o) {
        const data = obj.info.object;
        const { handleIconClicked } = this.props;
        handleIconClicked(data.id);
    }
  }

  static layerName = 'BarLayer'

  renderLayers () {
    const { infoList } = this.props
    const charset: string[] = [];
    const textData = infoList.flatMap(info => {
        toStrArray(info.title, charset)
        const items = info.items.map((item, i) => {
            toStrArray(item, charset)
            return {
                isTitle: false,
                position: info.position,
                offset: i+1,
                label: item
            } as TextData;
        })
        items.push({
            isTitle: true,
            position: info.position,
            offset: 0,
            label: info.title
        })
        return items
    })
    const layers = [
        new IconLayer({
            id: 'ballooninfo-icon-layer',
            data: infoList,
            pickable: true,
            getSize:() => iconSize,
            getIcon: () => ({
                url: './balloon.png',
                width: iconSize,
                height: iconSize,
                anchorY: 0,
            }),
        }),
        new TextLayer({
            id: 'balloninfo-text-layer',
            data: textData,
            pickable: false,
            characterSet: charset,
            getPosition: (d: TextData) => d.position,
            getPixelOffset: (d: TextData) => [0, d.offset * (fontSize + 10) + iconSize/5 - (d.isTitle? 5 : 0)],
            fontFamily: 'Noto Sans JP',
            getSize: (d: TextData) => d.isTitle ? titleSize : fontSize,
            getColor: [255,255,255],
            getTextAnchor: 'middle',
            getAlignmentBaseline: 'top',
            getText: (d: TextData) => {
                return d.label
            },
        }),
    ] as Layer[];

    return layers;
  }
}
