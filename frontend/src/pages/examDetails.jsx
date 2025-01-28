import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QuestionComponent from "../components/question";
import { Modal, Label, TextInput, Textarea, Button } from "flowbite-react";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { useForm } from "react-hook-form";
import { HiOutlineExclamationCircle } from "react-icons/hi";

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
  marks: Joi.number().min(0).required().messages({
    "number.base": "Marks must be a number.",
    "number.min": "Marks cannot be less than 0.",
    "any.required": "Correct option(s) are required.",
  }),
  negativeMarks: Joi.number().min(0).optional().messages({
    "number.base": "Negative marks must be a number.",
    "number.min": "Negative marks cannot be less than 0.",
  }),
});

const ExamDetails = () => {
  const [questions, setQuestions] = useState([]);
  const [openEditQuestionModal, setOpenEditQuestionModal] = useState(false);
  const [openDeleteQuestionModal, setOpenDeleteQuestionModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const { testId } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: joiResolver(QuestionSchema),
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `/api/question/getQuestions?testId=${testId}`
        );
        if (!response.ok) {
          alert("Failed to fetch questions");
          return;
        }
        const questionsData = await response.json();
        setQuestions(questionsData);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [testId, openEditQuestionModal, openDeleteQuestionModal]);

  const openEditModal = (question) => {
    setSelectedQuestion(question);
    reset({
      question: question.question,
      options: question.options.join(", "),
      correctOption: question.correctOption.join(", "),
      marks: question.marks,
      negativeMarks: question.negativeMarks || 0,
    });
    setOpenEditQuestionModal(true);
  };
  const OpenDeleteModal = (question) => {
    setSelectedQuestion(question);
    setOpenDeleteQuestionModal(true);
  };
  const onSubmit = async (data) => {
    setOpenEditQuestionModal(false);
    const updatedData = {
      ...data,
      testId,
    };
    try {
      const res = await fetch(
        `/api/question/updateQuestion/${selectedQuestion._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );
      const responseData = await res.json();
      console.log(responseData);
    } catch (error) {
      console.error("Error during update", error);
      alert(error.message || "Something went wrong. Please try again later.");
    }
  };
  const handleDeleteQuestion = async () => {
    setOpenDeleteQuestionModal(false);
    try {
      const res = await fetch(
        `/api/question/deleteQuestion/${selectedQuestion._id}`,
        {
          method: "DELETE",
        }
      );
      const responseData = await res.json();
    } catch (error) {
      console.log(error);
      alert(error.message || "Something went wrong. Please try again later.");
    }
  };
  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Exam Details</h1>
          <button
            className="bg-gray-700 text-white py-2 px-4 rounded-lg"
            onClick={() => navigate("/admin-dashboard")}
          >
            Go to Dashboard
          </button>
        </div>
        {questions.length > 0 ? (
          <div className="flex flex-col gap-6">
            {questions.map((question, index) => (
              <div
                key={question._id}
                className="flex flex-col items-center justify-center border p-4 rounded-lg"
              >
                <QuestionComponent
                  questionDetails={{ ...question, index }}
                  disableOptions={true}
                />

                <div className="max-w-sm w-full flex justify-between mt-4">
                  <span
                    className="text-teal-500 hover:underline cursor-pointer"
                    onClick={() => openEditModal(question)}
                  >
                    Edit
                  </span>
                  <span
                    className="font-medium text-red-500 hover:underline cursor-pointer"
                    onClick={() => OpenDeleteModal(question)}
                  >
                    Delete
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No questions available for this test.</p>
        )}
      </div>

      <Modal
        show={openEditQuestionModal}
        size="xl"
        popup
        onClose={() => setOpenEditQuestionModal(false)}
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
                    (value && typeof value === "string"
                      ? value.split(",")
                      : []
                    ).map((option) => option.trim()),
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
                    (value && typeof value === "string" ? value.split(",") : [])
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
            <div className="flex justify-between">
              <div className="mb-4 w-52">
                <Label value="Marks" />
                <TextInput
                  type="number"
                  placeholder="Enter marks"
                  defaultValue={0}
                  {...register("marks", { valueAsNumber: true })}
                />
                {errors.marks && (
                  <span className="text-red-500 text-sm">
                    {errors.marks.message}
                  </span>
                )}
              </div>
              <div className="mb-4 w-52">
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
            </div>
            <div className="flex justify-center mt-5">
              <Button type="submit" className="mr-2">
                Update
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <Modal
        show={openDeleteQuestionModal}
        size="md"
        onClose={() => setOpenDeleteQuestionModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this question?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteQuestion}>
                {"Yes, I'm sure"}
              </Button>
              <Button
                color="gray"
                onClick={() => setOpenDeleteQuestionModal(false)}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ExamDetails;
