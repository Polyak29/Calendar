import * as React from "react";
import './index.scss';
import ITask from "../../models/task/ITask";

interface IProps {
  idTask: number,
  isClickOnDay: boolean,
  selectedDay: Date,
  day: string,
  axisX: number,
  axisY: number,
  tasksOnDay: ITask[],
  hideContextMenu: (arg:boolean) => void,
  onChangeIsCompleted: (arg1: boolean, arg2: string, arg3: number) => void,
  openTextEditor: (arg: number) => void
  handleClickOpenTextEdit: () => void,
}
export default class ContextMenu extends React.Component<IProps> {

   onChangeCheckBox () {
     const { hideContextMenu, idTask, onChangeIsCompleted, selectedDay } = this.props;
     const day = selectedDay.toLocaleDateString();

     onChangeIsCompleted(true, day ,idTask);
     hideContextMenu(false);
  }

  renderCellIsDone() {
    const { tasksOnDay, idTask } = this.props;
    const task = tasksOnDay.find(value => value.id === idTask);

    if (!task) {
      return null;
    }

    if (!task.isCompleted) {
      return (
        <div className={'context-menu__done'} onClick={this.onChangeCheckBox.bind(this)}>
          Выполнено
        </div>
      )
    }
  }

  render() {
    const { axisX, axisY, hideContextMenu, idTask,  openTextEditor, isClickOnDay, handleClickOpenTextEdit } = this.props;

    if (!isClickOnDay) {
      return(
        <div className={'context-menu'} style={{top: `${axisY - 25}px`, left: `${axisX}px`}}>
          <div className={'context-menu__edit'} onClick={openTextEditor.bind(this, idTask)}>
            Изменить
          </div>
          <div className={'context-menu__view'} onClick={hideContextMenu.bind(this,true)}>
            Просмотр
          </div>
          {this.renderCellIsDone()}
        </div>
      )
    } else {
        return (
          <div className={'context-menu'} style={{top: `${axisY - 25}px`, left: `${axisX}px`}}>
            <div className={'context-menu__add'} onClick={handleClickOpenTextEdit.bind(this)}>
              Добавить задачу
            </div>
          </div>
        )
    }

  }
}



