import './index.scss';
import * as React from 'react';
import DayPicker from 'react-day-picker';
import 'moment/locale/ru';
import 'react-day-picker/lib/style.css';
import {
  deepClone,
  randomNumber,
  stylingCalendar,
  stringTransformDate,
  configCurrentDay,
  getIndexDayWithTask
} from "../../helpers/util";
import ICalendarConfig from "../../models/calendarConfig/ICalendarConfig";
import ITask from "../../models/task/ITask";


import MomentLocaleUtils from 'react-day-picker/moment';
import ModalWindow from "../ModalWindow";
import TodoList from '../TodoList';
import Helmet from "react-helmet";
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
  activeContextMenuDate
} from "../../actions/app";
import { connect } from "react-redux";
import ContextMenu from "../ContextMenu/ContextMenu";
import TaskModel from "../../models/task/TaskModel";
import CalendarConfigModel from "../../models/calendarConfig/CalendarConfigModel";

interface IProps {
  day: Date,
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
  hideContextMenu: (arg:boolean) => void,
  activeContextMenu: (data: object) => void,
  activeContextMenuDate: (data: object) => void,
  saveData: (data: object) => void,
  axisX: number,
  axisY: number,
  isClickOnDay: boolean
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
    let data: {
      selectedDay?: Date,
      dayIsSelected: boolean,
      isAddingTask: boolean
    } = {
      dayIsSelected: false,
      selectedDay: undefined,
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

    const date = stringTransformDate(day);
    const currentDay: ICalendarConfig = configCurrentDay(tempListTasks, selectedDay)|| new CalendarConfigModel();
    let data: {
      listTasks: ICalendarConfig[],
      daysWithDoneTask: Date[]
    } =
      {
        listTasks: [],
        daysWithDoneTask: []
      };

    currentDay.tasks.map((value: any) => {
      if (value.id === id) {
        if (value.isCompleted) {
          value.isCompleted = false;
        } else {
          value.isCompleted = true;
        }
      }
    });

    const taskNotCompleted = currentDay.tasks.filter((value: any) => !value.isCompleted);
    const indexDay = getIndexDayWithTask(tempDaysWithDoneTask, selectedDay);

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
    console.log(data);
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

    if (selectedDay === null) {
      return null;
    }

    const element = listTasks.find(value => value.day === selectedDay.toLocaleDateString());

    if (element) {
      if (element.tasks.length > 0) {
        return <TodoList
          handleClickRemoveTask={this.handleClickRemoveTask}
          key={+this.idOfDate(element.day)}
          day={element.day}
          tasksOnDay={element.tasks}
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

    const currentDay = tempListTasks.find((value: any) => value.day === day);

    if (!currentDay){
      return null;
    }

    const currentTask = currentDay.tasks.find((value: any) => value.id === id);

    if (!currentTask){
      return null;
    }

    const indexTask: number = currentDay.tasks.indexOf(currentTask);
    const taskCompletedLength: number = currentDay.tasks.filter((value: any) => value.isCompleted === true).length;
    let data: {
      listTasks: ICalendarConfig[],
      daysWithTasks: Date[],
      daysWithDoneTask: Date[]
    } = {
      listTasks: [],
      daysWithTasks: [],
      daysWithDoneTask: []
    };

    currentDay.tasks.splice(indexTask, 1);

    if (currentDay.tasks.length === 0) {
      currentDay.isCompleted = false;

      const index: number = getIndexDayWithTask(tempDaysWithTask, selectedDay);

      tempDaysWithTask.splice(index, 1);

      const index2 = getIndexDayWithTask(tempDaysWithDoneTask, selectedDay);

      if (index2 !== -1) {
        tempDaysWithDoneTask.splice(index2, 1);
      }
      tempListTasks.splice(index, 1);
    } else {
      if (currentDay.tasks.length === taskCompletedLength) {
        currentDay.isCompleted = true;
        tempDaysWithDoneTask.push(selectedDay);
      }
    }

    data.listTasks = tempListTasks;
    data.daysWithTasks = tempDaysWithTask;
    data.daysWithDoneTask = tempDaysWithDoneTask;

    removeTask(data);
    saveData(data);
  };

  handleClickAddTask = () => {
    const { addTask, selectedDay, daysWithTasks, listTasks, daysWithDoneTask, saveData, editorState, idTask } = this.props;
    const tempDaysWithTask = deepClone(daysWithTasks);
    const tempListTasks = deepClone(listTasks);
    const tempDaysWithDoneTask = deepClone(daysWithDoneTask);
    let data: {
      daysWithTasks: Date[],
      daysWithDoneTask: Date[],
      listTasks: ICalendarConfig[],
    } = {
      daysWithTasks: [],
      listTasks: [],
      daysWithDoneTask: []
    };

    if (editorState.getCurrentContent().getPlainText().length === 0) {
      return null;
    }
    const currentDay = tempListTasks.find((value: any) => value.day === selectedDay.toLocaleDateString());

      if (!currentDay) {
        tempListTasks.push({
          day: selectedDay.toLocaleDateString(),
          isCompleted: false,
          tasks: [{
            content: editorState.getCurrentContent().getPlainText(),
            id: randomNumber(),
            isCompleted: false,
            taskForEdit: convertToRaw(editorState.getCurrentContent())
          }]
        });
        const index = getIndexDayWithTask(tempDaysWithTask, selectedDay);

        if (index === -1) {
          tempDaysWithTask.push(selectedDay);
        }
      }
      else {
        const currentTask = currentDay.tasks.find((value: any) => value.id === idTask);
        if (!currentTask) {
          currentDay.tasks.push({
            content: editorState.getCurrentContent().getPlainText(),
            id: randomNumber(),
            isCompleted: false,
            taskForEdit: convertToRaw(editorState.getCurrentContent())
          });
        } else {
          currentTask.content = editorState.getCurrentContent().getPlainText()
        }

        const lengthTasksCompleted: number = currentDay.tasks.filter((value: any) => value.isCompleted === true).length;

        if (currentDay.tasks.length !== lengthTasksCompleted) {
          currentDay.isCompleted = false;

          const index = getIndexDayWithTask(tempDaysWithTask, selectedDay);

          if (index === -1) {
            tempDaysWithTask.push(selectedDay);
          }

          const index2 = getIndexDayWithTask(tempDaysWithDoneTask, selectedDay);

          if (index2 !== -1) {
            tempDaysWithDoneTask.splice(index2, 1);
          }
        }
      }

    data.daysWithTasks = tempDaysWithTask;
    data.listTasks = tempListTasks;
    data.daysWithDoneTask = tempDaysWithDoneTask;
    console.log(data);
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
    const currentDay = configCurrentDay(listTasks, selectedDay);

    if (!currentDay) {
      return null;
    }

    const task: ITask = currentDay.tasks.find(value => value.id === idTask) || new TaskModel();

    if (!task) {
      return null;
    }

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
      isClickOnDay
    } = this.props;

    const currentDay: ICalendarConfig = configCurrentDay(listTasks, selectedDay) || new CalendarConfigModel();
    const tasksOnDay = currentDay.tasks;

    const modifiers = {
      daysWithTasks: daysWithTasks,
      selectedDay: selectedDay,
      daysWithDoneTask: daysWithDoneTask
    };

    const modifiersStyles = {
      daysWithTasks: {
        boxShadow: 'none',
        background: `linear-gradient(0deg, rgba(63,94,251,1) ${0}%, rgba(252,70,211,0.5) ${0}%)`
      },
      selectedDay: {
        boxShadow: 'inset 0px 36px 4px 17px white',
        backgroundColor: 'inherit',
        color: '#ae88ea',
      },
      daysWithDoneTask: {
        boxShadow: 'none',
        background: `linear-gradient(0deg, rgba(63,94,251,1) ${100}%, rgba(252,70,211,0.5) ${100}%)`
      }
    };

    return <React.Fragment>
      {this.renderModalBackground()}
      <div className={'wrap'} >
        <Helmet>
          <style>{stylingCalendar()}</style>
        </Helmet>
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
        <DayPicker
          fixedWeeks
          localeUtils={MomentLocaleUtils}
          locale={'Ru'}
          className={'calendar'}
          onDayClick={this.handleDayClick}
          selectedDays={selectedDay}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          navbarElement={<NavBar/>}
          onContextMenu={this.onContextMenu}
        />
        {this.renderContainerForViewText()}
        {this.renderListTask()}
        {this.renderButton()}
        <ModalWindow
          isAddingTask={isAddingTask}
          ListTasks={listTasks}
          handleClickAddTask={this.handleClickAddTask}
          isNewTask={isNewTask}
        />
      </div>
    </React.Fragment>;
  }
}

function NavBar({
                  onPreviousClick,
                  onNextClick,
                  className,
                }: any) {
  const styleLeft: object = {
    position: 'absolute',
    top: '18px',
    left: '30px',
    fontSize: '15px',
    cursor: 'pointer'
  };
  const styleRight: object = {
    position: 'absolute',
    top: '18px',
    right: '30px',
    fontSize: '15px',
    cursor: 'pointer'
  };
  return <div className={className}>
    <div style={styleLeft} onClick={() => onPreviousClick()}>
      <i className="fas fa-chevron-left"/>
    </div>
    <div style={styleRight} onClick={() => onNextClick()}>
      <i className="fas fa-chevron-right"/>
    </div>
  </div>;
}

const mapStateToProps = (state: any) => ({
  listTasks: state.app.listTasks,
  dayIsSelected: state.app.dayIsSelected,
  isAddingTask: state.app.isAddingTask,
  daysWithDoneTask: state.app.daysWithDoneTask,
  daysWithTasks: state.app.daysWithTasks,
  selectedDay: state.app.selectedDay,
  content: state.app.content,
  day: state.app.day,
  idTask: state.app.idTask,
  editorState: state.app.editorState,
  contextMenuIsVisible: state.app.contextMenuIsVisible,
  isViewText: state.app.isViewText,
  isNewTask: state.app.isNewTask,
  axisX: state.app.axisX,
  axisY: state.app.axisY,
  isClickOnDay: state.app.isClickOnDay
});

const mapDispatchToProps = (dispatch: any) => ({
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
});

export default connect(mapStateToProps, mapDispatchToProps)(App);