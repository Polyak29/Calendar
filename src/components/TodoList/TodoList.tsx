import * as React from "react";
import './index.scss';
import ContextMenu from "../ContextMenu";

interface IProps {
  day: string,
  content:{
    id:number,
    content: string
    isCompleted: boolean
  }[],
  onChangeIsCompleted: (isCompleted:boolean, day:string, id:number) => void,
  handleClickRemoveTask: (day:string, id:number) => void
}

interface IState {
  idTask: number,
  styleInput:{}
}
export default class TodoList extends React.Component<IProps> {

  static defaultProps: Partial<IProps> = {
    day: '',
    content: [],
    onChangeIsCompleted: () => {},
    handleClickRemoveTask: () => {}
  };

  public state: IState = {
    idTask: NaN,
    styleInput: {}
  };

  onChangeCheckBox = (isCompleted:boolean, id: number) => {
    const { onChangeIsCompleted, day } = this.props;

    onChangeIsCompleted(isCompleted, day, id)
  };

  onContextMenu = (event:any) => {
    event.preventDefault();

};


  renderTask() {
    const { content, handleClickRemoveTask, day } = this.props;
    const styleIcon:object = {
      background: 'radial-gradient(circle farthest-corner at 50px 50px, #a8e3e9, #af7eeb )'
    };
    const styleContent:object = {
      textDecoration: 'line-through',
      color: '#8d8d8d'
    };

    return content.map((value) => {
        return (
          <div
            className={'task'}
            key={value.id}

          >
            <div className={'task__icon'}
                 onClick={this.onChangeCheckBox.bind(this, value.isCompleted, value.id)}
                 style={value.isCompleted ? styleIcon : {}}
            >
              <i className="fas fa-check" />
            </div>
            <p className={'task__content'}
               onClick={this.onChangeCheckBox.bind(this, value.isCompleted, value.id)}
               style={value.isCompleted ? styleContent : {}}
               onContextMenu={this.onContextMenu}
            >
              {value.content}
            </p>
            <i
              className="far fa-trash-alt task__button-remove"
              onClick={handleClickRemoveTask.bind(this, day, value.id)}

            />
            {/*<ContextMenu />*/}
          </div>

        )
      }
    )
  }

  render() {

      return (
        <div className={'container-todo'}>
          <div className={'container-todo__list'}>
            {this.renderTask()}
          </div>
        </div>
      )
      }
}
