export function formatterLoginFormErrors(res: any) {
  const { errors } = res;
  const newErrors = errors.reduce(
    (acc: any, item: any) => ({
      ...acc,
      [item.type]: item.msg,
    }),
    {},
  );

  return newErrors;
}

export function formatterSignUpFormErrors(res: any) {
  const { errors } = res;

  const newErrors = errors.reduce(
    (acc: any, item: any) => ({
      ...acc,
      [item.type]: item.msg,
    }),
    {},
  );

  return newErrors;
}
