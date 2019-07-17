import './index.scss';
import * as React from "react";
import {string} from "prop-types";

interface IProps {
  listTask: {
    day: Date,
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
  rows:number,
  minRows: number,
  maxRows: number,
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
    minRows: 4,
    maxRows: 10,
    rows: 5,
    isAddingTask: false,
  };

  public state: IState = {
    value: '',
    rows: 3,
    minRows: 3,
    maxRows: 10
  };

  UNSAFE_componentWillReceiveProps(nextProps:any) {
    const {value} = this.state;
    if (nextProps.textValue !== value) {
      this.setState({value: nextProps.textValue});
    }
  }

  get lineHeight() {
    if (window.getComputedStyle(this.textArea.current) === null) {
      return 0;
    }
    return parseInt(window.getComputedStyle(this.textArea.current).getPropertyValue('line-height'));
  }

  handleChange = (event:any) => {
  const textareaLineHeight = this.lineHeight;
  const { onChangeText } = this.props;
  const { minRows, maxRows } =this.state;
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

  this.setState({
    value: event.target.value,
    rows: currentRows < maxRows ? currentRows : maxRows
  });
    onChangeText(value);
};

  handleKeyPress = (event:any) => {
    const {handleClickAddTask} = this.props;
    if(event.key === 'Enter'){
      handleClickAddTask(event);
    }
  }

  public render() {
    const {isAddingTask, handleClickAddTask} = this.props;
    if (!isAddingTask) {
      return null;
    }

    return (
      <div className={'wrap-textArea'}>
         <textarea
           ref={this.textArea}
           rows={this.props.rows}
           value={this.state.value}
           className={'container'}
           onChange={this.handleChange}
           onKeyPress={this.handleKeyPress}
         />
        <div className={'button-add'} onClick={handleClickAddTask} >Добавить</div>
      </div>
    )
  }
}

export default ModalWindow