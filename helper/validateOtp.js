const validateOTP = async (otpTime) => {
  try {
    const currentDateTime = new Date();
    let differenceValue = (otpTime - currentDateTime.get()) / 1000;
    differenceValue /= 60;

    const ExpiryMinutes = Math.abs(differenceValue);

    if (ExpiryMinutes > 2) {
      return true;
    }

    return false;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = validateOTP;
