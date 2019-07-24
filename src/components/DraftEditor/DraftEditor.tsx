import './index.scss';
import 'draft-js/dist/Draft.css';
import { Editor, RichUtils } from "draft-js";
import * as React from 'react';
import {
  updateEditorState,
  onChangeText
} from "../../actions/app";
import {connect} from "react-redux";


interface IProps {
  editorState: any,
  updateEditorState: (arg: any) => void,
  onChangeText: (arg: string) => void
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

      const {updateEditorState, onChangeText} = this.props;

      onChangeText(editorState.getCurrentContent().getPlainText());
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
  {label: 'H1', style: 'header-one'},
  {label: 'H2', style: 'header-two'},
  {label: 'H3', style: 'header-three'},
  {label: 'H4', style: 'header-four'},
  {label: 'H5', style: 'header-five'},
  {label: 'H6', style: 'header-six'},
  {label: 'Blockquote', style: 'blockquote'},
  {label: 'UL', style: 'unordered-list-item'},
  {label: 'OL', style: 'ordered-list-item'},
  {label: 'Code Block', style: 'code-block'},
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
          const { label, style} = type;
          return(
        <StyleButton
        key={label}
        active={style === blockType}
        label={label}
        onToggle={props.onToggle}
        style={style}
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
  label:string,

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
              {this.props.label}
            </span>
    );
  }
}

const INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'},
  {label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = (props:any) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls2">
      {INLINE_STYLES.map(type =>

        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  editorState: state.app.editorState
});

const mapDispatchToProps = (dispatch: any) => ({
  updateEditorState: (data:object) => {dispatch(updateEditorState(data))},
  onChangeText: (data: string) => dispatch(onChangeText(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DraftEditor);