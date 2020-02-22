import * as React from 'react'
import { DataItem } from "../../constants/bargraph";
import './style.scss'

const InfoItem: React.FC<{dataItem: DataItem}> = props => {
    const { color, label, value } = props.dataItem;
    return (<div>
        <div className={'bargraph-carditem'}>
            <div style={{
                backgroundColor: 'red',// `rgb(${color[0], color[1], color[2]})`,
                width: '20px',
                height: '20px'
            }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%'  }}>
                <div>
                    {label}
                </div>
                <div>
                    {value}
                </div>
            </div>
        </div>
    </div>);
}

export default InfoItem;
