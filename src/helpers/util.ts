
const cloneDeep = require('lodash.clonedeep');
export function deepClone(data: any) {
  return (cloneDeep(data));
}

export function randomNumber() {
  return Math.floor(Math.random()*10000)
}

export function stylingCalendar() {
  return `
          .DayPicker-Day {
            background-color: inherit;
            color: white;
            font-size: 14px;
            padding: 16px;
          }
          .DayPicker {
            display:flex;
            }
        `
}

export const getSelectionRange = () => {
  const selection = window.getSelection();
  if (selection) {
    if (selection.rangeCount === 0) return null;

    return selection.getRangeAt(0);
  }

};

export const getSelectionCoords = (selectionRange:any) => {
  //@ts-ignore
  const editorBounds = document.getElementById('editor-container').getBoundingClientRect();
  const rangeBounds = selectionRange.getBoundingClientRect();
  const rangeWidth = rangeBounds.right - rangeBounds.left;
  // 107px is width of inline toolbar
  const offsetLeft = (rangeBounds.left - editorBounds.left) + (rangeWidth / 2) - (107 / 2);
  // 42px is height of inline toolbar
  const offsetTop = rangeBounds.top - editorBounds.top - 42;

  return { offsetLeft, offsetTop };
};