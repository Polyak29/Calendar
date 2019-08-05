import './index.scss';
import * as React from "react";
import {string} from "prop-types";
import DraftEditor from "../DraftEditor/DraftEditor";
import ICalendarConfig from "../../models/calendarConfig/ICalendarConfig";

interface IProps {
  ListTasks:ICalendarConfig[],
  onChangeText: (event:any) => void,
  handleClickAddTask: (event:any) => void,
  isNewTask: boolean,
  isAddingTask: boolean,
}

class ModalWindow extends React.Component<IProps> {

  static defaultProps: Partial<IProps> = {
    ListTasks: [],
    onChangeText: () => string,
    handleClickAddTask: () => [],
    isAddingTask: false,
  };


  public render() {
    const {isAddingTask, handleClickAddTask, isNewTask} = this.props;

    if (!isAddingTask) {
      return null;
    }

    return (
      <div className={'wrap-textArea'}>
        <DraftEditor />
          {/*<div className={'button-time'} onClick={handleClickAddTask} >*/}
          {/*  <p className={'button-time__title'}>Укажите время</p>*/}
          {/*</div>*/}
          <div className={'button-add'} onClick={handleClickAddTask} >{isNewTask ?'Добавить':'Изменить'}</div>
      </div>
    )
  }
}

export default ModalWindow