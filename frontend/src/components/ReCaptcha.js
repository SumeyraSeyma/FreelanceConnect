import React from "react";
import ReCAPTCHA from "react-google-recaptcha";

const ReCaptcha = ({ onChange }) => {
  const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    console.error("RECAPTCHA_SITE_KEY tanımlı değil");
    return null;
  }

  return (
    <div className="form-control">
      <ReCAPTCHA sitekey={siteKey} onChange={onChange} />
    </div>
  );
};

export default ReCaptcha;