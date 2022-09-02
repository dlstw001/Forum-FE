import 'react-image-lightbox/style.css';

import '@draft-js-plugins/mention/lib/plugin.css';
import 'draft-js/dist/Draft.css';
import { ContentState, convertToRaw, EditorState, getDefaultKeyBinding, Modifier, RichUtils } from 'draft-js';
import { draftToMarkdown } from 'markdown-draft-js';
import { generate } from 'shortid';
import { imageUploader } from 'utils';
// import { stateFromHTML } from 'draft-js-import-html';
import { debounce } from 'lodash-es';
import { emojiMap } from 'smile2emoji';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import createMentionPlugin, { defaultSuggestionsFilter } from '@draft-js-plugins/mention';
import cx from 'classnames';
import DraftEditor from '@draft-js-plugins/editor';
import Entry from './components/Entry';
import ImageUpload from './components/ImageUpload';
import InputError from '../InputError';
import Linkify from './components/Linkify';
import Preview from './components/Preview';
import React from 'react';
import showdown, { Converter } from 'showdown';
import showdownEmoji from 'showdown-emoji';
import Toolbar from './components/Toolbar';
import transform from 'components/Topics/transform';
import useToggle from 'hooks/useToggle';

function insertCharacter(characterToInsert, editorState) {
  const currentContent = editorState.getCurrentContent(),
    currentSelection = editorState.getSelection();
  const newContent = Modifier.replaceText(currentContent, currentSelection, characterToInsert);
  const newEditorState = EditorState.push(editorState, newContent, 'insert-characters');
  return EditorState.forceSelection(newEditorState, newContent.getSelectionAfter());
}

const IMAGE =
  /!\[(?<title>[^|\]]+)?(?:\|(?<width>\d+)x(?<height>\d+)?,?\s?(?<percentage>\d+%)?)?\]\((?<url>((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\w]*))?))\)/gi;

const mentionRegExp =
  '[' +
  '\\w-.' +
  // Latin-1 Supplement (letters only) - https://en.wikipedia.org/wiki/List_of_Unicode_characters#Latin-1_Supplement
  '\u00C0-\u00D6' +
  '\u00D8-\u00F6' +
  '\u00F8-\u00FF' +
  // Latin Extended-A (without deprecated character) - https://en.wikipedia.org/wiki/List_of_Unicode_characters#Latin_Extended-A
  '\u0100-\u0148' +
  '\u014A-\u017F' +
  // Cyrillic symbols: \u0410-\u044F - https://en.wikipedia.org/wiki/Cyrillic_script_in_Unicode
  '\u0410-\u044F' +
  // hiragana (japanese): \u3040-\u309F - https://gist.github.com/ryanmcgrath/982242#file-japaneseregex-js
  '\u3040-\u309F' +
  // katakana (japanese): \u30A0-\u30FF - https://gist.github.com/ryanmcgrath/982242#file-japaneseregex-js
  '\u30A0-\u30FF' +
  // For an advanced explaination about Hangul see https://github.com/draft-js-plugins/draft-js-plugins/pull/480#issuecomment-254055437
  // Hangul Jamo (korean): \u3130-\u318F - https://en.wikipedia.org/wiki/Korean_language_and_computers#Hangul_in_Unicode
  // Hangul Syllables (korean): \uAC00-\uD7A3 - https://en.wikipedia.org/wiki/Korean_language_and_computers#Hangul_in_Unicode
  '\u3130-\u318F' +
  '\uAC00-\uD7A3' +
  // common chinese symbols: \u4e00-\u9eff - http://stackoverflow.com/a/1366113/837709
  // extended to \u9fa5 https://github.com/draft-js-plugins/draft-js-plugins/issues/1888
  '\u4e00-\u9fa5' +
  // Arabic https://en.wikipedia.org/wiki/Arabic_(Unicode_block)
  '\u0600-\u06ff' +
  // Vietnamese http://vietunicode.sourceforge.net/charset/
  '\u00C0-\u1EF9' +
  ']';

showdown.extension('markdown', () => {
  return {
    type: 'lang',
    regex: new RegExp('<(p|div|h\\d|table|code)', 'gi'),
    replace: `<$1 markdown`,
  };
});

