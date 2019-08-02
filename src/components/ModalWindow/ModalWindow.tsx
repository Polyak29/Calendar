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
  textArea:any = React.createRef<HTMLDivElement>();

  constructor(props:any) {
  super(props);
  this.textArea = React.createRef();
}

  static defaultProps: Partial<IProps> = {
    ListTasks: [],
    onChangeText: () => string,
    handleClickAddTask: () => [],
    isAddingTask: false,
  };

  handleKeyPress = (event:any) => {
    const {handleClickAddTask} = this.props;

    if(event.key === 'Enter'){
      handleClickAddTask(event);
    }
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