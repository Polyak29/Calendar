import './index.scss';
import * as React from 'react';
import DayPicker from "react-day-picker";
import 'moment/locale/ru';
import 'react-day-picker/lib/style.css';
import {deepClone, randomNumber, stylingCalendar} from "../../helpers/util";
import {listTask} from "../../helpers/interfaces";
import MomentLocaleUtils from 'react-day-picker/moment';
import ModalWindow from "../ModalWindow";
import TodoList from '../TodoList';
import Helmet from "react-helmet";

import {
  addTask,
  openTextEdit,
  selectDay,
  onChangeText,
  onChangeIsCompleted,
  removeTask,
  initLoad
} from "../../actions/app";
import {connect} from "react-redux";

interface IProps {
  day: Date,
  content: string,
  selectedDay: Date,
  daysWithTask: Date[],
  daysWithDoneTask: Date [],
  listTasks: listTask[],
  dayIsSelected: boolean,
  isAddingTask: boolean,
  addTask: (arg:object) => void,
  selectDay: (arg:object) => void,
  openTextEdit: () => void,
  onChangeText: (arg: string) => void,
  onChangeIsCompleted: (arg:object) => void,
  removeTask: (arg:object) => void,
  initLoad: (arg:string) => void,
}


class App extends React.Component<IProps> {

  componentDidMount(): void {
    const { initLoad, selectedDay } = this.props;

    initLoad(selectedDay.toLocaleDateString());
  }

  public idOfDate = (day: string) => {
    return day.replace(/\./g, '');
  };


