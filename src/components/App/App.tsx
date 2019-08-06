import './index.scss';
import * as React from 'react';

import {
  deepClone,
  randomNumber,
  stringTransformDate,
  configCurrentDay,
  getIndexDayWithTask
} from "../../helpers/util";


import ModalWindow from "../ModalWindow";
import TodoList from '../TodoList';
import {convertFromRaw, convertToRaw, EditorState} from 'draft-js'

import {
  addTask,
  openTextEdit,
  selectDay,
  onChangeIsCompleted,
  removeTask,
  initLoad,
  saveData,
  activeContextMenu,
  hideContextMenu,
  activeContextMenuDate,
  updateEditorState,
  addTimeForTask,
} from "../../actions/app";
import { connect } from "react-redux";
import ContextMenu from "../ContextMenu/ContextMenu";
import TaskModel from "../../models/task/TaskModel";
import CalendarConfigModel from "../../models/calendarConfig/CalendarConfigModel";
import ITask, {ICalendarConfig, IDayClick, IEditTask, IMapState } from "../../interfaces";
import {Action} from "redux";
import Calendar from "../Calendar/Calendar";

interface IProps {
  isViewText: boolean,
  idTask: number,
  selectedDay: Date,
  daysWithTasks: Date[],
  daysWithDoneTask: Date[],
  isNewTask: boolean,
  contextMenuIsVisible: boolean,
  listTasks: ICalendarConfig[],
  dayIsSelected: boolean,
  isAddingTask: boolean,
  editorState: any,
  addTask: (arg: object) => void,
  selectDay: (arg: object) => void,
  openTextEdit: (arg: object) => void,
  onChangeIsCompleted: (arg: object) => void,
  removeTask: (arg: object) => void,
  initLoad: () => void,
  addTimeForTask: (arg: string) => void,
  hideContextMenu: (arg:boolean) => void,
  activeContextMenu: (data: object) => void,
  activeContextMenuDate: (data: object) => void,
  updateEditorState: (arg: object) => void,
  saveData: (data: object) => void,
  axisX: number,
  axisY: number,
  isClickOnDay: boolean,
  time: string
}


class App extends React.Component<IProps> {

  componentDidMount(): void {
    const { initLoad } = this.props;

    initLoad();
  }

  public idOfDate = (day: string) => {
    return day.replace(/\./g, '');
  };


  public handleDayClick = (day: Date) => {
    const { dayIsSelected, selectedDay, selectDay, isAddingTask } = this.props;
    let tempSelectedDay = deepClone(selectedDay);
    let tempDayIsSelected = dayIsSelected;
    let data: IDayClick = {
      dayIsSelected: false,
      selectedDay: new Date(),
      isAddingTask: false
    };


    if (selectedDay) {
      if (tempSelectedDay.toLocaleDateString() === day.toLocaleDateString()) {
        tempSelectedDay = null;
        tempDayIsSelected = false;
      } else {
        tempSelectedDay = day;
        tempDayIsSelected = true;
      }
    } else {
      tempSelectedDay = day;
      tempDayIsSelected = true;
    }

    data.selectedDay = tempSelectedDay;
    data.dayIsSelected = tempDayIsSelected;
    data.isAddingTask = isAddingTask ? false : isAddingTask;
    selectDay(data);
  };

  onChangeIsCompleted = (isCompleted: boolean, day: string, id: number) => {
    const { listTasks, daysWithDoneTask, onChangeIsCompleted, saveData, selectedDay} = this.props;

    const tempListTasks: ICalendarConfig[] = deepClone(listTasks);
    const tempDaysWithDoneTask: Date[] = deepClone(daysWithDoneTask);

    const date: Date = stringTransformDate(day);
    const currentDay: ICalendarConfig = configCurrentDay(tempListTasks, selectedDay)|| new CalendarConfigModel();
    let data: { listTasks: ICalendarConfig[], daysWithDoneTask: Date[] } =
      {
        listTasks: [],
        daysWithDoneTask: []
      };

    currentDay.tasks.map((value: ITask) => {
      if (value.id === id) {
        if (value.isCompleted) {
          value.isCompleted = false;
        } else {
          value.isCompleted = true;
        }
      }
    });

    const taskNotCompleted: ITask[] = currentDay.tasks.filter((value: ITask) => !value.isCompleted);
    const indexDay: number = getIndexDayWithTask(tempDaysWithDoneTask, selectedDay);

    if (taskNotCompleted.length === 0) {
      currentDay.isCompleted = true;

      if (indexDay === -1) {
        tempDaysWithDoneTask.push(date);
      }

    }
    else {
      currentDay.isCompleted = false;

      if (indexDay !== -1) {
        tempDaysWithDoneTask.splice(indexDay, 1);
      }
    }
    data.listTasks = tempListTasks;
    data.daysWithDoneTask = tempDaysWithDoneTask;

    onChangeIsCompleted(data);
    saveData(data);

  };

