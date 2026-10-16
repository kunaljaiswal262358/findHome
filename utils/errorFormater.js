export const joiErrorFormater = (error) => {
  const formatted = {};
  error.details.forEach((detail) => {
    formatted[detail.path[0]] = detail.message;
  });

  return formatted;
};
