export const isFieldEmpty = (field: any) => {
  if (typeof field === 'string') {
    return field.trim() === '';
  }
  if (typeof field === 'number') {
    return false;
  }
  return true;
};

export function validateRegExp(pattern: any, value: string) {
  const regExp = new RegExp(pattern);
  return regExp.test(value);
}

export function validateEmail(email: any) {
  if (isFieldEmpty(email)) {
    return 'Informe um email.';
  }
  if (!validateRegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, email)) {
    return 'O email deve estar em um formato válido.';
  }
  return undefined;
}

export function validateName(name: any) {
  if (isFieldEmpty(name)) {
    return 'Informe um nome.';
  }
  return undefined;
}

export function isDifferent(firstValue: any, secondValue: any) {
  return firstValue !== secondValue;
}

export function validatePassword(
  password: any,
  { confirmPassword }: any,
  setErrors: any,
) {
  if (isFieldEmpty(password)) {
    return 'Informe uma senha.';
  }
  if (confirmPassword) {
    if (isDifferent(password, confirmPassword)) {
      setErrors((errors: any) => ({
        ...errors,
        confirmPassword: 'A confirmação de senha deve ser igual à senha.',
      }));
      return undefined;
    }
    setErrors((errors: any) => ({
      ...errors,
      confirmPassword: undefined,
    }));
  }
  return undefined;
}

export function validateConfirmPassword(
  confirmPassword: any,
  { password }: any,
) {
  if (isFieldEmpty(confirmPassword)) {
    return 'Confirme sua senha.';
  }
  if (isDifferent(password, confirmPassword)) {
    return 'A confirmação de senha deve ser igual à senha.';
  }
  return undefined;
}

export const loginFormValidators = {
  email: validateEmail,
  password: validatePassword,
};

export const gameValidators = {
  name: validateName,
};
export const searchValidators = {
  search: validateName,
};
export const tokenFormValidators = {
  name: validateName,
};


export const signUpFormValidators = {
  name: validateName,
  email: validateEmail,
  password: validatePassword,
  confirmPassword: validateConfirmPassword,
};
