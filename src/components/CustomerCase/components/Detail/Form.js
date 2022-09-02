import { Converter } from 'showdown';
import { EditorState } from 'draft-js';
import { inject, observer } from 'mobx-react';
import { isEmpty } from 'lodash';
import { useForm } from 'react-hook-form';
import Editor, { getContentToState, getStateToContent } from 'components/common/Form/Editor';
import React from 'react';

const Form = ({ mode, onSubmit, placeholder, refProp, customerCaseStore, isLoading }) => {
  const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty());

  const methods = useForm({
    defaultValues: {
      raw: '',
    },
  });
  const {
    reset,
    watch,
    handleSubmit,
    setValue,
    formState: { isSubmitted },
  } = methods;
  const { raw } = watch();

  const converter = new Converter({
    tables: true,
    strikethrough: true,
    simpleLineBreaks: true,
  });
  const [content, setContent] = React.useState(null);

  const onSave = async (data) => {
    await onSubmit({ content: converter.makeHtml(data.raw) }, mode);

    setContent(getContentToState(''));
  };

  const handleUpload = async (file) => {
    let response;
    const formData = new FormData();

    formData.append('image', file);
    response = await customerCaseStore.uploadMedia(formData);

    return { url: response?.source_url };
  };

  const onCancel = () => {
    reset({ raw: '' });
    setContent(getContentToState(''));
  };

  const handleChange = React.useCallback(
    (e) => {
      setEditorState(e);
      const value = getStateToContent(e);
      setValue('raw', value, { shouldValidate: isSubmitted });
    },
    [isSubmitted, setValue]
  );

  return (
    <>
      <form onSubmit={handleSubmit(onSave)} className="w-full mb-4" ref={refProp}>
        <Editor
          name="raw"
          methods={methods}
          onChange={handleChange}
          editorState={editorState}
          options={{ placeholder, onUpload: handleUpload }}
          defaultValue={content}
        />

        <div className="flex justify-end font-bold uppercase">
          {!isLoading ? (
            <>
              {' '}
              {!isEmpty(raw) && (
                <button className="ml-2 btn" type="button" onClick={onCancel}>
                  Cancel
                </button>
              )}
              <button className="ml-2 btn" type="submit" disabled={isEmpty(raw)}>
                Reply
              </button>
            </>
          ) : (
            <div className="mt-2">
              <span className="text-gray-500 material-icons spinner">sync</span>
            </div>
          )}
        </div>
      </form>
    </>
  );
};

export default inject(({ customerCaseStore }) => ({ customerCaseStore }))(observer(Form));
