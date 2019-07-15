import './index.scss';
import * as React from 'react';
import DayPicker from "react-day-picker";
import 'moment/locale/ru';
import 'react-day-picker/lib/style.css';
import {deepClone, randomNumber} from "../../helpers/util";
import MomentLocaleUtils from 'react-day-picker/moment'
import ModalWindow from "../ModalWindow";
import TodoList from '../TodoList'

interface IState {
  id: number,
  content: string,
  selectedDay: any,
  daysWithTask: Date[],
  listTask: {
    id: number,
    task: any,
    isCompleted:boolean
  } [],
  dayIsSelected: boolean,
  isAddingTask: boolean;
}
class App extends React.Component {

  public state: IState = {
    id: NaN,
    daysWithTask:[],
    listTask: [],
    selectedDay: null,
    content:'',
    dayIsSelected: false,
    isAddingTask: false
  };


  public idOfDate = (day: Date) => {
    return day.toLocaleDateString().replace(/\./g, '');
  };

 transferListTask = (id: number, content: any) => {
    const { listTask } = this.state;
    const tempListTask = deepClone(listTask);

    if (tempListTask.length === 0) {
      tempListTask.push({
        id,
        task: [{content:content, id: randomNumber(), isCompleted: false}]
      });
    } else {
      const element = tempListTask.find((value:any) => (value.id === id));
        if (element) {
          if (element.task) {
            element.task.push({content:content, id: randomNumber(), isCompleted: false});
          }
        } else {
          tempListTask.push({
            id,
            task: [{content:content, id: randomNumber(), isCompleted: false}]
          });
        }

    }
    this.setState({
      listTask: tempListTask
    });
   console.log(tempListTask);
  };

 removeTask= (id: number) => {
   const { listTask } = this.state;
   const tempListTask = deepClone(listTask);

   const element = tempListTask.find((value:any) => (value.id === id));
   if (element) {
     if (element.task) {
       element.task = []
     }
   }
   this.setState({
     listTask: tempListTask,
     selectedDay: null
   });
   console.log(tempListTask);
 };

  public handleDayClick = (day: Date) => {
    const {dayIsSelected, selectedDay} = this.state;
    let tempSelectedDay = deepClone(selectedDay);
    let tempDayIsSelected = dayIsSelected;

    if (selectedDay){
      if(tempSelectedDay.toLocaleDateString() === day.toLocaleDateString()) {
        console.log(tempSelectedDay);
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
      id: +this.idOfDate(day),
      dayIsSelected: tempDayIsSelected
    })
  }
  ;

  onChangeIsCompleted = (isCompleted:boolean, id:number) => {
    const { listTask } = this.state;
    const tempList = deepClone(listTask);
    tempList.map((value: any) => {
      if (value.id === id) {
        value.task[0].isCompleted = isCompleted;
      }
    });

    this.setState({
      listTask: tempList
    })
  };

  renderListTask() {
    const { listTask, id } = this.state;
    const element = listTask.find((value) => value.id === id);

    if(element) {
      if(element.task.length >0) {
        return (
          <TodoList
            handleClickRemoveTask={this.handleClickRemoveTask}
            key={element.id}
            id={element.id}
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

  handleClickRemoveTask = () => {
    const { id, daysWithTask, selectedDay} = this.state;
    const tempDaysWithTask = deepClone(daysWithTask);
    let dayIsSelected = true;

    const arrayString = tempDaysWithTask.map((value:Date)=> {
      return value.toLocaleDateString();
    });
    const index = arrayString.indexOf(selectedDay.toLocaleDateString());
    console.log(tempDaysWithTask);
    if(index !== -1) {
      dayIsSelected= false;
      tempDaysWithTask.splice(index, 1);
    }

    this.setState({
      daysWithTask: tempDaysWithTask,
      dayIsSelected: dayIsSelected,
      isAddingTask: false
    });
    this.removeTask(id);

  };

  handleClickAddTask = () => {
    const {content, id, daysWithTask, selectedDay} = this.state;
    const tempDaysWithTask = deepClone(daysWithTask);
    let dayIsSelected = true;

    if (tempDaysWithTask.length === 0) {
      tempDaysWithTask.push(selectedDay);
      dayIsSelected = true;
    } else {
      const arrayString = tempDaysWithTask.map((value:Date)=> {
        return value.toLocaleDateString();
      });
      const index = arrayString.indexOf(selectedDay.toLocaleDateString());

      if(index === -1) {
        dayIsSelected= true;
        tempDaysWithTask.push(selectedDay);
      }
    }

    this.setState({
      daysWithTask: tempDaysWithTask,
      dayIsSelected: dayIsSelected,
      isAddingTask: false
    });

    this.transferListTask(id,content);
  };

  public onChangeText = (event:any) => {
    if (!event) {
      return;
    }

    this.setState({content: event});
  };


  renderButton () {
    const { dayIsSelected } = this.state;
    if(!dayIsSelected) {
      return null;
    }
    return(
      <div className={'button'} onClick={this.handleClickOpenTextEdit}>
        <div className={'button__plus'} title={'Добавить задачу'}/>
        <p className={'button__title'}>Добавить задачу</p>
      </div>
    )
  }

  public render() {
      const { selectedDay, listTask, isAddingTask, daysWithTask} =  this.state;
      const modifiers = {
        daysWithTask: daysWithTask
      };
      const modifiersStyles = {
        daysWithTask: {
          color: '#beb7bd',
          backgroundColor: '#ff012e',

        },
      };

    return (
        <div className={'wrap'} >
            <DayPicker
              fixedWeeks
              localeUtils={MomentLocaleUtils}
              locale={'Ru'}
              className={'calendar'}
              onDayClick={this.handleDayClick}
              selectedDays={selectedDay}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
            />

          <ModalWindow
            isAddingTask={isAddingTask}
            listTask={listTask}
            minRows={1}
            maxRows={10}
            rows={500}
            onChangeText={this.onChangeText}
            handleClickAddTask={this.handleClickAddTask}

          />
          {this.renderButton()}
          {this.renderListTask()}
        </div>
    );
  }
}

export default App;
