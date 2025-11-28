import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestions, addAnswer, submitAllResponses } from "../../../slice/slice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AllQuestions = () => {
  const dispatch = useDispatch();
  const { questions, allAnswers, loading, error, loggedUser } = useSelector(
    (state) => state.student
  );

const navigate=useNavigate()
  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  if (loading) return <p>Loading questions...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!questions.length) return <p>No questions available.</p>;

  const handleAnswer = (questionId, answer) => {
    dispatch(addAnswer({ questionId, answer }));
  };

  const handleSubmitAll = async () => {
    if (!loggedUser?.id) {
      toast.error("Student not logged in!");
      return;
    }

    try {
      const resultAction = await dispatch(submitAllResponses());
      if (submitAllResponses.fulfilled.match(resultAction)) {
        toast.success("All responses submitted successfully!");
        navigate("/")
      } else {
        toast.error(resultAction.payload || "Submission failed!");
      }
    } catch (err) {
      toast.error("Server error!");
    }
  };

  return (
    <div className="space-y-6">
      {questions.map((q, index) => {
        const userAnswer = allAnswers.find(a => a.questionId === q.questionId);
        const isAnswered = userAnswer && userAnswer.answer?.trim() !== "";

        return (
          <div key={q.questionId} className="p-4 border rounded-md shadow-sm bg-white">
            <p className="font-semibold">Q{index + 1}: {q.questionText}</p>

            {q.type === "mcq" ? (
              <ul className="mt-2 space-y-1 list-disc list-inside">
                {q.options.map((opt, idx) => (
                  <li key={idx}>
                    <label className={`cursor-pointer ${userAnswer?.answer === opt ? "text-green-600 font-bold" : ""}`}>
                      <input
                        type="radio"
                        name={q.questionId}
                        value={opt}
                        checked={userAnswer?.answer === opt}
                        onChange={() => handleAnswer(q.questionId, opt)}
                        className="mr-2"
                      />
                      {opt}
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <textarea
                value={userAnswer?.answer || ""}
                onChange={(e) => handleAnswer(q.questionId, e.target.value)}
                className={`mt-2 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 ${
                  !isAnswered ? "border-red-500" : ""
                }`}
                placeholder="Type your answer here"
                rows={4}
              />
            )}

            {!isAnswered && q.type !== "mcq" && (
              <p className="mt-1 text-red-500 text-sm">This question is unanswered!</p>
            )}
          </div>
        );
      })}

      <button
        onClick={handleSubmitAll}
        className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-semibold p-3 rounded-md transition-colors"
      >
        Submit All Answers
      </button>
    </div>
  );
};

export default AllQuestions;
