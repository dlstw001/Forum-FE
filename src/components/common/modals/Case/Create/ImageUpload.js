import { inject, observer } from 'mobx-react';
import React from 'react';
import Uploader from 'components/common/Uploader';

const ImageUpload = ({ methods, onUpload, uploadStore, label, required, helperText, ...rest }) => {
  const onImageUpload = async (files) => {
    const formData = new FormData();
    formData.append('image', files[0]);

    await uploadStore.uploadImage(formData).then((res) => onUpload(res));
  };

  return (
    <div className="flex flex-col justify-between">
      <div>
        <div className="mb-0 form-label">
          {label} {required && <sup>*</sup>}
        </div>
        <div className="mb-4 form-helper">{helperText}</div>
      </div>
      <Uploader
        label="banner image"
        methods={methods}
        name="bannerImage"
        accept="image/*"
        multiple={false}
        onUpload={onImageUpload}
        rules={{ required }}
        className="customer-case-upload-card"
        data-cy={rest['data-cy']}
        fileOriginal={rest.defaultValue}
      />
    </div>
  );
};

export default inject(({ uploadStore }) => ({ uploadStore }))(observer(ImageUpload));
