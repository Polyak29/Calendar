import './index.scss';
import * as React from "react";
//@ts-ignore
import TimePicker from "react-times"
import 'react-times/css/material/default.css';
// or you can use classic theme
import 'react-times/css/classic/default.css';
import 'moment/locale/ru';
import moment from 'moment'

interface IProps {
  addTimeForTask: (arg: string) => void,
  time: string
}

export default class Time extends React.Component<IProps> {

  onTimeChange(options:any) {
    const time: string = `${options.hour}:${options.minute}`;
    this.props.addTimeForTask(time);
  }

  onFocusChange(focusStatue: any) {
    console.log(focusStatue);
  }
  render() {

    return (
      <TimePicker
        theme={'classic'}
        onFocusChange={this.onFocusChange.bind(this)}
        onTimeChange={this.onTimeChange.bind(this)}
         time={this.props.time || ''}
        withoutIcon={false}
      />
    )
  }
}

