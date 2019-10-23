import { useState, useContext } from 'react';
import { identity, setReducedState } from '../../utils/functions';
import { RequestParams } from '../../utils/types';
import { AppContext } from '../contexts/AppContext';

type formStateType = 'values' | 'errors' | 'both';

const formatErrors = (values: any, setErrors: any) => (
  acc: any,
  [id, func]: any,
) => {
  if (func) {
    const error = func(values[id], values, setErrors);
    if (error) {
      acc[id] = error;
    }
  }

  return acc;
};

export const useForm = (
  validators: any = {},
  initialValues: any = {},
  initialErrors: any = {},
) => {
  const { onRequest } = useContext<any>(AppContext);
  const [values, setValues] = useState<any>(initialValues);
  const [errors, setErrors] = useState<any>(initialErrors);

  const validationErrors = () => Object.entries(validators).reduce(formatErrors(values, setErrors), {});

  function onClear(type: formStateType = 'both') {
    switch (type) {
      case 'values':
        setValues({});
        break;
      case 'errors':
        setErrors({});
        break;
      default:
        setValues({});
        setErrors({});
        break;
    }
  }

  function onSet(
    newState: any,
    type: 'values' | 'errors' = 'values',
    replace: boolean = false,
  ) {
    const prevState = type === 'values' ? values : errors;
    const accState = replace ? {} : { ...prevState };
    if (type === 'values') {
      setValues({ ...accState, ...newState });
    } else {
      setErrors({ ...accState, ...newState });
    }
  }

  /**
   * Função para submeter qualquer tipo de formulário
   * @param endpoint - Aqui nós passamos o corpo da requisição
   * @param formatterErrors
   * @param submitValidation
   */
  async function onSubmit(
    endpoint: RequestParams,
    formatterErrors: any,
    submitValidation?: any,
    noValidation: boolean = false,
  ) {
    const formErrors = validationErrors();
    const submitErrors = submitValidation ? submitValidation(values) : {};
    try {
      if (Object.keys(formErrors).length < 1 || noValidation) {
        if (Object.keys(submitErrors).length < 1 || noValidation) {
          const resp = await onRequest(endpoint);
          return Promise.resolve(resp);
        }
        onSet(submitErrors, 'errors');
        return Promise.reject(new Error('clienterror'));
      }

      onSet(formErrors, 'errors');
      return Promise.reject(new Error('clienterror'));
    } catch (responseErrors) {
      const isErrorJson = (responseErrors.status === 422 || (responseErrors.status >= 200 && responseErrors.status < 300)) && responseErrors.status !== 204;
      const parsedErrors = await isErrorJson ? responseErrors.json() : responseErrors;
      onSet(formatterErrors(parsedErrors), 'errors');
      return Promise.reject(responseErrors);
    }
  }

  function onChange(
    id: string | [string, number, string],
    formatter = identity,
    validate = false,
  ) {
    return (event: any) => {
      const value = formatter(event);
      if (Array.isArray(id)) {
        const [array, idx, valueId] = id;
        setValues({
          ...values,
          [array]: [
            ...values[array].slice(0, idx),
            { ...values[array][idx], [valueId]: value },
            ...values[array].slice(idx + 1),
          ],
        });
      } else {
        if (validate) {
          const validator = validators[id];
          if (validator) {
            if (validator.length === 1) {
              setErrors((errors: any) => ({
                ...errors,
                [id]: validator(value),
              }));
            } else if (validator.length === 2) {
              setErrors((errors: any) => ({
                ...errors,
                [id]: validator(value, values),
              }));
            } else {
              setErrors((errors: any) => ({
                ...errors,
                [id]: validator(value, values, setErrors),
              }));
            }
          }
        }
        setValues((values: any) => ({ ...values, [id]: value }));
      }
    };
  }

  function onAddArray(array: string, newItem: any = {}) {
    const newItemWithId = { ...newItem, id: Date.now() };
    onSet({ [array]: [...values[array], newItemWithId] });
  }
  function onAddMultipleArray(array: string, newArray: any[] = []) {
    const newArrayWithIds = newArray.map((item: any, idx: any) => ({
      ...item,
      id: Date.now() + idx,
    }));
    onSet({ [array]: [...values[array], ...newArrayWithIds] });
  }

  function onClearArray(array: string, idx: number | 'all') {
    if (typeof idx === 'number') {
      onSet({
        [array]: [
          ...values[array].slice(0, idx),
          { id: values[array][idx].id },
          ...values[array].slice(idx + 1),
        ],
      });
      onSet(
        { [array]: { ...errors[array], [values[array][idx].id]: '' } },
        'errors',
      );
    } else {
      onSet({
        [array]: [...values[array].map((item: any) => ({ id: item.id }))],
      });
      onSet({ [array]: {} }, 'errors');
    }
  }

  function onDelArray(array: string, idx: number | 'all') {
    if (typeof idx === 'number') {
      onSet({
        [array]: [
          ...values[array].slice(0, idx),
          ...values[array].slice(idx + 1),
        ],
      });
      onSet(
        { [array]: { ...errors[array], [values[array][idx].id]: '' } },
        'errors',
      );
    } else {
      onSet({
        [array]: [],
      });
      onSet({ [array]: {} }, 'errors');
    }
  }

  function onBlur(id: string) {
    return () => {
      const value = values[id];
      const validator = validators[id];
      if (validator) {
        if (validator.length === 1) {
          setErrors((errors: any) => ({
            ...errors,
            [id]: validator(value),
          }));
        } else if (validator.length === 2) {
          setErrors((errors: any) => ({
            ...errors,
            [id]: validator(value, values),
          }));
        } else {
          setErrors((errors: any) => ({
            ...errors,
            [id]: validator(value, values, setErrors),
          }));
        }
      }
    };
  }

  function onReset(
    type: formStateType = 'both',
    retain: string | Array<string> = '',
  ) {
    switch (type) {
      case 'values':
        if (Array.isArray(retain)) {
          setReducedState(values, retain, (retainedState: any) => setValues({ ...initialValues, ...retainedState }));
        } else {
          setValues({ ...initialValues, [retain]: values[retain] });
        }
        break;
      case 'errors':
        if (Array.isArray(retain)) {
          setReducedState(errors, retain, (retainedState: any) => setErrors({ ...initialErrors, ...retainedState }));
        } else {
          setErrors({ ...initialErrors, [retain]: errors[retain] });
        }
        break;
      default:
        setValues(initialValues);
        setErrors(initialErrors);
        break;
    }
  }

  return {
    onChange,
    validationErrors,
    onBlur,
    onClear,
    onSubmit,
    onReset,
    onAddArray,
    onAddMultipleArray,
    onClearArray,
    onDelArray,
    onSet,
    values,
    errors,
  };
};
