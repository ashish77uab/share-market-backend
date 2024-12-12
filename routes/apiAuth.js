import express from "express";
const router = express.Router();

const API_KEY = "80caf821-8b64-4603-a220-1ef84a8449b1"
const API_SECRET = "zw2454souc"
const REDIRECT_URL = "http://localhost:5000/api/upstox-login-callback"
const RESPONSE_TYPE = "code"
const BASE_URL = "https://api.upstox.com/v2"

const getLoginToken = async () => {
  try {
    const response = await axios.post(
      `${UPSTOX_BASE_URL}/login`,
      {
        apiKey: UPSTOX_API_KEY,
        userId: UPSTOX_USER_ID,
        password: UPSTOX_PASSWORD,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const { code } = response.data;
    console.log('Login Token:', code);
    return code;
  } catch (error) {
    console.error('Error during login:', error.response?.data || error.message);
    throw new Error('Login failed.');
  }
};


router.get("/upstox-login", async (req, res) => {
  const authUrl = `${BASE_URL}/login/authorization/dialog?response_type=${RESPONSE_TYPE}&client_id=${API_KEY}&redirect_uri=${REDIRECT_URL}`;
  res.redirect(authUrl);

  // res.status(200).send({
  //     status: true,
  //     message: "calling upstox-login"
  // })
});

router.get("/upstox-login-callback", async (req, res) => {
  console.log(req.body)
  console.log(req.query)
  res.status(200).send({
    status: true,
    message: "calling upstox-login-callback"
  })
});




export default router;
