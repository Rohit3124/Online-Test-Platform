import { Button, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
const SignUp = () => {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-4xl mx-auto flex-col md:flex-row md:items-center gap-20">
        <div className="flex-1 ">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/student-giving-online-exam-illustration-download-in-svg-png-gif-file-formats--test-question-paper-male-teacher-working-man-learning-pack-school-education-illustrations-2283970.png?f=webp"
            alt=""
          />
        </div>
        <div className="flex-1 ">
          <div className="text-center">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text  text-3xl">
              JEE/NEET Test Plateform
            </span>
            <p className="text-lg mt-5  mb-8 font-normal">
              Sign up with your email, password, or Google account.
            </p>
          </div>
          <form className="flex flex-col gap-4">
            <div>
              <Label value="Your username" />
              <TextInput type="text" placeholder="Username" id="username" />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput type="password" placeholder="Password" id="password" />
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit">
              Sign Up
            </Button>
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
