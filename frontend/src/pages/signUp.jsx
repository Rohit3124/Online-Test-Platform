import { Button, Label, TextInput, Spinner } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { currentUserContext } from "../context/userContext";
import OAuth from "../components/OAuth";

const schema = Joi.object({
  username: Joi.string().min(3).max(255).required().empty("").messages({
    "string.base": "Username must be a text value.",
    "string.min": "Username must be at least 3 characters long.",
    "string.max": "Username cannot exceed 255 characters.",
    "any.required": "Username is required.",
  }),
  email: Joi.string().required().empty("").messages({
    "string.base": "Email must be a text value.",
    "string.email": "Please enter a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(6).max(100).required().empty("").messages({
    "string.base": "Password must be a text value.",
    "string.min": "Password must be at least 6 characters long.",
    "string.max": "Password cannot exceed 100 characters.",
    "any.required": "Password is required.",
  }),
});

const SignUp = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(currentUserContext);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: joiResolver(schema),
  });
  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const responseData = await res.json();
      if (!res.ok) {
        return alert("something went wrong");
      }
      setCurrentUser(responseData.user);
      responseData.isAdmin
        ? navigate("/admin-dashboard?tab=exam")
        : navigate("/student?tab=exams");
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert(error.message || "Something went wrong. Please try again later.");
    }
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-4xl mx-auto flex-col md:flex-row md:items-center gap-20">
        <div className="hidden md:block flex-1 ">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/student-giving-online-exam-illustration-download-in-svg-png-gif-file-formats--test-question-paper-male-teacher-working-man-learning-pack-school-education-illustrations-2283970.png?f=webp"
            alt=""
          />
        </div>
        <div className="flex-1 ">
          <div className="text-center">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text  text-3xl">
              JEE/NEET Test Platform
            </span>
            <p className="text-lg mt-5  mb-8 font-normal">
              Sign up with your email, password, or Google account.
            </p>
          </div>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <Label value="Your username" />
              <TextInput
                type="text"
                placeholder="Username"
                {...register("username")}
              />
            </div>
            {errors.username && (
              <p className="text-red-500">{errors.username.message}</p>
            )}
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="Password"
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
