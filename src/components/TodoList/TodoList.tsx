import * as React from "react";
import './index.scss';

interface IProps {
  id: number,
  content:{
    id:number,
    content: string
    isCompleted: boolean
  }[],
  onChangeIsCompleted: (isCompleted:boolean,idd:number) => void,
  handleClickRemoveTask: () => void
}

interface IState {
  checked: boolean,
  idContent: number,
  styleInput:{}
}
class TodoList extends React.Component<IProps> {

  static defaultProps: Partial<IProps> = {
    id: NaN,
    content: [],
    onChangeIsCompleted: () => {},
    handleClickRemoveTask: () => {}
  };

  public state: IState = {
    checked: false,
    idContent: NaN,
    styleInput: {}
  };

  onChangeCheckBox = (event: any) => {
    const { onChangeIsCompleted, id } = this.props;

    onChangeIsCompleted(event.target.checked, id)
  };


  renderTask() {
    const {id, content} = this.props;
    const styleInput:any = {
      textDecoration: 'line-through',
      opacity: '0.5',
    };

    return content.map((value) => {

        if(value.isCompleted) {
          return (
            <p key={value.id} style={styleInput} >
              <input
                onChange={this.onChangeCheckBox}
                type={'checkbox'}
              />
              {value.content}
            </p>
          )
        }
      return (
        <p key={value.id}>
          <input
            onChange={this.onChangeCheckBox}
            type={'checkbox'}
          />
          {value.content}
        </p>
      )
      }
    )
  }

  render() {
    const {handleClickRemoveTask} = this.props;

      return (
        <div className={'container-task'}>
          {this.renderTask()}
          <button className={'button-remove'} onClick={handleClickRemoveTask}>DELETE</button>
        </div>
      )
      }
}

export default TodoList;