  public handleDayClick = (day: Date) => {
    const {dayIsSelected, selectedDay, selectDay, isAddingTask} = this.props;
    let tempSelectedDay = deepClone(selectedDay);
    let tempDayIsSelected = dayIsSelected;
    let data:{
      selectedDay: Date|undefined,
      dayIsSelected: boolean,
      isAddingTask: boolean
    } = {
      dayIsSelected: false,
      selectedDay: undefined,
      isAddingTask: false
    };


    if (selectedDay) {
      if(tempSelectedDay.toLocaleDateString() === day.toLocaleDateString()) {
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

  onChangeIsCompleted = (isCompleted:boolean, day:Date, id:number) => {
    const { listTasks, daysWithDoneTask, onChangeIsCompleted } = this.props;
    const tempListTasks = deepClone(listTasks);
    const tempDaysWithDoneTask = deepClone(daysWithDoneTask);
    let data:{
      listTasks:listTask[],
      daysWithDoneTask:[]
    } =
      {
        listTasks:[],
        daysWithDoneTask:[]
      };
    const element = tempListTasks.find((value:any) => value.day.toLocaleDateString() === day.toLocaleDateString());

    element.task.map((value:any) => {
      if (value.id === id) {
        if (value.isCompleted) {
           value.isCompleted = false;
           return null;
        } else {
           value.isCompleted = true;
        }
      }
    });

    const notCompleted = element.task.filter((value:any) => !value.isCompleted);

    if (notCompleted.length === 0) {
      const index = tempDaysWithDoneTask.indexOf(day);
      if (index === -1) {
        tempDaysWithDoneTask.push(day);
      }
    } else {
      const index = tempDaysWithDoneTask.indexOf(day);

      tempDaysWithDoneTask.splice(index, 1);
    }

    data.listTasks = tempListTasks;
    data.daysWithDoneTask = tempDaysWithDoneTask;
    onChangeIsCompleted(data);

  };

  renderListTask() {
    const { listTasks, selectedDay } = this.props;
    const element = listTasks.find((value) => value.day.toLocaleDateString() === selectedDay.toLocaleDateString());

    if(element) {
      if(element.task.length > 0) {
        return (
          <TodoList
            handleClickRemoveTask={this.handleClickRemoveTask}
            key={+this.idOfDate(element.day.toLocaleDateString())}
            day={element.day}
            content={element.task}
            onChangeIsCompleted={this.onChangeIsCompleted}
          />
        )
      }
    }
  }

  handleClickOpenTextEdit = () => {
    const { openTextEdit } = this.props;
    openTextEdit();
  };

  handleClickRemoveTask = (day:Date, id:number) => {

    const { listTasks, daysWithTask, daysWithDoneTask, removeTask } = this.props;
    const tempDaysWithTask = deepClone(daysWithTask);
    const tempListTasks = deepClone(listTasks);
    const tempDaysWithDoneTask =  deepClone(daysWithDoneTask);
    let data:{
      listTasks: listTask[],
      daysWithTask:[],
      daysWithDoneTask:[]
    } = {
      listTasks: [],
      daysWithTask: [],
      daysWithDoneTask: []
    };

    tempListTasks.map((value: any) => {
      if (value.day === day) {
        const element = value.task.find((value:any) => value.id === id);
        const index = value.task.indexOf(element);

        value.task.splice(index, 1);

        if (value.task.length === 0) {
          const arrayString = tempDaysWithTask.map((value:Date) => {return value.toLocaleDateString()})
          const index = arrayString.indexOf(day);

          tempDaysWithTask.splice(index, 1);

          const arrayString2 = tempDaysWithDoneTask.map((value:Date) => {return value.toLocaleDateString()})
          const index2 = arrayString2.indexOf(day);

          tempDaysWithDoneTask.splice(index2, 1);
        }
      }
    });

    data.listTasks = tempListTasks;
    data.daysWithTask = tempDaysWithTask;
    data.daysWithDoneTask = tempDaysWithDoneTask;
    removeTask(data);
  };

  handleClickAddTask = () => {
    const {addTask, content, selectedDay, daysWithTask, listTasks} = this.props;
    const tempDaysWithTask = deepClone(daysWithTask);
    const tempListTasks = deepClone(listTasks);
    let data:{
      daysWithTask: [],
      dayIsSelected: boolean,
      isAddingTask: boolean,
      listTasks:listTask[],
      content: string
    } ={
      daysWithTask: [],
      dayIsSelected: false,
      isAddingTask: false,
      listTasks:[],
      content:''
    };

    if (tempListTasks.length === 0) {
      tempListTasks.push({
        day: selectedDay,
        isCompleted: false,
        task: [{content:content, id: randomNumber(), isCompleted: false}]
      });
    } else {
      const element = tempListTasks.find((value:any) => (value.day === selectedDay));

      if (element) {
        if (element.task) {
          element.task.push({content:content, id: randomNumber(), isCompleted: false});
        }
      } else {
        tempListTasks.push({
          day: selectedDay,
          isCompleted: false,
          task: [{content:content, id: randomNumber(), isCompleted: false}]
        });
      }
    }

    let dayIsSelected = true;

    if(content.length === 0) {
      return null;
    }

    if (tempDaysWithTask.length === 0) {

      tempDaysWithTask.push(selectedDay);
      dayIsSelected = true;
    } else {
      const arrayString = tempDaysWithTask.map((value:Date)=> {
        return value.toLocaleDateString();
      });
      const index = arrayString.indexOf(selectedDay);

      if(index === -1) {
        dayIsSelected = true;
        tempDaysWithTask.push(selectedDay);
      }
    }

    data.daysWithTask = tempDaysWithTask;
    data.dayIsSelected = dayIsSelected;
    data.isAddingTask = false;
    data.listTasks  = tempListTasks;
    data.content = '';

    addTask(data);

  };

  public onChangeText = (event:any) => {
    const {onChangeText} = this.props;
    if (!event) {
      return null;
    }
    onChangeText(event);
  };


  renderButton () {
    const { dayIsSelected, isAddingTask } = this.props;

    if (isAddingTask) {
      return null;
    }

    if (!dayIsSelected) {
      return null;
    }
    return(
      <div className={'button'} onClick={this.handleClickOpenTextEdit}>
        <div className={'button__plus'} title={'Добавить задачу'}/>
        <p className={'button__title'}>Добавить задачу</p>
      </div>
    )
  }

  // getCompletedTask () {
  //   const { listTasks, daysWithDoneTask, selectedDay } = this.props;
  //   const tempListTasks = deepClone(listTasks);
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

  public render() {
    const { selectedDay, isAddingTask, listTasks, daysWithTask, daysWithDoneTask } = this.props;

    const modifiers = {
        daysWithTask: daysWithTask,
        selectedDay: selectedDay,
        daysWithDoneTask: daysWithDoneTask
      };

      const modifiersStyles = {
        daysWithTask: {
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

    return (
        <div className={'wrap'} >
          <Helmet>
            <style>{stylingCalendar()}</style>
          </Helmet>
            <DayPicker
              fixedWeeks
              localeUtils={MomentLocaleUtils}
              locale={'Ru'}
              className={'calendar'}
              onDayClick={this.handleDayClick}
              selectedDays={selectedDay}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              navbarElement={<NavBar />}
            />
          {this.renderListTask()}
          {this.renderButton()}
          <ModalWindow
            isAddingTask={isAddingTask}
            listTasks={listTasks}
            minRows={3}
            maxRows={10}
            rows={3}
            onChangeText={this.onChangeText}
            handleClickAddTask={this.handleClickAddTask}
          />
        </div>
    );
  }
}

function NavBar({
                  onPreviousClick,
                  onNextClick,
                  className,
                }:any) {
  const styleLeft:object = {
    position: 'absolute',
    top: '18px',
    left: '30px',
    fontSize: '15px',
    cursor:'pointer'
  };
  const styleRight:object = {
    position: 'absolute',
    top: '18px',
    right: '30px',
    fontSize: '15px',
    cursor:'pointer'
  };
  return (
    <div className={className}>
      <div style={styleLeft} onClick={() => onPreviousClick()}>
        <i className="fas fa-chevron-left"/>
      </div>
      <div style={styleRight} onClick={() => onNextClick()}>
        <i className="fas fa-chevron-right"/>
      </div>
    </div>
  );
}

const mapStateToProps = (state: any) => ({
  listTasks: state.app.listTasks,
  dayIsSelected: state.app.dayIsSelected,
  isAddingTask: state.app.isAddingTask,
  daysWithDoneTask: state.app.daysWithDoneTask,
  daysWithTask: state.app.daysWithTask,
  selectedDay: state.app.selectedDay,
  content: state.app.content,
  day: state.app.day
});

const mapDispatchToProps = (dispatch: any) => ({
  addTask: (data: object) => {dispatch(addTask(data))},
  selectDay: (data:object) => dispatch(selectDay(data)),
  openTextEdit: () => dispatch(openTextEdit()),
  onChangeText: (data: string) => dispatch(onChangeText(data)),
  onChangeIsCompleted: (data:object) => dispatch(onChangeIsCompleted(data)),
  removeTask: (data:object) => dispatch(removeTask(data)),
  initLoad: () => dispatch(initLoad()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
