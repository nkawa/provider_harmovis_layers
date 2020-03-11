import React from 'react'
import {
	Container, connectToHarmowareVis, HarmoVisLayers, MovesLayer, MovesInput,
	LoadingIcon, FpsDisplay, DepotsLayer, EventInfo, MovesbaseOperation, BasedProps, Movesbase
} from 'harmoware-vis'
import { GeoJsonLayer, LineLayer } from 'deck.gl'
import Controller from '../components/controller'
import { SocketMsgTypes } from '../constants/workerMessageTypes'
import BarLayer from './BarLayer'
import BarGraphInfoCard from '../components/BarGraphInfoCard'
import { selectBarGraph, removeBallonInfo, appendBallonInfo, updateBallonInfo } from '../actions/actions'
import store from '../store'
import { BarData } from '../constants/bargraph'
//import HeatmapLayer from './HeatmapLayer'
import InfomationBalloonLayer from './InfomationBalloonLayer'
import { BalloonInfo, BalloonItem } from '../constants/informationBalloon'

console.log("New OK %d",1)

class App extends Container<any, any> {

	private lines = 0;

	constructor (props: any) {
		super(props)
		const { setSecPerHour, setLeading, setTrailing } = props.actions
		const worker = new Worker('socketWorker.js');
		const self = this;
		worker.onmessage = e => {
			const type = e.data[0];
			if(type === SocketMsgTypes.NOTIFY_MAPBOX_TOKEN) {
				this.setState({
					mapbox_token: e.data[1]
				});
			} else if (type === SocketMsgTypes.CONNECTED) {
				console.log('connected')
			} else if (type === SocketMsgTypes.RECIVED_BAR_GRAPHS) {
				self.getBargraph(e.data[1])
			}
		};
		setSecPerHour(3600)
		setLeading(3)
		setTrailing(3)
		this.state = {
			moveDataVisible: true,
			moveOptionVisible: false,
			depotOptionVisible: false,
		    heatmapVisible: false,
			optionChange: false,
			mapbox_token: '',
			geojson: null,
			lines: [],
			viewState: {
				longitude: 136.8163486 ,
				latitude: 34.8592285,
				zoom: 17,
				bearing: 0,
				pitch: 0,
				width: 500,
				height: 500
			},
			linecolor: [0,155,155],
			popup: [0, 0, '']
		}

		this._onViewStateChange = this._onViewStateChange.bind(this)

		// for receiving event info.

	}

	bin2String (array: any) {
		return String.fromCharCode.apply(String, array)
  	}

	getGeoJson (data: string) {
		this.setState({ geojson: JSON.parse(data) })
	}

	getViewState (data: any) {
		let vs = JSON.parse(data)
		this.setState({
			viewState: {
				latitude: vs.lat,
				longitude: vs.lon,
				zoom: vs.zoom
// 				pitch: vs.Pitch
			}
		})

// 		this.map.getMap().flyTo({ center: [vs.Lon, vs.Lat], zoom:vs.Zoom, pitch: vs.Pitch })

	}

	getLines (data: any) {
// 		console.log(data)
		if (this.state.lines.length > 0) {
			const ladd = JSON.parse(data)
			const lbase = this.state.lines
			const lists = lbase.concat(ladd)
			this.setState({ lines: lists })
		} else {
			this.setState({ lines: JSON.parse(data) })
		}
	}

	getBargraph (data: any) {
		const { actions, movesbase } = this.props
		const bars = data;
		let  setMovesbase = [...movesbase]
		
		for (const barData of bars) {
			const base = (setMovesbase as Movesbase[]).find((m: any)=> m.id === barData.id)
			if (base) {
				base.operation.push(barData)
			} else {
				setMovesbase.push({
					mtype: 0,
					id: barData.id,
					departuretime: barData.elapsedtime,
					arrivaltime: barData.elapsedtime,
					operation: [barData]
				} as Movesbase)
			}
			this._updateBalloonInfo(barData);
		}
		actions.updateMovesBase(setMovesbase);
	}

	getEvent (socketData:any) {
	}

