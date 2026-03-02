import { FormHelperText, SxProps } from "@mui/material";
import TextField from "@mui/material/TextField";
import { textFieldStyle, helperTextStyle } from "./utils/StylingConsts";
import * as React from "react";

type FormInputProps = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  helperText: string;
  name: string;
  value: string;
  type: string;
  placeholder: string;
  label: string;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  sx?: SxProps;
  error: boolean;
};

export const FormInput = ({
  onChange,
  helperText,
  ...inputFields
}: FormInputProps) => {
  return (
    <div>
      <TextField onChange={onChange} {...inputFields} sx={textFieldStyle} />
      <FormHelperText sx={helperTextStyle}>{helperText}</FormHelperText>
    </div>
  );
};
