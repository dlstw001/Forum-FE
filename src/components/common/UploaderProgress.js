import { generate } from 'shortid';
import { inject } from 'mobx-react';
import { renameFiles } from 'utils';
import { useDropzone } from 'react-dropzone';
import InputError from 'components/common/Form/InputError';
import React from 'react';

const UploaderProgress = ({ methods = {}, onUpload, onError, description, accept = 'image/*' }) => {
  const { register, errors } = methods;
  const [files, setFiles] = React.useState([]);
  const [progress, setProgress] = React.useState({});

  const myUploadProgress = (file) => (progress) => {
    let percentage = Math.floor((progress.loaded * 100) / progress.total);
    setProgress((prevState) => ({ ...prevState, [file.id]: percentage }));
  };

  const onDrop = React.useCallback(
    async (acceptedFiles) => {
      // Rename file name to kebab case
      const renamedAcceptedFiles = renameFiles(acceptedFiles);

      setFiles([...files, ...renamedAcceptedFiles]);
      try {
        const files = Object.keys(renamedAcceptedFiles).map((key) => {
          var config = {
            onUploadProgress: myUploadProgress(renamedAcceptedFiles[key]),
          };
          let form = new FormData();
          Object.defineProperty(acceptedFiles[key], 'id', {
            value: generate(),
          });

          form.append('image', renamedAcceptedFiles[key]);
          return { file: renamedAcceptedFiles[key], form, config };
        });

        onUpload(files);
      } catch (err) {
        onError(err);
      }
    },
    [files, onUpload, onError]
  );

  const { acceptedFiles, fileRejections, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    name: 'image',
    // maxFiles: 1,
  });

  const acceptedFileItems = files.map((file, key) => {
    return (
      <li key={key} className="flex items-center px-4 py-2 mb-2 bg-gray-200">
        <i className="mr-4 text-3xl text-gray-500 fas fa-file-image"></i>
        {file.name && (
          <div className="w-full">
            {file.name}
            {progress[file.id] && (
              <div progress={progress[file.id]} className="w-full">
                <div className="absolute h-3 rounded-full bg-primary progress-bar"></div>

                <div className="percentage-text">{progress[file.id]}%</div>
              </div>
            )}
          </div>
        )}
      </li>
    );
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
        {...getRootProps({ className: 'relative p-3 border border-gray-400 border-dashed rounded-sm cursor-pointer' })}
      >
        <input
          {...getInputProps({
            refKey: register && register({ required: false }),
            className: 'absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer',
          })}
        />
        <div className="flex flex-col items-center justify-between w-full p-4 bg-gray-200 mr">
          <p className="mb-0 text-center">
            <i className="fas fa-file-upload" />
            &nbsp;<span className="text-gray-500">Drop File here</span> or{' '}
            <span className="text-primary">Choose File</span>
          </p>
          <p className="m-0 text-center">{description}</p>
        </div>
      </div>
      {!!acceptedFiles.length && <ul className="mt-4">{acceptedFileItems}</ul>}

      {!!fileRejections.length && <ul className="mt-4">{fileRejectionItems}</ul>}

      <InputError errors={errors} name="file" />
    </>
  );
};

export default inject(({ uploadStore }) => ({ uploadStore }))(UploaderProgress);
