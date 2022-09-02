import { inject, observer } from 'mobx-react';
import React from 'react';
import Uploader from 'components/common/Uploader';

const ImageUpload = ({ methods, onUpload, customerCaseStore, label, required, helperText, ...rest }) => {
  const onImageUpload = async (files) => {
    const formData = new FormData();
    formData.append('image', files[0]);

    await customerCaseStore.uploadMedia(formData).then((res) => onUpload(res));
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
      />
    </div>
  );
};

export default inject(({ customerCaseStore }) => ({
  customerCaseStore,
}))(observer(ImageUpload));
