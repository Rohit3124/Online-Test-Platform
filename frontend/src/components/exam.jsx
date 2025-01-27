import {
  Button,
  Label,
  Modal,
  TextInput,
  Datepicker,
  Table,
} from "flowbite-react";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import Question from "./question";
import { Link } from "react-router-dom";
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
});

const Exam = () => {
  const [openTestModal, setOpenTestModal] = useState(false);
  const [openQuestionModal, setOpenQuestionModal] = useState(false);
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
  });

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

  return (
    <div className="w-full">
      <div className="py-3">
        <Button className="mx-auto" onClick={() => setOpenTestModal(true)}>
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
                  <div>
                    <Label value="Start Time" />
                    <TextInput
                      placeholder="hh:mm aa"
                      className="w-52"
                      {...register("startTime")}
                    />
                    {errors.startTime && (
                      <span className="text-red-500 text-sm">
                        {errors.startTime.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <Label value="End Time" />
                    <TextInput
                      placeholder="hh:mm aa"
                      className="w-52"
                      {...register("endTime")}
                    />
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
      <div className="p-3">
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
                      <Button gradientMonochrome="info">View</Button>
                    </Table.Cell>
                    <Table.Cell>
                      <Link className="text-teal-500 hover:underline" to={""}>
                        <span>Edit</span>
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="font-medium text-red-500 hover:underline cursor-pointer">
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
    </div>
  );
};

export default Exam;
