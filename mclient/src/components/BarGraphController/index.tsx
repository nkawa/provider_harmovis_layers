import * as React from 'react'
import BarWidth from './BarWidth'
import BarRadius from './AreaRadius'
import BarHeight from './BarHeight'
import TitleOffset from './TitlePositionOffset'
import ShowTitle from './ShowTitle'

export default function BargraphController() {

    return (
           <figure>
              <figcaption>グラフの設定</figcaption>
              <ol>
                <li>
                  エリアの広さ(倍率): <BarRadius/>
                </li>
                <li>
                  グラフの高さ(倍率): <BarHeight />
                </li>
                <li>
                  グラフの幅(倍率): <BarWidth />
                </li>
                <li>
                  タイトルの表示: <ShowTitle />
                </li>
                <li>
                  タイトルのオフセット(px): <TitleOffset />
                </li>
              </ol>
            </figure>
    )
}

