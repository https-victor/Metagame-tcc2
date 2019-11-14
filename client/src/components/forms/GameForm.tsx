import React, { useState } from 'react';
import { Form, Button } from 'antd';
import Dragger from 'antd/lib/upload/Dragger';
import { Input } from '../generics';
import { eventTargetValue, getImgSrc } from '../../utils/functions';

export const GameForm = ({
  closeSider, game, form, mode, 
}: any) => {
  const { values, errors, onChange } = form;
  function getBase64(img: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  const [imgUrl, setImgUrl] = useState(undefined);
  function beforeUpload(file: any) {
    console.log(file);
    getBase64(file, (imageUrl: any) => setImgUrl(imageUrl));
    return true;
  }

  function handleChange(info: any) {
    console.log(info);
  }
  return (
    <Form className="form-game-wrapper">
      <Button
        className="close-button"
        shape="circle"
        icon="close"
        type="primary"
        onClick={closeSider}
      />
      <div className="game-header">
        <Dragger
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          <div
            className="div-upload"
            style={{
              background: `url(${
                imgUrl || (game.img
                  ? game.img.buffer
                    ? getImgSrc(game.img)
                    : 'https://www.hopkinsmedicine.org/-/media/feature/noimageavailable.ashx?h=260&la=en&mh=260&mw=380&w=380&hash=C84FD22E1194885A737D9CF821CC61A861630CB1'
                  : 'https://www.hopkinsmedicine.org/-/media/feature/noimageavailable.ashx?h=260&la=en&mh=260&mw=380&w=380&hash=C84FD22E1194885A737D9CF821CC61A861630CB1')
              }) no-repeat center/cover`,
            }}
          >
            <span>Upload</span>
          </div>
        </Dragger>
        <div className="game-overlay">
          <Input
            value={values.name}
            placeholder={mode === 'add' ? 'Nome' : undefined}
            error={errors.name}
            onChange={onChange('name', eventTargetValue)}
          />
        </div>
      </div>
      <div className="description-wrapper">
        <Input
          placeholder={mode === 'add' ? 'Descrição' : undefined}
          value={values.description}
          error={errors.description}
          type="textarea"
          onChange={onChange('description', eventTargetValue)}
        />
      </div>
    </Form>
  );
};
