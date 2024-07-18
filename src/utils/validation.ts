import * as Yup from "yup";
import { regx } from "./regx";
import { validationMessages } from "./constantString";

export const emailSchema = () => {
  return Yup.string()
    .required(validationMessages.EMAIL_REQUIRED)
    .matches(regx.email, validationMessages.EMAIL_INVALID);
};

export const nameSchema = (name: string) => {
  return Yup.string()
    .required(`${name} ${validationMessages.NAME_REQUIRED}`)
    .matches(regx.name, `${validationMessages.NAME_INVALID} ${name}`)
    .trim();
};

export const passwordSchema = () => {
  return Yup.string()
    .required(validationMessages.PASSWORD_REQUIRED)
    .matches(regx.password, validationMessages.PASSWORD_INVALID);
};

export const confirmPasswordSchema = () => {
  return Yup.string()
    .required(validationMessages.CONFIRM_PASSWORD_REQUIRED)
    .oneOf(
      [Yup.ref("password"), ""],
      validationMessages.CONFIRM_PASSWORD_INVALID
    );
};

export const bussinessNameSchema = () => {
  return Yup.string()
    .required(validationMessages.BUSSINESS_REQUIRED)
    .matches(regx.bussiness, validationMessages.BUSSINESS_INVALID)
    .trim();
};

export const countrySchema = () => {
  return Yup.string().required(validationMessages.NAME_REQUIRED);
};

export const phoneSchema = () => {
  return Yup.string()
    .required(validationMessages.PHONE_REQUIRED)
    .matches(regx.phone, validationMessages.PHONE_INVALID);
};

export const customerPhoneSchema = () => {
  return Yup.string()
    .required(validationMessages.PHONE_REQUIRED)
    .matches(regx.customer_phone, validationMessages.PHONE_INVALID)
    .min(7, validationMessages.PHONE_INVALID)
    .max(15, validationMessages.PHONE_INVALID);
};

export const genderSchema = () => {
  return Yup.string().required(validationMessages.GENDER_REQUIRED);
};

export const priceSchema = () => {
  return Yup.string()
    .required(validationMessages.PRICE_REQUIRED)
    .matches(regx.price, validationMessages.PRICE_INVALID);
};

export const timeMinuteSchema = () => {
  return Yup.string()
    .required(validationMessages.TIME_REQUIRED)
    .matches(regx.minute, validationMessages.TIME_INVALID);
};

export const requiredSchema = (name: string) => {
  return Yup.string().required(`${name} ${validationMessages.NAME_REQUIRED}`);
};

export const requiredObjectSchema = (name: string) => {
  return Yup.object().required(`${name} ${validationMessages.NAME_REQUIRED}`);
};

export const zipCodeSchema = () => {
  return Yup.string()
    .required(`Postal Code ${validationMessages.NAME_REQUIRED}`)
    .matches(regx.postal_code, validationMessages.POSTAL_CODE_INVALID);
};

export const requiredServiceSchema = () => {
  return Yup.array().required(validationMessages.SERVICE_OPTION_REQUIRED);
};

export const requiredArraySchema = () => {
  return Yup.array().of(
    Yup.object().shape({
      from: Yup.string().required("Start time is required"),
      to: Yup.string().required("End time is required"),
    })
  );
};
export const commissionSchema = () => {
  return Yup.number()
    .min(1, "AreaFrom must be at least 1")
    .max(99, "AreaFrom must be less than or equal to 99");
};
