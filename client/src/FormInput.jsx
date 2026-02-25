import { FormHelperText } from "@mui/material";
import TextField from "@mui/material/TextField";
import { textFieldStyle, helperTextStyle } from "./utils/StylingConsts";

export const FormInput = ({ onChange, helperText, ...inputFields }) => {
  return (
    <div>
      <TextField onChange={onChange} {...inputFields} sx={textFieldStyle} />
      <FormHelperText sx={helperTextStyle}>{helperText}</FormHelperText>
    </div>
  );
};
