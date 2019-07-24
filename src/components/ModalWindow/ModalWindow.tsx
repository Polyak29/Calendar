import './index.scss';
import * as React from "react";
import {string} from "prop-types";
import {listTask} from "../../helpers/interfaces";
import DraftEditor from "../DraftEditor/DraftEditor";

interface IProps {
  listTasks:listTask[],
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

  get lineHeight() {
    if (window.getComputedStyle(this.textArea.current) === null) {
      return 0;
    }
    return parseInt(window.getComputedStyle(this.textArea.current).getPropertyValue('line-height'));
  }

  handleChange = (event:any) => {
  const textareaLineHeight = this.lineHeight;
  const { onChangeText } = this.props;
  const { minRows, maxRows } =this.props;
  const previousRows = event.target.rows;
  const value = event.target.value;

  event.target.rows = minRows;

  const currentRows = Math.trunc(event.target.scrollHeight / textareaLineHeight);

  if (currentRows === previousRows) {
    event.target.rows = currentRows;
  }

  if (currentRows >= maxRows) {
    event.target.rows = maxRows;
    event.target.scrollTop = event.target.scrollHeight;
  }
    onChangeText(value);
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