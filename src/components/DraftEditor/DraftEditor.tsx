import './index.scss';
import 'draft-js/dist/Draft.css';
import { Editor, RichUtils } from "draft-js";
import * as React from 'react';
import {
  updateEditorState
} from "../../actions/app";
import {connect} from "react-redux";


interface IProps {
  editorState: any,
  updateEditorState: (arg: object) => void,
}

 class DraftEditor extends React.Component<IProps> {
  focus:any = () => {};
  onChange:any = () => {};
  handleKeyCommand:any = () => {};
  onTab:any = () => {};
  toggleBlockType:any = () => {};
  toggleInlineStyle:any = () => {};
  editor:any = React.createRef<HTMLDivElement>();

  constructor(props:any) {
    super(props);
    this.focus = () => this.editor.current.focus();
    this.editor = React.createRef();

    this.onChange = (editorState:any) => {
      const {updateEditorState} = this.props;

      updateEditorState(editorState)
    };

    this.handleKeyCommand = (command:boolean) => this._handleKeyCommand(command);
    this.onTab = (e:any) => this._onTab(e);
    this.toggleBlockType = (type:any) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style:any) => this._toggleInlineStyle(style);
  }

  _handleKeyCommand(command:any) {
    const { editorState } = this.props;
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _onTab(e:any) {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.props.editorState, maxDepth));
  }

  _toggleBlockType(blockType:any) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.props.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle:any) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.props.editorState,
        inlineStyle
      )
    );
  }

  render() {
    const {editorState} = this.props;
    let className = 'RichEditor-editor';
    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }
    return (
      <div className="RichEditor-root">
        <BlockStyleControls
          editorState={editorState}
          onToggle={this.toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
        />
        <div className={className} onClick={this.focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange.bind(this)}
            onTab={this.onTab}
            placeholder="Введите текст..."
            ref={this.editor}
            spellCheck={true}
          />
        </div>
      </div>
    );
  }
}

const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block:any) {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return '';
  }
}

const BLOCK_TYPES = [
  {label: 'H1', style: 'header-one', icon: 'H1'},
  {label: 'H2', style: 'header-two', icon: 'H2'},
  {label: 'H3', style: 'header-three', icon: 'H3'},
  {label: 'H4', style: 'header-four', icon: 'H4'},
  {label: 'H5', style: 'header-five', icon: 'H5'},
  {label: 'H6', style: 'header-six', icon: 'H6'},
  {label: 'UL', style: 'unordered-list-item', icon: 'fas fa-list-ul'},
  {label: 'OL', style: 'ordered-list-item', icon: 'fas fa-list-ol'},
];

const BlockStyleControls = (props:any) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) =>{
          const { label, style, icon } = type;
          return(
        <StyleButton
        key={label}
        active={style === blockType}
        label={label}
        onToggle={props.onToggle}
        style={style}
        icon={icon}
        />
        )
      }
      )}
    </div>
  );
};

interface StyleBtn {
  onToggle: (arg:any) => void;
  style: string,
  active: boolean,
  label: string,
  icon: string

}

class StyleButton extends React.Component<StyleBtn> {
  onToggle:any = () => {};
  constructor(props:any) {
    super(props);
    this.onToggle = (e:any) => {
      e.preventDefault();

      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = 'RichEditor-styleButton';

    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }
    return (
      <span className={className} onMouseDown={this.onToggle}>
        <i className={this.props.icon}>{this.props.icon.substr(0, 1) === 'H' ? this.props.icon : null}</i>
            </span>
    );
  }
}

const INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD', icon: 'fas fa-bold'},
  {label: 'Italic', style: 'ITALIC', icon: 'fas fa-italic'},
  {label: 'Underline', style: 'UNDERLINE', icon: 'fas fa-underline'},
];

const InlineStyleControls = (props:any) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls2">
      {INLINE_STYLES.map(type =>

        <StyleButton
          key={type.style}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
          icon={type.icon}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  editorState: state.app.editorState
});

const mapDispatchToProps = (dispatch: any) => ({
  updateEditorState: (data:object) => {dispatch(updateEditorState(data))}
});

export default connect(mapStateToProps, mapDispatchToProps)(DraftEditor);