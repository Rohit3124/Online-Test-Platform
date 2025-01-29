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
  startTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/)
    .required()
    .messages({
      "string.base": "Start Time must be a string.",
      "string.empty": "Start Time is required.",
      "any.required": "Start Time is a required field.",
      "string.pattern.base":
        "startTime must be in the format HH:mm (24-hour time)",
    }),
  endTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/)
    .required()
    .messages({
      "string.base": "End Time must be a string.",
      "string.empty": "End Time is required.",
      "any.required": "End Time is a required field.",
      "string.pattern.base":
        "startTime must be in the format HH:mm (24-hour time)",
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
                <TextInput placeholder="hh:mm" {...register("startTime")} />
                {errors.startTime && (
                  <span className="text-red-500 text-sm">
                    {errors.startTime.message}
                  </span>
                )}
              </div>
              <div className="w-52">
                <Label value="End Time" />
                <TextInput placeholder="hh:mm" {...register("endTime")} />
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
