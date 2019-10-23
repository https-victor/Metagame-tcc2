import React, { ReactNode, ChangeEvent } from 'react';
import MaskedInput, { maskArray } from 'react-text-mask';
import { Input as AntInput, InputNumber } from 'antd';
import {
  InputProps as AntInputProps,
  PasswordProps,
  TextAreaProps,
} from 'antd/lib/input';
import { InputNumberProps } from 'antd/lib/input-number';
import Form, { FormItemProps } from 'antd/lib/form';

//  O componente de máscara do react-text-mask utiliza o onChange e passa para o Input do AntDesign através
//  dos props que a função renderInput fornece. Portanto, o onChange pode assumir diversos tipos, sendo o tipo
//  Input do react-text-mask diferente do Input do AntdDesign, o que levava a erros de typescript.
type onChangeInput = (event: ChangeEvent<HTMLInputElement>) => void;
type onChangeNumber = (value: number | undefined) => void;
type onChangePassword = (event: ChangeEvent<HTMLInputElement>) => void;
type onChangeTextArea =
  | ((event: ChangeEvent<HTMLTextAreaElement>) => void)
  | undefined;
type onChangeMaskedInput =
  | ((event: ChangeEvent<HTMLInputElement>) => void)
  | undefined;

//  Omitindo o atributo "type" dos tipos de Input do AntDesign (TextArea não possui "type").
type AntInputPropsWithoutType = Omit<AntInputProps, 'type'>;
type AntPasswordPropsWithoutType = Omit<PasswordProps, 'type'>;
type AntNumberPropsWithoutType = Omit<InputNumberProps, 'type'>;

//  O tipo do MaskedInputProps possui elementos do InputHTMLElement extendidos, o que gerava conflitos
//  Como solução rápida, apenas adicionei os atributos: mask, guide, placeholderChar, keepCharPosition, pipe e showmask
//  Para então adicionar um atributo "onChange" que poderá ser substituido em qualquer um dos componentes, seja ele:
//  MaskedInput, AntIput, InputNumber, AntInput.Password ou AntInput.TextArea
export interface InputProps {
  type?: 'default' | 'number' | 'textarea' | 'password';
  inputType?: string | undefined;
  error?: string | boolean;
  label?: ReactNode;
  formItemProps?: FormItemProps;
  opt?: boolean;
  mask?: maskArray | ((value: string) => maskArray);
  guide?: boolean;
  placeholderChar?: string;
  keepCharPositions?: boolean;
  pipe?: (
    conformedValue: string,
    config: any,
  ) => false | string | { value: string; indexesOfPipedChars: number[] };
  showMask?: boolean;
  // render?: (ref: (inputElement: HTMLElement) => void, props: any) => any;
  onChange?:
    | onChangeInput
    | onChangeNumber
    | onChangePassword
    | onChangeTextArea
    | onChangeMaskedInput;
}

export const Input = ({
  error = '',
  label,
  type = 'default',
  formItemProps,
  opt = false,
  mask = false,
  inputType,
  guide,
  placeholderChar,
  keepCharPositions,
  pipe,
  showMask,
  onChange,
  ...antProps
}: InputProps &
  (
    | AntInputPropsWithoutType
    | AntPasswordPropsWithoutType
    | TextAreaProps
    | AntNumberPropsWithoutType)) => {

  //  Condições para a mascara entrar em ação: Qualquer um dos atributos de mascara não serem nulos
  //  e o tipo não ser numero ou senha
  const isMaskEnabled = !!mask
    || !!guide
    || !!placeholderChar
    || !!keepCharPositions
    || !!pipe
    || (!!showMask && type !== 'number' && type !== 'password');

  //  Função que retorna JSX, possui dois parametros opcionais: ref e props. Estes parametros somente
  //  preenchidos quando a função for chamada pelo atributo "render" do MaskedInput e.g.: render={renderInput}.
  //  Quando chamado pelo render, é retornado um Input SEM o atributo onChange (já que o MaskedInput o utiliza no lugar)
  //  e é passado as props do MaskedInput para o Input do AntDesign.
  //  Quando a função é chamada sem nenhum parametro, retorna o Input do antdesign normal, sem nenhuma referência ao
  //  MaskedInput e com onChange.
  function renderInput(ref?: (inputElement: HTMLElement) => void, props?: any) {
    const refProps = props || ref ? { ...props } : {};
    switch (type) {
      case 'number': {
        return (
          <InputNumber
            placeholder={opt ? 'Opcional' : undefined}
            type={inputType}
            {...(antProps as AntNumberPropsWithoutType)}
            onChange={onChange as onChangeNumber}
          />
        );
      }
      case 'password': {
        return (
          <AntInput.Password
            placeholder={opt ? 'Opcional' : undefined}
            {...(antProps as AntPasswordPropsWithoutType)}
            type={inputType}
            onChange={onChange as onChangePassword}
          />
        );
      }
      case 'textarea': {
        return (
          <AntInput.TextArea
            placeholder={opt ? 'Opcional' : undefined}
            {...(antProps as TextAreaProps)}
            onChange={onChange as onChangeTextArea}
          />
        );
      }
      default:
        if (isMaskEnabled) {
          return (
            <AntInput
              placeholder={opt ? 'Opcional' : undefined}
              {...(props && props)}
              {...refProps}
              {...(antProps as AntInputPropsWithoutType)}
              type={inputType}
              ref={ref && ((input: any) => ref(input && input.input))}
            />
          );
        }
        return (
          <AntInput
            placeholder={opt ? 'Opcional' : undefined}
            {...(antProps as AntInputPropsWithoutType)}
            type={inputType}
            onChange={onChange as onChangeInput}
          />
        );
    }
  }
  return (
    <Form.Item
      {...{
        style: { margin: 0 },
        ...formItemProps,
        help: error,
        validateStatus: error ? 'error' : undefined,
        label,
      }}
    >
      {isMaskEnabled ? (
        <MaskedInput
          mask={mask}
          guide={guide}
          placeholderChar={placeholderChar}
          keepCharPositions={keepCharPositions}
          pipe={pipe}
          showMask={showMask}
          onChange={onChange as onChangeMaskedInput}
          value={antProps && antProps.value}
          render={renderInput}
        />
      ) : (
        renderInput()
      )}
    </Form.Item>
  );
};
