import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Eye,
  EyeClosed,
  Loader2,
  Lock,
  Mail,
  Megaphone,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signUp, isSigningUp } = useAuthStore();

  const validateForm = () => {
    console.log("Validating form data:", formData); // Test için ekledik
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters long");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    signUp({ ...formData });
  };

  return (
    <div className="min-h-screen grid bg-base-200 text-base-content lg:grid-cols-2">
      {/* Left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 border border-base-300 shadow-xl rounded-xl p-14 bg-base-100 border-cyan-600">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <h1 className="text-2xl font-bold text-base-content">
                Create Account
              </h1>
              <p className="text-base-content/60">
                Get started with your free account
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content">
                  Full Name
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 bg-base-100 border-cyan-600 border text-base-content font-size: 0.875rem h-10 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>

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
                  className="w-full pl-10 bg-base-100 border-cyan-600 border text-base-content font-size: 0.875rem h-10 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-cyan-600"
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

            <button
              type="submit"
              className="btn shadow-xl rounded-md bg-cyan-600 hover:bg-cyan-700 border border-base-300 w-full"
              disabled={isSigningUp}
              onClick={handleSubmit}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <Megaphone className="size-16 mb-3 text-cyan-600" />
        <h1 className="text-4xl font-bold text-base-content">
          Let Your Skills Meet the World
        </h1>
        <p className="text-base-content/60 mt-4">
          The easiest way to find jobs and showcase your talents.
        </p>
        <div className="mt-1 text-center">
          <p className="text-base-content/60">Already have an account? </p>
          <button className="btn rounded-md shadow-lg mt-1 border border-base-300 bg-cyan-600 hover:bg-cyan-700 w-full">
            <Link to="/login">Sign In</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
