import { useDropzone } from 'react-dropzone';
import cx from 'classnames';
import InputError from 'components/common/Form/InputError';
import React from 'react';

export default ({
  className,
  methods = {},
  onUpload,
  onClear,
  name = 'file',
  children,
  accept = 'image/*',
  fileOriginal,
  ...rest
}) => {
  const { errors } = methods;
  const [file, setFile] = React.useState();

  const onDrop = React.useCallback(
    (acceptedFiles) => {
      // Do something with the files
      onUpload(acceptedFiles);
      setFile(acceptedFiles);
    },
    [onUpload]
  );

  const handleClear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFile(undefined);
    onClear();
  };

  const { fileRejections, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    name,
  });

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
      <ul className="text-danger">
        {errors.map((e) => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

  return (
    <>
      <div
        {...getRootProps({
          className: cx(
            'relative p-3 border border-gray-400 border-dashed rounded-sm',
            className,
            !file && !fileOriginal && 'uploader'
          ),
        })}
        data-cy={rest['data-cy']}
      >
        <input
          {...getInputProps({
            name,
            className: 'absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer',
          })}
        />
        {children}
        {(!!file?.length || fileOriginal) && (
          <img
            src={
              file
                ? URL.createObjectURL(file[0])
                : fileOriginal
                ? fileOriginal
                : `${process.env.REACT_APP_API_SERVER}/category/image/${fileOriginal?.filename}`
            }
            alt={file ? file[0].name : fileOriginal.filename}
            style={{ height: '100%', margin: '0 auto' }}
          />
        )}
        {file && (
          <button type="button" onClick={handleClear} className="absolute top-0 right-0 mt-4 mr-4 material-icons">
            close
          </button>
        )}
      </div>
      {!!fileRejections.length && <ul className="mt-1 mb-4">{fileRejectionItems}</ul>}

      <InputError errors={errors} name="file" />
    </>
  );
};