	deleteMovebase (maxKeepSecond: any) {
		const { actions, animatePause, movesbase, settime } = this.props
		const movesbasedata = [...movesbase]
		const setMovesbase: any[] = []
		let dataModify = false
		const compareTime = settime - maxKeepSecond

		/*
		for (let i = 0, lengthi = movesbasedata.length; i < lengthi; i += 1) {
			const { departuretime: propsdeparturetime, operation: propsoperation } = movesbasedata[i];
			let departuretime = propsdeparturetime;
			let startIndex = propsoperation.length;
			for (let j = 0, lengthj = propsoperation.length; j < lengthj; j += 1) {
				if (propsoperation[j].elapsedtime > compareTime) {
					startIndex = j;
					departuretime = propsoperation[j].elapsedtime;
					break;
				}
			}
			if (startIndex === 0) {
				setMovesbase.push(Object.assign({}, movesbasedata[i]));
			} else
				if (startIndex < propsoperation.length) {
					setMovesbase.push(Object.assign({}, movesbasedata[i], {
						operation: propsoperation.slice(startIndex), departuretime
					}));
					dataModify = true;
				} else {
					dataModify = true;
				}
		}*/
			if (!animatePause) {
				actions.setAnimatePause(true)
			}
			actions.updateMovesBase(setMovesbase)
			if (!animatePause) {
				actions.setAnimatePause(false)
			}
// 		console.log(this.map.getMap())

// 		this.map.getMap().flyTo({ center: [-118.4107187, 33.9415889] })
// 		console.log(this.state.viewState)
// 		console.log(MapContext.viewport)
	}

	getMoveDataChecked (e: any) {
		this.setState({ moveDataVisible: e.target.checked })
	}

	getMoveOptionChecked (e: any) {
		this.setState({ moveOptionVisible: e.target.checked })
	}

	getDepotOptionChecked (e: any) {
		this.setState({ depotOptionVisible: e.target.checked })
	}

	getOptionChangeChecked (e: any) {
		this.setState({ optionChange: e.target.checked })
	}

	initialize (gl: any) {
		gl.enable(gl.DEPTH_TEST)
		gl.depthFunc(gl.LEQUAL)
		console.log('GL Initialized!')
	}

	logViewPort (state: any,view: any) {
		console.log('Viewport changed!', state, view)
	}

	handleStyleLoad (map: any) {
		console.log('StyleLoad:Map',map)
	}

	_onViewStateChange ({ viewState}: any) {
		this.setState({viewState})
	}

	componentDidMount(){
		super.componentDidMount();
		const { setNoLoop } = this.props.actions
		setNoLoop(true);
	}

