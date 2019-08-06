import * as React from 'react';
import './index.scss';
import MomentLocaleUtils from "react-day-picker/moment";
import DayPicker from "react-day-picker";
import 'react-day-picker/lib/style.css';
import 'moment/locale/ru';
import 'react-day-picker/lib/style.css';
import Helmet from "react-helmet";
import {stylingCalendar} from "../../helpers/util";
import { INavBar } from "../../interfaces";

interface IProps {
  selectedDay: Date,
  daysWithTasks: Date[],
  daysWithDoneTask: Date[],
  // listTasks: ICalendarConfig[],
  onDayClick: (arg: Date) => void,
  onContextMenu: (arg: Date, arg2: object, event: React.MouseEvent<HTMLDivElement>) => void
}

export default class Calendar extends React.Component<IProps> {

  render() {
    const { selectedDay, daysWithTasks, daysWithDoneTask, onDayClick, onContextMenu } =this.props;

    const modifiers = {
      daysWithTasks: daysWithTasks,
      selectedDay: selectedDay,
      daysWithDoneTask: daysWithDoneTask,
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

    return (
      <React.Fragment>
        <Helmet>
          <style>{stylingCalendar()}</style>
        </Helmet>
        <DayPicker
          fixedWeeks
          localeUtils={MomentLocaleUtils}
          locale={'Ru'}
          className={'calendar'}
          onDayClick={onDayClick}
          selectedDays={selectedDay}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          navbarElement={<NavBar onNextClick={() => {}} className={''} onPreviousClick={() => {}}/>}
          onContextMenu={onContextMenu}
        />
      </React.Fragment>

    )
  }
}
  function NavBar({onPreviousClick, onNextClick, className,}: INavBar) {

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
