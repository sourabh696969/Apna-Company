const axios = require("axios");

const sendOTP = async (phone, otp) => {
  const url = "https://www.fast2sms.com/dev/bulkV2";
  const payload = {
    variables_values: otp,
    route: "otp",
    numbers: phone,
  };

  const config = {
    headers: {
      authorization: process.env.API_KEY,
      "Content-Type": "application/json",
      "cache-control": "no-cache",
    },
  };

  try {
    const response = await axios.post(url, payload, config);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Error sending OTP. Please try again later.");
  }
};

module.exports = sendOTP;
