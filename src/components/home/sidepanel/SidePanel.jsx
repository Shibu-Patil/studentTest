// sidepanel/SidePanel.jsx
import React from 'react'
import { useSelector } from 'react-redux'

const SidePanel = () => {
  const { allAnswers,questions } = useSelector((state) => state.student)
//   console.log(allAnswers);
  

  const totalQuestions = 25
  const answered = allAnswers.filter((q) => q.answer).length
  const notAnswered = totalQuestions - answered
  const left = totalQuestions - allAnswers.length

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Questions Status</h2>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span>Total Questions:</span>
          <span className="font-semibold">{totalQuestions}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Answered:</span>
          <span className="font-semibold text-green-600">{answered}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Not Answered:</span>
          <span className="font-semibold text-red-600">{notAnswered}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Left:</span>
          <span className="font-semibold text-yellow-600">{left}</span>
        </div>
      </div>

      <h3 className="text-lg font-semibold mt-6">Question List</h3>
<div className="space-y-1 max-h-96 overflow-y-auto">
  {questions.map((q, idx) => {
    const userAnswer = allAnswers.find(a => a.questionId === q.questionId);
    const isAnswered = userAnswer && userAnswer.answer?.trim() !== "";

    return (
      <div
        key={q.questionId}
        className={`p-2 rounded-md text-center cursor-pointer ${
          isAnswered
            ? 'bg-green-200'
            : userAnswer
            ? 'bg-red-200'
            : 'bg-yellow-200'
        }`}
      >
        Q{idx + 1}
      </div>
    );
  })}
</div>

    </div>
  )
}

export default SidePanel