  onContextMenu = ( day: Date, arg2: object, event: React.MouseEvent<HTMLDivElement>) => {
    let data = {axisX:0, axisY:0, selectedDay: new Date()};
    data.axisX = event.clientX;
    data.axisY = event.clientY;
    data.selectedDay = day;

    this.props.activeContextMenuDate(data);
    event.preventDefault();
  };

  renderListTask() {
    const { listTasks, selectedDay, contextMenuIsVisible, activeContextMenu } = this.props;
    const tempListTasks: ICalendarConfig[] = deepClone(listTasks);

    if (selectedDay === null) {
      return null;
    }

    const currentDay: ICalendarConfig = configCurrentDay(tempListTasks, selectedDay)|| new CalendarConfigModel();

    if (currentDay) {
      if (currentDay.tasks.length > 0) {
        return <TodoList
          handleClickRemoveTask={this.handleClickRemoveTask}
          key={+this.idOfDate(currentDay.day)}
          day={currentDay.day}
          tasksOnDay={currentDay.tasks}
          onChangeIsCompleted={this.onChangeIsCompleted}
          contextMenuIsVisible={contextMenuIsVisible}
          activeContextMenu={activeContextMenu}
          openTextEditor={this.openTextEditor}
        />
      }
    }
  }

  handleClickOpenTextEdit = () => {
    const { openTextEdit } = this.props;

    openTextEdit(EditorState.createEmpty());
  };

  handleClickRemoveTask = (day: string, id: number) => {
    const { listTasks, daysWithTasks, daysWithDoneTask, removeTask, saveData, selectedDay } = this.props;

    const tempDaysWithTask: Date[] = deepClone(daysWithTasks);
    const tempListTasks: ICalendarConfig[] = deepClone(listTasks);
    const tempDaysWithDoneTask: Date[] = deepClone(daysWithDoneTask);

    const currentDay: ICalendarConfig = configCurrentDay(tempListTasks, selectedDay)|| new CalendarConfigModel();

    const currentTask: ITask = currentDay.tasks.find((value: ITask) => value.id === id) || new TaskModel();
    const indexTask: number = currentDay.tasks.indexOf(currentTask);
    const tasksNotCompleted: ITask[] = currentDay.tasks.filter(value => !value.isCompleted);
    let data: IEditTask = {
      listTasks: [],
      daysWithTasks: [],
      daysWithDoneTask: []
    };

    currentDay.tasks.splice(indexTask, 1);

    if (tasksNotCompleted.length === 0) {
      tempDaysWithDoneTask.push(selectedDay);
      currentDay.isCompleted = true;
    } else {
      const indexDoneTask: number = getIndexDayWithTask(tempDaysWithDoneTask, selectedDay);

      tempDaysWithDoneTask.splice(indexDoneTask, 1);
      currentDay.isCompleted = false;
    }

    if (currentDay.tasks.length === 0) {
      const indexTask: number = getIndexDayWithTask(tempDaysWithTask, selectedDay);

      tempDaysWithTask.splice(indexTask, 1);
      currentDay.isCompleted = false;
    }

    data.listTasks = tempListTasks;
    data.daysWithTasks = tempDaysWithTask;
    data.daysWithDoneTask = tempDaysWithDoneTask;

    removeTask(data);
    saveData(data);
  };

