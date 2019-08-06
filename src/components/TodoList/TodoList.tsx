import * as React from "react";
import './index.scss';
import ITask from "../../interfaces";

interface IProps {
  contextMenuIsVisible: boolean,
  day: string,
  tasksOnDay:ITask[],
  onChangeIsCompleted: (isCompleted:boolean, day:string, id:number) => void,
  handleClickRemoveTask: (day:string, id:number) => void,
  activeContextMenu: (data: object) => void,
  openTextEditor: (arg: number) => void
}

export default class TodoList extends React.Component<IProps> {

  static defaultProps: Partial<IProps> = {
    day: '',
    tasksOnDay: [],
    onChangeIsCompleted: () => {},
    handleClickRemoveTask: () => {}
  };

  onChangeCheckBox = (isCompleted:boolean, id: number) => {
    const { onChangeIsCompleted, day } = this.props;

    onChangeIsCompleted(isCompleted, day, id)
  };

  onContextMenu = (id:number, event: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
    let data = {axisX:0, axisY:0, idTask:0};
    data.axisX = event.clientX;
    data.axisY = event.clientY;
    data.idTask = id;
    console.log(typeof event);
    this.props.activeContextMenu(data);
    event.preventDefault();
};


  renderTask() {
    const { tasksOnDay, handleClickRemoveTask, day } = this.props;
    const styleIcon:object = {
      background: 'radial-gradient(circle farthest-corner at 50px 50px, #a8e3e9, #af7eeb )'
    };
    const styleContent:object = {
      textDecoration: 'line-through',
      color: '#8d8d8d'
    };

    return tasksOnDay.map((value) => {
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
            <div className={'task__time'}>
              {value.time}
              {/*style={value.isCompleted ? styleContent : {}}*/}
            </div>
            <p className={'task__content'}
               onClick={this.onChangeCheckBox.bind(this, value.isCompleted, value.id)}
               style={value.isCompleted ? styleContent : {}}
               onContextMenu={this.onContextMenu.bind(this, value.id)}
            >
              {value.content}
            </p>
            <i
              className="far fa-trash-alt task__button-remove"
              onClick={handleClickRemoveTask.bind(this, day, value.id)}
            />
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