	render () {
		const props = this.props
		const { actions, viewport, settime, titlePosOffset, movedData, widthRatio, heightRatio, radiusRatio,  lightSettings, 
			showTitle, infoBalloonList, selectedType, gridSize, gridHeight, routePaths, movesbase, clickedObject, titleSize,
		} = props
		const onHover = (el: any) => {
			if (el && el.object) {
				let disptext = ''
				const objctlist: any[][] = Object.entries(el.object)
				for (let i = 0, lengthi = objctlist.length; i < lengthi; i += 1) {
					const strvalue = objctlist[i][1].toString()
					disptext += i > 0 ? '\n' : ''
					disptext += (`${objctlist[i][0]}: ${strvalue}`)
				}
				this.setState({ popup: [el.x, el.y, disptext] })
			} else {
				this.setState({ popup: [0, 0, ''] })
			}
		}
		let layers = []

		
		layers.push(new BarLayer({
			id: 'bar-layer',
			data: movedData,
			movesbase: movesbase,
			currentTime: settime,
			widthRatio,
			heightRatio,
			radiusRatio,
			selectBarGraph: this._selectBarGraph,
		    titlePositionOffset: titlePosOffset,
			titleSize,		    
			showTitle, 
		}))
		layers.push(new InfomationBalloonLayer({
			id: 'info-layer',
			infoList: infoBalloonList,
			handleIconClicked: (id) => {
				store.dispatch(removeBallonInfo(id));
			}
		}))
		if (this.state.geojson != null) {
			layers.push(
			new GeoJsonLayer({
				id: 'geojson-layer',
				data: this.state.geojson,
				pickable: true,
				stroked: false,
				filled: true,
				extruded: true,
				lineWidthScale: 2,
				lineWidthMinPixels: 2,
				getFillColor: [160, 160, 180, 200],
				getLineColor: [255,255,255],
				getRadius: 1,
				getLineWidth: 1,
				getElevation: 10
			}))
		}

		const onViewportChange = this.props.onViewportChange || actions.setViewport
	    const {viewState} = this.state

		// wait until mapbox_token is given from harmo-vis provider.

		if (this.state.lines.length > 0) {
			this.lines = 0
			layers.push(
				new LineLayer({
					visible: true,
					data: this.state.lines,
					getSourcePosition: (d: any) => d.from,
					getTargetPosition: (d: any) => d.to,
					getColor: this.state.linecolor,
					getWidth: 1.0,
					widthMinPixels: 0.5
				})
			)

		}
		if (this.state.moveDataVisible && movedData.length > 0) {
			layers.push(
				new MovesLayer({
					routePaths,
					movesbase,
					movedData,
					clickedObject,
					actions,
					visible: this.state.moveDataVisible,
					optionVisible: this.state.moveOptionVisible,
					layerRadiusScale: 0.03,
					layerOpacity: 0.8,
					getRouteWidth: () => 0.1,
					optionCellSize: 2,
					sizeScale: 20,
					iconChange: false,
					optionChange: false, // this.state.optionChange,
					onHover
				}) as any
			)
		}
/*	    if (false){
			layers.push(
				new HeatmapLayer({
					visible: enabledHeatmap,
					type: selectedType,
					extruded: true,
					movedData,
					size: gridSize,
					height: gridHeight
				  })
			)
		}
*/
		const visLayer =
			(this.state.mapbox_token.length > 0) ?
				<HarmoVisLayers 
					visible={true}
					viewport={viewport}
					mapboxApiAccessToken={this.state.mapbox_token}
					actions={actions}
					layers={layers}
				/>
				: <LoadingIcon loading={true} />
		return (
			<div>
				<Controller
					{...(props as any)}
					deleteMovebase={this.deleteMovebase.bind(this)}
					getMoveDataChecked={this.getMoveDataChecked.bind(this)}
					getMoveOptionChecked={this.getMoveOptionChecked.bind(this)}
					getDepotOptionChecked={this.getDepotOptionChecked.bind(this)}
					getOptionChangeChecked={this.getOptionChangeChecked.bind(this)}
				/>
				<div className='harmovis_area'>
					{visLayer}
				</div>
				<svg width={viewport.width} height={viewport.height} className='harmovis_overlay'>
					<g fill='white' fontSize='12'>
						{this.state.popup[2].length > 0 ?
							this.state.popup[2].split('\n').map((value: any, index: number) =>
								<text
									x={this.state.popup[0] + 10} y={this.state.popup[1] + (index * 12)}
									key={index.toString()}
								>{value}</text>) : null
						}
					</g>
				</svg>
				<FpsDisplay />
				{
					this._renderBarGraphInfo()
				}
			</div>
		)
	}

	_renderBarGraphInfo = () => {
		const { selectedBarData } = this.props;
		if (selectedBarData) {
			return <BarGraphInfoCard 
				data={selectedBarData}
				onClose={() => {
					this._selectBarGraph(null)
				}}
			/>
		}
	}
	_updateSelectedBarGraph = (barData: BarData) => {
		const { selectedBarData } = this.props;
		if (selectedBarData && selectedBarData.id === barData.id) {
			store.dispatch(selectBarGraph(barData))
		}
	}

	_updateBalloonInfo = (data: BarData|null) => {
		if (data) {
			const { infoBalloonList } = this.props;
			const balloon = infoBalloonList.find((i: BalloonInfo) => i.id === data.id)
			if (balloon) {
				this._selectBarGraph(data);
			}
		}
	}

	_selectBarGraph = (data: BarData|null) => {
		if (!!data) {
			const { infoBalloonList } = this.props;
			const ballon = infoBalloonList.find((i: BalloonInfo) => i.id === data.id)
			const newInfo: BalloonInfo = {
				id: data.id as string,
				titleColor: [0xff, 0xff, 0xff],
				position: data.position?? [],
				title: data.text,
				items: data.data.map((item): BalloonItem => ({
					text: (item.label+' : '+item.value),
					color: item.color
				})),
			}

			if (!ballon) {
				store.dispatch(appendBallonInfo(newInfo))
			} else {
				store.dispatch(updateBallonInfo(newInfo))
			}
	}
		// store.dispatch(selectBarGraph(data))
	}
}
export default connectToHarmowareVis(App);


/*					<div style={{ position: "absolute", left: 30, top: 120, zIndex: 1 }}>
						<NavigationControl />
					</div>
				*/

			/*				<InteractiveMap
					viewport={viewport}
					mapStyle={'mapbox://styles/mapbox/dark-v8'}
					onViewportChange={onViewportChange}
					mapboxApiAccessToken={this.state.mapbox_token}
					visible={true}>

					<DeckGL viewState={viewport} layers={layers} onWebGLInitialized={this.initialize} />

				</InteractiveMap>
				: <LoadingIcon loading={true} />;
*/
