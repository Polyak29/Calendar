import './index.scss';
import * as React from "react";
import {string} from "prop-types";

interface IProps {
  listTask: {
    id: number,
    task: {id:number, task:string[]}
  } [],
  onChangeText: (event:any) => void,
  handleClickAddTask: (event:any) => void,
  minRows: number,
  maxRows: number,
  rows: number,
  isAddingTask:boolean
}

interface IState {
  value:string,
  rows:number
}

class ModalWindow extends React.Component<IProps> {
  public textArea:any = React.createRef<HTMLDivElement>();

  constructor(props:any) {
  super(props);
  this.textArea = React.createRef();
}

  static defaultProps: Partial<IProps> = {
    listTask: [],
    onChangeText: () => string,
    handleClickAddTask: () => [],
    minRows: 1,
    maxRows: 10,
    rows: 4,
    isAddingTask: false,
  };

  public state: IState = {
    value: '',
    rows:4
  };

  get lineHeight() {
  if (window.getComputedStyle(this.textArea.current) === null) {
    return 0;
  }
  return parseInt(window.getComputedStyle(this.textArea.current).getPropertyValue('line-height'));
}

  handleChange = (event:any) => {
  const textareaLineHeight = this.lineHeight;
  const { minRows, maxRows, onChangeText } = this.props;
  const previousRows = event.target.rows;
  const value = event.target.value;

  event.target.rows = minRows;

  const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);

  if (currentRows === previousRows) {
    event.target.rows = currentRows;
  }

  if (currentRows >= maxRows) {
    event.target.rows = maxRows;
    event.target.scrollTop = event.target.scrollHeight;
  }

  this.setState({
    value,
    rows: currentRows < maxRows ? currentRows : maxRows
  }, () => {
    onChangeText(value);
  });
};

  public render() {
    const {isAddingTask, handleClickAddTask} = this.props;

    if (!isAddingTask) {
      return null;
    }

    return (
      <div>
         <textarea
           ref={this.textArea}
           rows={this.props.rows}
           value={this.state.value}
           className={'container'}
           onChange={this.handleChange}
         />
        <button className={'button-add'} onClick={handleClickAddTask}>Добавить</button>
      </div>
    )
  }
}

export default ModalWindow