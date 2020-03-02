import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as actions from '../../actions/actions'
import { BarGraphState } from '../../reducer/barGraphSettings'

const ShowTitle: React.FC<{}> = (props)  => {
  const state = useSelector<any, BarGraphState>(st => {
    return st.barGraphSettings
  })
  const dispatcher = useDispatch()
  const { showTitle } = state;
  const onChangeHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
    console.log("toggle show title" + ev.currentTarget.value)
    dispatcher(actions.showBarTitle(!showTitle))
  }
  return (<div>
    <input
      type="checkbox"
      checked={showTitle}
      onChange={onChangeHandler}
    />
  </div>)
}

export default ShowTitle;
