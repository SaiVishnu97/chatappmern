import * as yup from 'yup';

export const validationSchema = yup.object().shape({
    name: yup.string().required("This field is required"),
    lastname: yup.string().notRequired(),
    email: yup.string().email("Please enter a valid email").required("This field is required"),
    password: yup.string()
      .required("This field is required")
      .min(8, "Pasword must be 8 or more characters"),
      confirmpassword: yup.string().when("password", (password, field) => {
      if (password) {
        return field.required("The passwords do not match").oneOf([yup.ref("password")], "The passwords do not match");
      }
    }),
  });
