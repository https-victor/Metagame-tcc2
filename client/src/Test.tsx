import React from 'react';

export const Test = () => (
  <div>
    <form
      action="http://localhost:5000/api/users/upload/5dc998d243502106686333eb"
      encType="multipart/form-data"
      method="POST"
    >
      <input type="file" name="picture" accept="image/*" />
      <input type="submit" value="Upload Photo" />
    </form>
  </div>
);
