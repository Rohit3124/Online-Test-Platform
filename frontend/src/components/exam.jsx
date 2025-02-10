import {
  Button,
  Label,
  Modal,
  TextInput,
  Datepicker,
  Table,
  Textarea,
} from "flowbite-react";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import Question from "./createQuestions";
import { Link } from "react-router-dom";
import EditExamModal from "./editExamModal";
import { HiOutlineExclamationCircle } from "react-icons/hi";

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

const Exam = () => {
  const [openTestModal, setOpenTestModal] = useState(false);
  const [openQuestionModal, setOpenQuestionModal] = useState(false);
  const [openEditTestModal, setOpenEditTestModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [openDeleteTestModal, setOpenDeleteTestModal] = useState(false);
  const [testId, setTestId] = useState("");
  const [exams, setExams] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm({
    resolver: joiResolver(TestSchema),
  });
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch(`/api/exam/getExams`);
        if (!res.ok) {
          return alert("Failed to fetch exams");
        }
        const data = await res.json();
        setExams(data);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchExams();
  }, [openEditTestModal, openDeleteTestModal, openTestModal, selectedTest]);

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      testDate: formatDate(data.testDate),
    };

    try {
      const res = await fetch("/api/exam/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });
      const responseData = await res.json();
      if (!res.ok) {
        return alert("something went wrong");
      }
      setTestId(responseData.testId);
      reset();
      setOpenTestModal(false);
      setOpenQuestionModal(true);
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert(error.message || "Something went wrong. Please try again later.");
    }
  };
  const handleDeleteModal = (exam) => {
    setOpenDeleteTestModal(true);
    setSelectedTest(exam);
  };

  const handleDeleteTest = async () => {
    setOpenDeleteTestModal(false);
    try {
      const res = await fetch(`/api/exam/deleteExam/${selectedTest._id}`, {
        method: "DELETE",
      });
      await res.json();
      setSelectedTest(null);
    } catch (error) {
      console.log(error);
      alert(error.message || "Something went wrong. Please try again later.");
    }
  };
  return (
    <div className="w-full ml-3">
      <div className="py-3">
        <Button className="" onClick={() => setOpenTestModal(true)}>
          Add Exam
        </Button>

        <Modal
          show={openTestModal}
          size="xl"
          popup
          onClose={() => setOpenTestModal(false)}
        >
          <Modal.Header />
          <Modal.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="text-2xl">
                Exam Details
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
                      type="text"
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
                  {isSubmitting ? "Submitting..." : "Save and Add Questions"}
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
        <Question
          openQuestionModal={openQuestionModal}
          setOpenQuestionModal={setOpenQuestionModal}
          testId={testId}
        />
      </div>
      <div className="">
        <div className="text-4xl mb-4">Exams</div>
        {exams.length > 0 ? (
          <div className="overflow-x-auto">
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Exam Name</Table.HeadCell>
                <Table.HeadCell>Exam Date</Table.HeadCell>
                <Table.HeadCell>Start Time</Table.HeadCell>
                <Table.HeadCell>View Exam</Table.HeadCell>
                <Table.HeadCell>Edit</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {exams.map((exam, index) => (
                  <Table.Row
                    key={index}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>{exam.testName}</Table.Cell>
                    <Table.Cell>
                      {new Date(exam.testDate).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>{exam.startTime}</Table.Cell>
                    <Table.Cell>
                      <Link to={`/admin-dashboard/exam/${exam._id}`}>
                        <Button gradientMonochrome="info">View</Button>
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link className="text-teal-500 hover:underline" to={""}>
                        <span
                          onClick={() => {
                            setSelectedTest(exam);
                            setOpenEditTestModal(true);
                          }}
                        >
                          Edit
                        </span>
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        className="font-medium text-red-500 hover:underline cursor-pointer"
                        onClick={() => handleDeleteModal(exam)}
                      >
                        Delete
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        ) : (
          <div className="text-2xl">No exams available</div>
        )}
      </div>
      <EditExamModal
        openEditTestModal={openEditTestModal}
        setOpenEditTestModal={setOpenEditTestModal}
        test={selectedTest}
      />
      <Modal
        show={openDeleteTestModal}
        size="md"
        onClose={() => setOpenDeleteTestModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this exam?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteTest}>
                {"Yes, I'm sure"}
              </Button>
              <Button
                color="gray"
                onClick={() => setOpenDeleteTestModal(false)}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Exam;
