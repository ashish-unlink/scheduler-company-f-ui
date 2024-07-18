export const regx = {
    email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    name: /^[a-z ,.'-]+$/i,
    password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/i,
    phone: /^[0-9]*$/,
    customer_phone: /^\+[0-9]+/g,
    postal_code: /[0-9]{3}-?[0-9]{4}/g,
    bussiness: /[a-zA-Z0-9\s.'-]/g,
    minute: /^[0-9]+$/,
    price: /^[0-9.]*$/,
  
    camel_space_case: /([A-Z])/g,
  };
  