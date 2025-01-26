import PropTypes from "prop-types";
import {
  Button,
  Label,
  Modal,
  TextInput,
  Datepicker,
  Textarea,
} from "flowbite-react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
const QuestionSchema = Joi.object({
  question: Joi.string().required().messages({
    "string.base": "Question must be a string.",
    "string.empty": "Question is required.",
    "any.required": "Question is required field.",
  }),
  options: Joi.array().items(Joi.string()).length(4).required().messages({
    "array.base": "Options must be an array.",
    "array.min": "There must be exactly 4 options.",
    "array.length": "There must be exactly 4 options.",
    "any.required": "Options are required.",
  }),
  correctOption: Joi.array()
    .items(Joi.string())
    .min(1)
    .max(4)
    .required()
    .messages({
      "array.base": "Correct option(s) must be an array.",
      "array.min": "There must be at least one correct option.",
      "array.max": "There can be at most 4 correct options.",
      "any.required": "Correct option(s) are required.",
    }),
  negativeMarks: Joi.number().min(0).optional().messages({
    "number.base": "Negative marks must be a number.",
    "number.min": "Negative marks cannot be less than 0.",
  }),
});
const Question = ({ openQuestionModal, setOpenQuestionModal }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm({
    resolver: joiResolver(QuestionSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/question/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const responseData = await res.json();
      if (!res.ok) {
        return alert("Something went wrong");
      }
      setOpenQuestionModal(false);
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert(error.message || "Something went wrong. Please try again later.");
    }
  };

  return (
    <Modal
      show={openQuestionModal}
      size="xl"
      popup
      onClose={() => setOpenQuestionModal(false)}
    >
      <Modal.Header />
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="text-2xl mb-5">Question Details</div>

          <div className="mb-4">
            <Label value="Question" />
            <Textarea
              type="text"
              placeholder="Enter the question"
              rows={3}
              {...register("question")}
            />
            {errors.question && (
              <span className="text-red-500 text-sm">
                {errors.question.message}
              </span>
            )}
          </div>

          <div className="mb-4">
            <Label value="Options" />
            <Textarea
              placeholder="Enter options, separated by commas"
              rows={2}
              {...register("options", {
                setValueAs: (value) =>
                  value.split(",").map((option) => option.trim()),
              })}
            />
            {errors.options && (
              <span className="text-red-500 text-sm">
                {errors.options.message}
              </span>
            )}
          </div>

          <div className="mb-4">
            <Label value="Correct Option" />
            <TextInput
              type="text"
              placeholder="Enter the correct option(s), separated by commas"
              {...register("correctOption", {
                setValueAs: (value) =>
                  value
                    .split(",")
                    .map((option) => option.trim())
                    .filter((option) => option !== ""),
              })}
            />
            {errors.correctOption && (
              <span className="text-red-500 text-sm">
                {errors.correctOption.message}
              </span>
            )}
          </div>

          <div className="mb-4">
            <Label value="Negative Marks" />
            <TextInput
              type="number"
              placeholder="Enter negative marks"
              defaultValue={0}
              {...register("negativeMarks", { valueAsNumber: true })}
            />
            {errors.negativeMarks && (
              <span className="text-red-500 text-sm">
                {errors.negativeMarks.message}
              </span>
            )}
          </div>

          <div className="flex justify-center mt-5">
            <Button type="submit" className="mr-2">
              Save Question
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};
Question.propTypes = {
  openQuestionModal: PropTypes.bool.isRequired,
  setOpenQuestionModal: PropTypes.func.isRequired,
};
export default Question;
