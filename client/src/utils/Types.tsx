export type RegexAndErrorMessage = {
  regex: RegExp;
  errorMessage: string;
};

export type RegexesType = {
  [key: string]: RegexAndErrorMessage;
};