  handleClickAddTask = () => {
    const { addTask, selectedDay, daysWithTasks, listTasks, daysWithDoneTask, saveData, editorState, idTask, time } = this.props;
    const tempDaysWithTask: Date[] = deepClone(daysWithTasks);
    const tempListTasks: ICalendarConfig[] = deepClone(listTasks);
    const tempDaysWithDoneTask: Date[] = deepClone(daysWithDoneTask);
    let data: IEditTask = {
      daysWithTasks: [],
      listTasks: [],
      daysWithDoneTask: []
    };

    if (editorState.getCurrentContent().getPlainText().length === 0) {
      return null;
    }
    const currentDay = configCurrentDay(tempListTasks, selectedDay);

      if (!currentDay) {
        tempListTasks.push({
          day: selectedDay.toLocaleDateString(),
          isCompleted: false,
          tasks: [{
            content: editorState.getCurrentContent().getPlainText(),
            id: randomNumber(),
            isCompleted: false,
            taskForEdit: convertToRaw(editorState.getCurrentContent()),
            time: time
          }]
        });
        const indexTask: number = getIndexDayWithTask(tempDaysWithTask, selectedDay);

        if (indexTask === -1) {
          tempDaysWithTask.push(selectedDay);
        }
      }
      else {
        const currentTask = currentDay.tasks.find((value: ITask) => value.id === idTask);
        if (!currentTask) {
          currentDay.tasks.push({
            content: editorState.getCurrentContent().getPlainText(),
            id: randomNumber(),
            isCompleted: false,
            taskForEdit: convertToRaw(editorState.getCurrentContent()),
            time: time
          });
        } else {
          currentTask.content = editorState.getCurrentContent().getPlainText()
        }

        const lengthTasksCompleted: number = currentDay.tasks.filter((value: ITask) => value.isCompleted === true).length;

        if (currentDay.tasks.length !== lengthTasksCompleted) {
          currentDay.isCompleted = false;

          const indexTask: number = getIndexDayWithTask(tempDaysWithTask, selectedDay);

          if (indexTask === -1) {
            tempDaysWithTask.push(selectedDay);
          }

          const indexDoneTask: number = getIndexDayWithTask(tempDaysWithDoneTask, selectedDay);

          if (indexDoneTask !== -1) {
            tempDaysWithDoneTask.splice(indexDoneTask, 1);
          }
        }
      }

    data.daysWithTasks = tempDaysWithTask;
    data.listTasks = tempListTasks;
    data.daysWithDoneTask = tempDaysWithDoneTask;

    addTask(data);
    saveData(data);
  };

  openTextEditor = (idTask: number) => {
    const { listTasks,  openTextEdit, selectedDay } = this.props;
    const currentDay = configCurrentDay(listTasks, selectedDay);

    if (!currentDay) {
      return null;
    }

    const currentTask = currentDay.tasks.find(value => value.id === idTask) ;

    if (currentTask) {
      const config = convertFromRaw(currentTask.taskForEdit);
      const editorState = EditorState.createWithContent(config);

      openTextEdit(editorState);

    }
  };

  renderButton() {
    const { dayIsSelected, isAddingTask } = this.props;

    if (isAddingTask) {
      return null;
    }

    if (!dayIsSelected) {
      return null;
    }
    return <div className={'button'} onClick={this.handleClickOpenTextEdit}>
      <div className={'button__plus'} title={'Добавить задачу'}/>
      <p className={'button__title'}>Добавить задачу</p>
    </div>
  }

  // getCompletedTask () {
  //   const { DayTask, daysWithDoneTask, selectedDay } = this.props;
  //   const tempListTasks = deepClone(DayTask);
  //   const element = tempListTasks.find((value: any) => (value.day.toLocaleDateString() === selectedDay.toLocaleDateString())
  //   );
  //   if (element) {
  //     const allTask = element.task.length;
  //     const doneTask = daysWithDoneTask.length;
  //
  //     return Math.trunc((doneTask / allTask) * 100)
  //   } else {
  //
  //   }
  //
  // }

  renderModalBackground() {
    const { contextMenuIsVisible, hideContextMenu } = this.props;
    if (contextMenuIsVisible) {
      return <div className={'modal-background'} onClick={hideContextMenu.bind(this, false)}/>
    }
  }

