/* eslint-disable react/prop-types */
import {
  Button,
  Label,
  Modal,
  TextInput,
  Datepicker,
  Textarea,
} from "flowbite-react";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";

const TestSchema = Joi.object({
  testName: Joi.string().required().messages({
    "string.base": "Test Name must be a string.",
    "string.empty": "Test Name is required.",
    "any.required": "Test Name is a required field.",
  }),
  testDate: Joi.date().required().messages({
    "date.base": "Test Date must be a valid date.",
    "any.required": "Test Date is required.",
  }),
  startTime: Joi.string().required().messages({
    "string.base": "Start Time must be a string.",
    "string.empty": "Start Time is required.",
    "any.required": "Start Time is a required field.",
  }),
  endTime: Joi.string().required().messages({
    "string.base": "End Time must be a string.",
    "string.empty": "End Time is required.",
    "any.required": "End Time is a required field.",
  }),
  totalMarks: Joi.number().required().messages({
    "number.base": "Total Marks must be a number.",
    "any.required": "Total Marks is required.",
  }),
  subject: Joi.array().items(Joi.string().required()).required().messages({
    "array.base": "Subject must be an array of strings.",
    "any.required": "Subject is required.",
  }),
  syllabus: Joi.string().required().messages({
    "string.base": "Syllabus must be a string.",
    "any.required": "Syllabus is required.",
  }),
});

const EditExamModal = ({ openEditTestModal, setOpenEditTestModal, test }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm({
    resolver: joiResolver(TestSchema),
  });

  useEffect(() => {
    if (openEditTestModal && test) {
      reset({
        testName: test.testName,
        testDate: new Date(test.testDate),
        totalMarks: test.totalMarks,
        startTime: test.startTime,
        endTime: test.endTime,
        subject: test.subject,
        syllabus: test.syllabus,
      });
    }
  }, [openEditTestModal, test, reset]);

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const res = await fetch(`/api/exam/updateExam/${test._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        alert("Failed to update the exam.");
      }
      setOpenEditTestModal(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong.");
    }
  };

  return (
    <Modal
      show={openEditTestModal}
      size="xl"
      popup
      onClose={() => setOpenEditTestModal(false)}
    >
      <Modal.Header />
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="text-2xl">
            Edit Exam Details
            <div>
              <Label value="Name" />
              <TextInput type="text" {...register("testName")} />
              {errors.testName && (
                <span className="text-red-500 text-sm">
                  {errors.testName.message}
                </span>
              )}
            </div>
            <div>
              <Label value="Subject" />
              <TextInput
                type="text"
                placeholder="Enter subjects separated by commas"
                {...register("subject", {
                  setValueAs: (value) =>
                    (value && typeof value === "string"
                      ? value.split(",")
                      : []
                    ).map((subject) => subject.trim()),
                })}
              />
              {errors.subject && (
                <span className="text-red-500 text-sm">
                  {errors.subject.message}
                </span>
              )}
            </div>
            <div>
              <Label value="Syllabus" />
              <Textarea
                type="text"
                placeholder="Enter syllabus"
                {...register("syllabus")}
              />
              {errors.syllabus && (
                <span className="text-red-500 text-sm">
                  {errors.syllabus.message}
                </span>
              )}
            </div>
            <div className="flex justify-between">
              <div>
                <Label value="Date" />
                <Controller
                  control={control}
                  name="testDate"
                  render={({ field }) => <Datepicker {...field} />}
                />
                {errors.testDate && (
                  <span className="text-red-500 text-sm">
                    {errors.testDate.message}
                  </span>
                )}
              </div>
              <div>
                <Label value="Total Marks" />
                <TextInput
                  className="w-52"
                  type="number"
                  {...register("totalMarks")}
                />
                {errors.totalMarks && (
                  <span className="text-red-500 text-sm">
                    {errors.totalMarks.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="w-52">
                <Label value="Start Time" />
                <div className="relative">
                  <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="time"
                    {...register("startTime")}
                    className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    defaultValue="00:00"
                    required
                  />
                </div>
                {errors.startTime && (
                  <span className="text-red-500 text-sm">
                    {errors.startTime.message}
                  </span>
                )}
              </div>
              <div className="w-52">
                <Label value="End Time" />
                <div className="relative">
                  <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="time"
                    {...register("endTime")}
                    className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    defaultValue="00:00"
                    required
                  />
                </div>
                {errors.endTime && (
                  <span className="text-red-500 text-sm">
                    {errors.endTime.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-5">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditExamModal;
