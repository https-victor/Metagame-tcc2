import React, { useState } from 'react';
import { Form, Button } from 'antd';
import Dragger from 'antd/lib/upload/Dragger';
import { Input } from '../generics';
import { eventTargetValue, getImgSrc } from '../../utils/functions';

export const GameForm = ({
  closeSider, game, form, mode, 
}: any) => {
  const { values, errors, onChange } = form;
  const [fileList, setFileList] = useState([]);

  function getBase64(img: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  const [imgUrl, setImgUrl] = useState(undefined);
  function beforeUpload(file: any) {
    getBase64(file, (imageUrl: any) => setImgUrl(imageUrl));
    return true;
  }

  function handleChange(info: any) {
    let newFileList = info.fileList.slice(-1);
    return newFileList[0].originFileObj;
  }
  return (
    <Form className="form-game-wrapper" id="formx">
      <Button
        className="close-button"
        shape="circle"
        icon="close"
        type="primary"
        onClick={closeSider}
      />
      <div className="game-header">
        <Dragger
          // action={`http://localhost:5000/api/games/upload/${game._id}`}
          name="picture"
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={onChange('picture',handleChange)}
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
        <div className="game-overlay input">
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
