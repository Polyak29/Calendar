import './index.scss';
import * as React from "react";
import DraftEditor from "../DraftEditor/DraftEditor";
import {ICalendarConfig} from "../../interfaces";
import Time from "../Time";


interface IProps {
  addTimeForTask: (arg: string) => void,
  ListTasks:ICalendarConfig[],
  handleClickAddTask: () => void,
  editorState: any,
  updateEditorState: (arg: object) => void,
  isNewTask: boolean,
  isAddingTask: boolean,
  time: string
}

class ModalWindow extends React.Component<IProps> {

  static defaultProps: Partial<IProps> = {
    ListTasks: [],
    isAddingTask: false,
  };


  public render() {
    const {isAddingTask, handleClickAddTask, isNewTask, updateEditorState, time, editorState, addTimeForTask} = this.props;

    if (!isAddingTask) {
      return null;
    }

    return (
      <div className={'wrap-textArea'}>
        <DraftEditor updateEditorState={updateEditorState} editorState={editorState} />
        <div className={'wrap-time'}>
          <Time
            addTimeForTask={addTimeForTask}
            time={time}
          />
        </div>

          <div className={'button-add'} onClick={handleClickAddTask} >{isNewTask ?'Добавить':'Изменить'}</div>
      </div>
    )
  }
}

export default ModalWindow