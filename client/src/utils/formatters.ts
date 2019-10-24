export function formatterLoginFormErrors(res: any) {
  const { errors } = res;
  console.log(res);

  const newErrors = errors.reduce(
    (acc: any, item: any) => ({
      ...acc,
      [item.type]: item.msg,
    }),
    {},
  );

  return newErrors;
}
