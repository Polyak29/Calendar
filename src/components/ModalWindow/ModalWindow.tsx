import './index.scss';
import * as React from "react";
import {string} from "prop-types";
import {listTasks} from "../../helpers/interfaces";
import DraftEditor from "../DraftEditor/DraftEditor";

interface IProps {
  listTasks:listTasks[],
  onChangeText: (event:any) => void,
  handleClickAddTask: (event:any) => void,
  minRows: number,
  maxRows: number,
  rows: number,
  isAddingTask:boolean,
}

class ModalWindow extends React.Component<IProps> {
  textArea:any = React.createRef<HTMLDivElement>();

  constructor(props:any) {
  super(props);
  this.textArea = React.createRef();
}

  static defaultProps: Partial<IProps> = {
    listTasks: [],
    onChangeText: () => string,
    handleClickAddTask: () => [],
    minRows: 4,
    maxRows: 10,
    rows: 5,
    isAddingTask: false,
  };

  handleKeyPress = (event:any) => {
    const {handleClickAddTask} = this.props;

    if(event.key === 'Enter'){
      handleClickAddTask(event);
    }
  };

  public render() {
    const {isAddingTask, handleClickAddTask} = this.props;

    if (!isAddingTask) {
      return null;
    }

    return (
      <div className={'wrap-textArea'}>
        <DraftEditor />
        <div className={'button-add'} onClick={handleClickAddTask} >Добавить</div>
      </div>
    )
  }
}

export default ModalWindow