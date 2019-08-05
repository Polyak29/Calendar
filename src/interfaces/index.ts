import {EditorState} from "draft-js";
import ICalendarConfig from "../models/calendarConfig/ICalendarConfig";

export interface INavBar {
  onPreviousClick: () => void,
  onNextClick: () => void,
  className: string
}

