import './index.scss';
import * as React from 'react';
import DayPicker from "react-day-picker";
import 'moment/locale/ru';
import 'react-day-picker/lib/style.css';
import {deepClone, randomNumber, stylingCalendar} from "../../helpers/util";
import MomentLocaleUtils from 'react-day-picker/moment';
import ModalWindow from "../ModalWindow";
import TodoList from '../TodoList';
import Helmet from "react-helmet";

interface IState {
  day: any,
  content: string,
  selectedDay: any,
  daysWithTask: Date[],
  completedTask: number [],
  listTask: {
    day: Date,
    task: any,
    isCompleted:boolean
  } [],
  dayIsSelected: boolean,
  isAddingTask: boolean;
}
class App extends React.Component {

  public state: IState = {
    day: null,
    daysWithTask:[],
    listTask: [],
    selectedDay: null,
    content:'',
    dayIsSelected: false,
    isAddingTask: false,
    completedTask: []
  };


  public idOfDate = (day: Date) => {
    return day.toLocaleDateString().replace(/\./g, '');
  };

 transferListTask = (day: Date, content: any) => {
    const { listTask } = this.state;
    const tempListTask = deepClone(listTask);

    if (tempListTask.length === 0) {
      tempListTask.push({
        day,
        task: [{content:content, id: randomNumber(), isCompleted: false}]
      });
    } else {
      const element = tempListTask.find((value:any) => (value.day.toLocaleDateString() === day.toLocaleDateString()));

        if (element) {
          if (element.task) {
            element.task.push({content:content, id: randomNumber(), isCompleted: false});
          }
        } else {
          tempListTask.push({
            day,
            task: [{content:content, id: randomNumber(), isCompleted: false}]
          });
        }
    }

    this.setState({
      listTask: tempListTask,
      content: ''
    });
  };

  public handleDayClick = (day: Date) => {
    const {dayIsSelected, selectedDay} = this.state;
    let tempSelectedDay = deepClone(selectedDay);
    let tempDayIsSelected = dayIsSelected;


    if (selectedDay){
      if(tempSelectedDay.toLocaleDateString() === day.toLocaleDateString()) {
        tempSelectedDay = null;
        tempDayIsSelected = false;
      } else{
        tempSelectedDay = day;
        tempDayIsSelected = true;
      }
    } else{
      tempSelectedDay = day;
      tempDayIsSelected = true;
    }


    this.setState({
      selectedDay:tempSelectedDay,
      day: day,
      dayIsSelected: tempDayIsSelected
    })
  }
  ;

  onChangeIsCompleted = (isCompleted:boolean, day:Date, id:number) => {
    const { listTask, completedTask } = this.state;
    const tempList = deepClone(listTask);
   tempList.map((value: any) => {
      if (value.day.toLocaleDateString() === day.toLocaleDateString()) {
        const element = value.task.find((value:any) => value.id === id);
        if (element.isCompleted) {
          element.isCompleted = false;
          return;
        }
        element.isCompleted = true;
        completedTask.push(value.id);
      }
    });

    this.setState({
      listTask: tempList
    })
  };

  renderListTask() {
    const { listTask, day } = this.state;
    const element = listTask.find((value) => value.day.toLocaleDateString() === day.toLocaleDateString());
    if(element) {
      if(element.task.length > 0) {
        return (
          <TodoList
            handleClickRemoveTask={this.handleClickRemoveTask}
            key={+this.idOfDate(element.day)}
            day={element.day}
            content={element.task}
            onChangeIsCompleted={this.onChangeIsCompleted}
          />
        )
      }
    }
  }

  handleClickOpenTextEdit = () => {
    const { isAddingTask } = this.state;
    let click = true;

    if(isAddingTask) {
      click = false;
    }
    this.setState({
      isAddingTask: click
    })
  };

  handleClickRemoveTask = (day:Date, id:number) => {

    const { listTask, daysWithTask } = this.state;
    const tempDaysWithTask = deepClone(daysWithTask);
    const tempList = deepClone(listTask);

    tempList.map((value: any) => {
      if (value.day.toLocaleDateString() === day.toLocaleDateString()) {
        const element = value.task.find((value:any) => value.id === id);
        const index = value.task.indexOf(element);

        value.task.splice(index, 1);

        if (value.task.length === 0) {
          const arrayString = tempDaysWithTask.map((value:Date) => {return value.toLocaleDateString()})
          const index = arrayString.indexOf(day.toLocaleDateString());

          tempDaysWithTask.splice(index, 1);
        }
      }
    });



    this.setState({
      listTask: tempList,
      daysWithTask: tempDaysWithTask
    });
  };

  handleClickAddTask = () => {
    console.log(this.state);
    const {content, day, daysWithTask, selectedDay} = this.state;
    const tempDaysWithTask = deepClone(daysWithTask);
    let dayIsSelected = true;

    if(content.length ===0) {
      return null;
    }

    if (tempDaysWithTask.length === 0) {

      tempDaysWithTask.push(selectedDay);
      dayIsSelected = true;
    } else {
      const arrayString = tempDaysWithTask.map((value:Date)=> {
        return value.toLocaleDateString();
      });
      const index = arrayString.indexOf(selectedDay.toLocaleDateString());

      if(index === -1) {
        dayIsSelected = true;
        tempDaysWithTask.push(selectedDay);
      }
    }

    this.setState({
      daysWithTask: tempDaysWithTask,
      dayIsSelected: dayIsSelected,
      isAddingTask: false
    });

    this.transferListTask(day,content);
  };

  public onChangeText = (event:any) => {
    if (!event) {
      return null;
    }
    this.setState({content: event});
  };


  renderButton () {
    const { dayIsSelected, isAddingTask } = this.state;
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

  getCompletedTask () {
    const { listTask, completedTask, selectedDay } = this.state;
    const tempListTask = deepClone(listTask);
    const element = tempListTask.find((value: any) => (value.day.toLocaleDateString() === selectedDay.toLocaleDateString())
    );
    if (element) {
      const allTask = element.task.length;
      const doneTask = completedTask.length;

      return Math.trunc((doneTask / allTask) * 100)
    } else {

    }

  }

  public render() {
      const { selectedDay, listTask, isAddingTask, daysWithTask} =  this.state;
    const modifiers = {
        daysWithTask: daysWithTask,
        selectedDay: selectedDay
      };

      const modifiersStyles = {
        daysWithTask: {
          boxShadow: 'none',
          background: `linear-gradient(0deg, rgba(63,94,251,1) ${this.getCompletedTask()}%, rgba(252,70,211,0.5) ${this.getCompletedTask()}%)`
        },
        selectedDay: {
          boxShadow: 'inset 0px 36px 4px 17px white',
          backgroundColor: 'inherit',
          color: '#ae88ea',
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
            listTask={listTask}
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

export default App;


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