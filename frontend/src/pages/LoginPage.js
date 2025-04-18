import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeClosed, Loader2, Lock, Mail, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";
import ReCaptcha from "../components/ReCaptcha";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn, reCaptcha } = useAuthStore();
  const [captchaValue, setCaptchaValue] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss(); // Önceki bildirimleri temizle

    if (!captchaValue) {
      toast.error("Please complete the CAPTCHA.");
      return;
    }

    try {
      const captchaResponse = await reCaptcha(captchaValue);
      if (!captchaResponse.success) {
        toast.error(
          captchaResponse?.message ||
            "CAPTCHA verification failed. Please try again."
        );
        return;
      }

      await login(formData);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        toast.error("Too many login attempts. Please try again later.");
      } else {
        toast.error(
          error.response?.data?.message || "Login failed. Please try again."
        );
      }
    }
  };

  return (
    <div className="min-h-screen grid bg-base-200 text-base-content lg:grid-cols-2">
      {/* Left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12  ">
        <Megaphone className="size-16 mb-3 text-cyan-600" />
        <h1 className="text-4xl font-bold text-base-content">
          Let Your Skills Meet the World
        </h1>
        <p className="text-base-content/60 mt-4">
          The easiest way to find jobs and showcase your talents.
        </p>
        <div className="mt-1 text-center">
          <p className="text-base-content/60">Don't have an account? </p>
          <button className="btn rounded-md shadow-lg mt-1 border border-base-300 bg-cyan-600 hover:bg-cyan-700 w-full">
            <Link to="/signup">Sign Up</Link>
          </button>
        </div>
      </div>
      {/* right side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 ">
        <div className="w-full max-w-md space-y-8 border border-base-300 shadow-xl rounded-xl p-14 bg-base-100 border-cyan-600 ">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <h1 className="text-2xl font-bold text-base-content">
                Welcome Back
              </h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content">
                  Email
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className="w-full pl-10 bg-base-100 border-cyan-600 border  text-base-content font-size: 0.875rem h-10 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content">
                  Password
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 bg-base-100 border-cyan-600 border text-base-content font-size: 0.875rem h-10 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeClosed className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            {/* ReCAPTCHA */}
            <ReCaptcha onChange={setCaptchaValue} />

            <button
              type="submit"
              className="btn shadow-xl rounded-md bg-cyan-600 hover:bg-cyan-700 border border-base-300 w-full"
              disabled={isLoggingIn}
              onClick={handleSubmit}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
