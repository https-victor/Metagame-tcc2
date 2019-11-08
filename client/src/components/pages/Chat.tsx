import React, { useState, useCallback, useEffect } from 'react';
import { Button, Input } from 'antd';
import io from 'socket.io-client';

const client = io('http://localhost:4000');
export const Chat = () => {
  const [input, setInput] = useState('');
  const [msg, setMsg] = useState('Inicio');

  const onSendMsg = useCallback(() => {
    client.emit('input', input);
  }, [client, input]);

  const onUpdateMsg = useCallback(
    (m: any) => {
      setMsg(`${m}${msg}`);
    },
    [msg],
  );

  useEffect(() => {
    client.on('output', onUpdateMsg);

    return () => {
        client.off('output', onUpdateMsg);
    }
  }, [onUpdateMsg]);

  return (
    <div>
      {msg}
      <Input value={input} onChange={(e: any) => setInput(e.target.value)} />
      <Button onClick={onSendMsg}>Enviar</Button>
    </div>
  );
};
