import React, { useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const ReCaptcha = ({ onChange }) => {
  const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
  const [recaptchaKey, setRecaptchaKey] = useState(Math.random());

  const CAPTCHA_TIMEOUT = 30000; // 1 minute

  const handleChange = (value) => {
    console.log("Received CAPTCHA value:", value); 
    onChange(value);
  };

  const resetCaptcha = () => {
    setRecaptchaKey(Math.random()); 
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      resetCaptcha(); 
    }, CAPTCHA_TIMEOUT);

    return () => clearTimeout(timer);
  }, []); 

  return (
    <div className="form-control">
      <ReCAPTCHA
        key={recaptchaKey}
        sitekey={siteKey}
        onChange={handleChange}
      />
      <button onClick={resetCaptcha}>
        Reset CAPTCHA
      </button>
    </div>
  );
};

export default ReCaptcha;