showdown.extension('img-size', () => {
  return {
    type: 'lang',
    regex: new RegExp(IMAGE, 'gi'),
    replace: (content, text = '', _width, _height, _percentage, url) => {
      const percentage = parseInt(_percentage) / 100;
      const width = Math.round(_width * percentage) || _width;
      const height = Math.round(_height * percentage) || _height;

      return `![${text}](${url} ${width && height ? `=${width}x${height}` : ``})`;
    },
  };
});

showdown.extension('table-clean', () => {
  return {
    type: 'lang',
    regex: new RegExp('<table([^>]+)?>[\\s\\S]+?</table>', 'gim'),
    replace: (content) => {
      return content.replace(/\n/gim, '');
    },
  };
});

showdown.extension('mentions', () => {
  return {
    type: 'lang',
    regex: new RegExp('(^|\\s)(\\\\)?(@(([a-z\\d]+(?:[a-z\\d.-_-]+?[a-z\\d]+)*)))', 'gi'),
    replace: (user) => ` <a class="mention">${user.trim()}</a>`,
  };
});

showdown.extension('links', () => {
  return {
    type: 'lang',

    regex: new RegExp("\\[.+](((https?://)[-a-zA-Z0-9:@;?&=/%+.!'(,$_{}^~[]`#|]+))", 'gim'),
    replace: `<a target="_blank" href="$1">$1</a>`,
  };
});

showdown.extension('emojis', function () {
  return [
    {
      type: 'output',
      filter: function (text) {
        text = text.replace(/:slight_smile:/g, ':slightly_smiling_face:');
        text = text.replace(/:+1:/g, ':thumbsup:');
        text = text.replace(/:\)/g, ':smile:');
        text = text.replace(/:-\)/g, ':smile:');
        return text;
      },
    },
  ];
});

showdown.extension('smile2emoji', function () {
  return [
    {
      type: 'output',
      filter: function (text) {
        const words = text && text.split(/\s+/);
        let newText = text;

        if (words) {
          words.forEach((word) => {
            let w = word;
            if (word in emojiMap) {
              w = emojiMap[word];
              newText = newText.replace(word, w);
            }
          });
        }

        return newText;
      },
    },
  ];
});

showdown.extension('bbcode', function () {
  return [
    {
      type: 'lang',
      filter: function (text) {
        text = text.replace(/\[EMAIL="(.+)"\](.+)\[\/EMAIL\]/gim, `<a href="mailto:$1">$2</a>`);
        text = text.replace(/\[IMG\](.+?)\[\/IMG\]/gi, `<img src="$1"/>`);
        return text;
      },
    },
  ];
});

