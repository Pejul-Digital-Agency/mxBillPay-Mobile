import {
  validateString,
  validateEmail,
  validatePassword,
  validateNumber,
  validateCreditCardNumber,
  validateExpiryDate,
  validateCVV,
  validateNigerianNumber,
  validateBvn,
} from '../ValidationConstraints';

export const validateInput = (
  inputId: string,
  inputValue: string
): string | undefined => {
  if (
    inputId === 'fullName' ||
    inputId === 'firstName' ||
    inputId === 'lastName' ||
    inputId === 'location' ||
    inputId === 'rcNumber' ||
    inputId === 'companyName' ||
    inputId === 'accountNo' ||
    inputId === 'customerId' ||
    inputId === 'bio' ||
    inputId === 'amount' ||
    inputId === 'address' ||
    inputId === 'street' ||
    inputId === 'postalCode' ||
    inputId === 'appartment' ||
    inputId === 'destination' ||
    inputId === 'ageRange' ||
    inputId === 'description' ||
    inputId === 'about' ||
    inputId === 'creditCardHolderName' ||
    inputId === 'addressLine1' ||
    inputId === 'addressLine2' ||
    inputId === 'companyAddress'
  ) {
    return validateString(inputId, inputValue);
  } else if (
    inputId === 'email' ||
    inputId === 'currentEmail' ||
    inputId === 'newEmail'
  ) {
    return validateEmail(inputId, inputValue);
  } else if (
    inputId === 'password' ||
    // inputId === 'confirmPassword' ||
    inputId === 'currentPassword' ||
    inputId === 'newPassword'
    // inputId === 'confirmNewPassword'
  ) {
    return validatePassword(inputId, inputValue);
  } else if (inputId === 'phoneNumber') {
    return validateNigerianNumber(inputId, inputValue);
  } else if (inputId === 'bvn') {
    return validateBvn(inputId, inputValue);
  } else if (inputId === 'resetToken') {
    return validateString(inputId, inputValue);
  } else if (inputId === 'places') {
    return validateNumber(inputId, inputValue);
  } else if (inputId === 'creditCardNumber') {
    return validateCreditCardNumber(inputId, inputValue);
  } else if (inputId === 'creditCardExpiryDate') {
    return validateExpiryDate(inputId, inputValue);
  } else if (inputId === 'cvv') {
    return validateCVV(inputId, inputValue);
  }
};
