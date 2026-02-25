export const regexes = {
  name: { regex: /^.{1,100}$/, errorMessage: "Please enter a name" },
  email: {
    regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    errorMessage: "Please enter a valid email address",
  },
  message: {
    regex: /^.{1,1000}$/,
    errorMessage: "",
  },
};