showdown.extension('clean-up', function () {
  return [
    {
      type: 'output',
      filter: function (text) {
        text = text.replace(/\s+ref=/gim, 'reference=');
        text = text.replace(/!\[\](?!=\(.+\))/gi, '![image]');
        text = text.replace(/!\[(?<title>[^|\]]+)?\]\((?<url>upload:\/\/.+)\)/gi, '<img title="$1" src="$2"/>'); //image inside links
        text = text.replace(/upload:\/\//gi, process.env.REACT_APP_IMAGE_HOST);
        text = text.replace(/<\/?p[^>]*><\/?tr[^>]*>|<\/?tr[^>]*><\/?p[^>]*>/g, '');
        text = text.replace(/<img.+;base64,.+"\/>/g, '');

        return text;
      },
    },
  ];
});

const converter = new Converter({
  tables: true,
  strikethrough: true,
  // simpleLineBreaks: true,
  simplifiedAutoLink: true,
  openLinksInNewWindow: true,
  literalMidWordUnderscores: true,
  ghCodeBlocks: true,
  tasklists: true,
  extensions: [
    'img-size',
    'table-clean',
    'markdown',
    'bbcode',
    'clean-up',
    'links',
    'mentions',
    'emojis',
    'smile2emoji',
    showdownEmoji('https://emoji.discourse-cdn.com/apple'),
  ],
});

const Editor = ({
  methods,
  editorStore,
  rules,
  name,
  editorState,
  onChange,
  className,
  options = {},
  state = {},
  ...rest
}) => {
  const ref = React.useRef();
  const { placeholder, onGetSuggestions, onUpload, onToggleWhisper, postId: post_id } = options;
  const [data, setData] = React.useState();
  const [selectedText, setSelectedText] = React.useState();
  const { register, setValue, formState } = methods;
  const [open, setOpen] = React.useState(true);
  const [suggestions, setSuggestions] = React.useState([]);
  const { toggle, handleToggle } = useToggle({
    isPreview: editorStore.isPreview,
    isDirty: false,
    uploadModal: false,
    linkModal: false,
    isLoading: false,
  });

  const keyBindings = (e) => {
    let newEditorState;
    switch (e.keyCode) {
      case 9:
        newEditorState = RichUtils.onTab(e, editorState, 4 /* maxDepth */);
        if (newEditorState !== editorState) {
          onChange(newEditorState);
        }
        return;
      case 38:
      case 40:
        return undefined;
      default:
        return getDefaultKeyBinding(e);
    }
  };

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const { MentionSuggestions, plugins } = React.useMemo(() => {
    const mentionPlugin = createMentionPlugin({
      mentionPrefix: '@',
      entityMutability: 'IMMUTABLE',
      mentionRegExp,
    });
    const { MentionSuggestions } = mentionPlugin;
    const plugins = [mentionPlugin];
    return { plugins, MentionSuggestions };
  }, []);

  React.useEffect(() => {
    ref.current.editor.editorContainer.closest('.wysiwyg-editor').setAttribute('data-cy', rest['data-cy']);
  }, [rest]);

  React.useEffect(() => {
    const process = async () => {
      const data = await transform(getStateToContent(editorState));
      setData(data);
    };
    if (toggle.isPreview) {
      process();
    }
  }, [editorState, toggle.isPreview]);

  const onOpenChange = React.useCallback((_open) => {
    setOpen(_open);
  }, []);

  const debounceRef = React.useRef(
    debounce((value) => {
      onGetSuggestions &&
        onGetSuggestions({ keyword: value, post_id }).then((res) => {
          setSuggestions(
            defaultSuggestionsFilter(
              value,
              res.map((i) => ({ ...i, name: i.displayName }))
            )
          );
        });
    }, 500)
  );

  const onSearchChange = React.useCallback(
    ({ value }) => {
      if (value.length > 1) {
        onGetSuggestions && debounceRef.current(value);
      }
    },
    [onGetSuggestions]
  );

  const handleEvent = (e) => {
    if (e.type === 'mouseup') {
      var selObj = window.getSelection();
      if (selObj !== null) {
        var selectedText = selObj.toString();
        setSelectedText(selectedText);
      }
    }
  };

  const handleInsertImage = (images) => {
    const chars = images.reduce((acc, { url, name, dimensions: { width, height } }) => {
      const dimensions = `${width}x${height}`;
      return acc + `![${name}${dimensions && `|${dimensions}`}](${url}) \n`;
    }, '');
    const newState = insertCharacter(chars, editorState);
    onChange(newState);
    const value = getStateToContent(newState);
    setValue(name, value, { shouldValidate: formState.isSubmitted });

    handleToggle({ uploadModal: false });
  };

  const handleLink = () => {
    handleToggle({ linkModal: true });
  };
  const handleInsertLink = ({ text, url }) => {
    onChange(insertCharacter(`[${text}](${url})`, editorState));
  };

  const handlePastedText = (text, html, editorState) => {
    // const blockMap = stateFromHTML(html || text).blockMap;
    const blockMap = ContentState.createFromText(html || text).blockMap;

    const newState = Modifier.replaceWithFragment(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      blockMap
    );
    const newEditorState = EditorState.push(editorState, newState, 'insert-fragment');
    onChange(newEditorState);

    return true;
  };

  const handlePastedFiles = async (files) => {
    handleToggle({ isLoading: true });
    const createForm = async (acceptedFiles) => {
      const newFile = Object.keys(files).map((key) => {
        let form = new FormData();
        Object.defineProperty(acceptedFiles[key], 'id', {
          value: generate(),
        });

        form.append('image', files[key]);
        return { file: files[key], form };
      });
      return newFile;
    };
    const response = await imageUploader(await createForm(files), onUpload);
    handleInsertImage(response);
    handleToggle({ isLoading: false });
  };

  const content = React.useMemo(() => getStateToContent(editorState), [editorState]);

  const handleImageResize = React.useCallback(
    (options) => {
      const { attributes } = options.el.target.closest('.resizer').querySelector('img');
      const idx = parseInt(attributes.elementid.value);
      let index = 0;

      const newData = content.replaceAll(IMAGE, (string) => {
        let output = string;

        if (idx === index) {
          const {
            height = attributes.height.value,
            width = attributes.width.value,
            title = '',
            url,
          } = IMAGE.exec(string).groups;
          output = `![${title}|${width}x${height}, ${options.size}%](${url})`;
        }
        index++;
        return output;
      });

      onChange(getContentToState(newData));
    },
    [content, onChange]
  );

  React.useEffect(() => {
    editorStore.isPreview = toggle.isPreview;
    localStorage.setItem('editor', toggle.isPreview);
  }, [editorStore, toggle.isPreview]);
  return (
    <>
      <div className={cx('wysiwyg-editor', className)}>
        <div className="editor">
          <Toolbar
            editorState={editorState}
            onToggle={onChange}
            isPreview={false}
            ToggleButton={
              <div className="flex ml-auto">
                <button
                  type="button"
                  className={cx('px-2 btn')}
                  onClick={() => handleToggle({ isPreview: !toggle.isPreview })}
                >
                  {toggle.isPreview ? (
                    <span className="material-icons-outlined">keyboard_double_arrow_left</span>
                  ) : (
                    <span className="material-icons-outlined">keyboard_double_arrow_right</span>
                  )}
                </button>
              </div>
            }
          >
            <button type="button" onClick={() => handleLink({ linkModal: true })}>
              <i className="material-icons">insert_link</i>
            </button>
            {onUpload && (
              <button type="button" onClick={() => handleToggle({ uploadModal: true })}>
                <i className="material-icons">insert_photo</i>
              </button>
            )}
            {onToggleWhisper && (
              <button type="button" onClick={onToggleWhisper} className={cx({ 'bg-gray-300': state.whisper })}>
                <i className="material-icons">visibility_off</i>
              </button>
            )}
          </Toolbar>

          <div className="flex overflow-auto">
            <div className={cx('editor-main', { 'is-loading': toggle.isLoading })} onMouseUp={handleEvent}>
              <DraftEditor
                plugins={plugins}
                editorState={editorState}
                onChange={onChange}
                handlePastedText={handlePastedText}
                handlePastedFiles={handlePastedFiles}
                handleKeyCommand={handleKeyCommand}
                keyBindingFn={keyBindings}
                placeholder={placeholder}
                ref={(element) => {
                  ref.current = element;
                }}
                spellCheck
              />
            </div>
            <MentionSuggestions
              open={open}
              onOpenChange={onOpenChange}
              onSearchChange={onSearchChange}
              suggestions={suggestions}
              entryComponent={Entry}
            />
            <div className={cx('html-preview', { hidden: !toggle.isPreview })}>
              <Preview isEditor data={data} onImageResize={handleImageResize} />
            </div>
          </div>
        </div>

        {toggle.uploadModal && onUpload && (
          <ImageUpload
            onUpload={onUpload}
            onSubmit={handleInsertImage}
            onToggle={() => handleToggle({ uploadModal: false })}
          />
        )}
        {toggle.linkModal && (
          <Linkify
            selectedText={selectedText}
            onSubmit={handleInsertLink}
            onToggle={() => {
              setSelectedText(null);
              handleToggle({ linkModal: false });
            }}
          />
        )}
      </div>
      <input type="hidden" name={name} ref={register(rules)} />
      {formState.isSubmitted && <InputError name={name} methods={methods} />}
    </>
  );
};

const extendedStyleItems = {
  UNDERLINE: {
    open: function open() {
      return '<u>';
    },

    close: function close() {
      return '</u>';
    },
  },
};

const getStateToContent = (editorState) => {
  return draftToMarkdown(convertToRaw(editorState.getCurrentContent()), {
    escapeMarkdownCharacters: false,
    preserveNewlines: true,
    styleItems: extendedStyleItems,
    remarkableOptions: {
      html: true,
    },
  });
};

const getContentToState = (content) => {
  return EditorState.createWithContent(ContentState.createFromText(content));
};

const getHtml = (data) => converter.makeHtml(data);

export default inject(({ editorStore }) => ({
  editorStore,
}))(observer(Editor));

export { Preview, converter, getStateToContent, getContentToState, getHtml };
