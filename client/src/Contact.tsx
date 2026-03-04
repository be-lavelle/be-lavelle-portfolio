import * as React from "react";
import { FormInput } from "./FormInput";
import {
  FormGroup,
  Button,
  TextField,
  Box,
  Typography,
  FormHelperText,
} from "@mui/material";
import "./Contact.css";
import emailjs from "@emailjs/browser";
import {
  boxStyle,
  h4Style,
  helperTextStyle,
  textFieldStyle,
} from "./utils/StylingConsts";
import { regexes } from "./utils/Consts";

export const Contact = () => {
  const [values, setValues] = React.useState({
    name: "",
    email: "",
    message: "",
    charactersRemaining: "1000/1000",
    isNameValid: true,
    isEmailValid: true,
    isMessageValid: true,
  });

  const [helperText, setHelperText] = React.useState({
    name: "",
    email: "",
    message: "1000/1000",
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const newHelperText = regexes[name].regex.test(value)
      ? ""
      : regexes[name].errorMessage;
    let newValues = {
      ...values,
      [name]: value,
    };
    switch (name) {
      case "name":
        newValues = {
          ...newValues,
          isNameValid: regexes.name.regex.test(value),
        };
        break;
      case "email":
        newValues = {
          ...newValues,
          isEmailValid: regexes.email.regex.test(value),
        };
        break;
      case "message":
        newValues = {
          ...newValues,
          isMessageValid: regexes.message.regex.test(value),
          charactersRemaining: `${1000 - value.length}/1000`,
        };
        break;
      default:
        break;
    }
    setHelperText({ ...helperText, [name]: newHelperText });
    setValues({ ...newValues });
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log("Form", values);
    const templateParams = {
      name: values.name,
      email: values.email,
      message: values.message,
      time: new Date(),
    };
    emailjs
      .send(
        process.env.REACT_APP_SERVICE_KEY,
        process.env.REACT_APP_TEMPLATE_KEY,
        templateParams,
        {
          publicKey: process.env.REACT_APP_PUBLIC_KEY,
        },
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
        },
        (error) => {
          console.log("FAILED...", error);
        },
      );
  };

  return (
    <div>
      <Typography variant="h4" sx={h4Style}>
        Contact Me
      </Typography>
      <div className="form-wrapper">
        <FormGroup>
          <Box component="form" sx={boxStyle}>
            <div>
              <FormInput
                onChange={onChange}
                name="name"
                type="text"
                label="name"
                placeholder="name"
                value={values.name}
                helperText={helperText.name}
                error={!values.isNameValid}
              />
              <FormInput
                onChange={onChange}
                name="email"
                type="text"
                label="email"
                placeholder="email"
                value={values.email}
                helperText={helperText.email}
                error={!values.isEmailValid}
              />
            </div>
            <TextField
              name="message"
              value={values.message}
              onChange={onChange}
              placeholder="message"
              label="message"
              fullWidth
              multiline
              rows={4}
              sx={textFieldStyle}
              error={!values.isMessageValid}
            />
            <FormHelperText sx={helperTextStyle}>
              {values.charactersRemaining}
            </FormHelperText>
          </Box>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              !values.isNameValid ||
              !values.isEmailValid ||
              !values.isMessageValid
            }
          >
            Submit
          </Button>
        </FormGroup>
      </div>
    </div>
  );
};
