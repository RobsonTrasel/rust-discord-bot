export const getEnvVariable = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Informação no .ENV ${key} não esta presente`);

  return value;
};