  renderContainerForViewText() {
    const { isViewText, listTasks, idTask, selectedDay, hideContextMenu } = this.props;
    const tempListTasks: ICalendarConfig[] = deepClone(listTasks);

    const currentDay: ICalendarConfig = configCurrentDay(tempListTasks, selectedDay) || new CalendarConfigModel();

    if (!currentDay) {
      return null;
    }

    const task: ITask = currentDay.tasks.find(value => value.id === idTask) || new TaskModel();

    if (isViewText) {
      return <React.Fragment>
        <div className={'textArea__background'}/>
        <i
          className="fas fa-times textArea__button-close"
          onClick={hideContextMenu.bind(this, false)}
        />
        <div className={'textArea'}>
          <div className={'textArea__container'}>
            {task.content}
          </div>
        </div>
      </React.Fragment>
    }
  }

  render() {
    const {
      selectedDay,
      isAddingTask,
      listTasks,
      daysWithTasks,
      daysWithDoneTask,
      contextMenuIsVisible,
      isNewTask,
      axisX,
      axisY,
      hideContextMenu,
      idTask,
      isClickOnDay,
      updateEditorState,
      editorState,
      addTimeForTask,
      time
    } = this.props;

    const currentDay: ICalendarConfig = configCurrentDay(listTasks, selectedDay) || new CalendarConfigModel();
    const tasksOnDay = currentDay.tasks;

    return <React.Fragment>
      {this.renderModalBackground()}
      <div className={'wrap'} >
        {contextMenuIsVisible ? <ContextMenu
          tasksOnDay={tasksOnDay}
          day={selectedDay.toLocaleDateString()}
          onChangeIsCompleted={this.onChangeIsCompleted}
          openTextEditor={this.openTextEditor}
          selectedDay={selectedDay}
          axisX={axisX}
          axisY={axisY}
          hideContextMenu={hideContextMenu}
          idTask={idTask}
          isClickOnDay={isClickOnDay}
          handleClickOpenTextEdit={this.handleClickOpenTextEdit}
        /> : null}
        <Calendar
          onDayClick={this.handleDayClick}
          selectedDay={selectedDay}
          onContextMenu={this.onContextMenu}
          daysWithTasks={daysWithTasks}
          daysWithDoneTask={daysWithDoneTask}
        />
        {this.renderContainerForViewText()}
        {this.renderListTask()}
        {this.renderButton()}
        <ModalWindow
          time={time}
          addTimeForTask={addTimeForTask}
          isAddingTask={isAddingTask}
          ListTasks={listTasks}
          handleClickAddTask={this.handleClickAddTask}
          isNewTask={isNewTask}
          updateEditorState={updateEditorState}
          editorState={editorState}
        />
      </div>
    </React.Fragment>;
  }
}

const mapStateToProps = (state: IMapState) => ({
  listTasks: state.app.listTasks,
  dayIsSelected: state.app.dayIsSelected,
  isAddingTask: state.app.isAddingTask,
  daysWithDoneTask: state.app.daysWithDoneTask,
  daysWithTasks: state.app.daysWithTasks,
  selectedDay: state.app.selectedDay,
  idTask: state.app.idTask,
  editorState: state.app.editorState,
  contextMenuIsVisible: state.app.contextMenuIsVisible,
  isViewText: state.app.isViewText,
  isNewTask: state.app.isNewTask,
  axisX: state.app.axisX,
  axisY: state.app.axisY,
  isClickOnDay: state.app.isClickOnDay,
  time: state.app.time
});

const mapDispatchToProps = (dispatch: (action: Action) => void) => {
  return{
    addTask: (data: object) => { dispatch(addTask(data)) },
    selectDay: (data: object) => dispatch(selectDay(data)),
    openTextEdit: (data: object) => dispatch(openTextEdit(data)),
    onChangeIsCompleted: (data: object) => dispatch(onChangeIsCompleted(data)),
    removeTask: (data: object) => dispatch(removeTask(data)),
    initLoad: () => dispatch(initLoad()),
    saveData: (data: object) => dispatch(saveData(data)),
    activeContextMenuDate: (data: object) => dispatch(activeContextMenuDate(data)),
    activeContextMenu: (data: object) => dispatch(activeContextMenu(data)),
    hideContextMenu: (data: boolean) => dispatch(hideContextMenu(data)),
    updateEditorState: (data:object) => {dispatch(updateEditorState(data))},
    addTimeForTask: (data:string) => {dispatch(addTimeForTask(data))}
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);