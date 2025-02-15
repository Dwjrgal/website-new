"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type QuestionType = "multiple" | "single";

interface Question {
  id: string;
  question: string;
  type: QuestionType;
  options: string[];
}

interface Survey {
  id: string;
  title: string;
  questions: Question[];
}

const SurveyDetailPage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string | undefined;

  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [survey, setSurvey] = useState<Survey>();

  useEffect(() => {
    if (id) {
      fetchOneSurvey();
    }
  }, [id]);

  const fetchOneSurvey = async () => {
    try {
      const response = await fetch(`http://localhost:8008/survey/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch survey details");
      }

      const data: Survey = await response.json();

      if (data && Array.isArray(data.questions)) {
        setSurvey(data);

        const initialAnswers: Record<string, string | string[]> = {};
        data.questions.forEach((q) => {
          initialAnswers[q.id] = q.type === "multiple" ? [] : "";
        });

        setAnswers(initialAnswers);
      } else {
        toast.error("Invalid survey data");
      }
    } catch (error) {
      console.error("Error fetching survey:", error);
      toast.error("Failed to fetch survey details");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, value: string) => {
    const question = survey?.questions[currentQuestion];
    if (!question) return;

    if (question.type === "multiple") {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: Array.isArray(prev[questionId])
          ? (prev[questionId] as string[]).includes(value)
            ? (prev[questionId] as string[]).filter((v) => v !== value)
            : [...(prev[questionId] as string[]), value]
          : [value],
      }));
    } else {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: value,
      }));
    }
  };

  const handleNext = () => {
    if (!survey || !answers[survey.questions[currentQuestion].id]) {
      toast.error("Please answer the question before proceeding");
      return;
    }
    setCurrentQuestion((prev) => prev + 1);
  };
  const handleSubmit = async () => {
    if (!survey || !answers[survey.questions[currentQuestion].id]) {
      toast.error("Please answer the question before submitting");
      return;
    }

    try {
      const surveyResult = {
        surveyId: id,
        title: survey.title,
        answers: answers,
      };
      localStorage.setItem(`survey_result_${id}`, JSON.stringify(surveyResult));
      const response = await fetch(
        `http://localhost:8008/survey/${id}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers }),
        }
      );

      if (response.ok) {
        toast.success("Survey submitted successfully!");
        window.location.href = `/survey/${id}/results`;
      } else {
        toast.error("Failed to submit survey");
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      toast.error("Failed to submit survey");
    }
  };
  const handleSurveyUpdate = async () => {
    const response = await fetch(`http://localhost:8008/survey/${id}`);
    const data = await response.json();
    if (response.ok) {
      setSurvey(data);
    }
  };
  console.log("answers", answers);

  return (
    <div className="container mx-auto p-4 mt-20">
      <Card className="max-w-2xl mx-auto shadow-lg mt-4">
        <CardContent>
          <h2 className="text-2xl pt-3">{survey?.title || "Survey Details"}</h2>
          {loading && <p>Loading...</p>}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-4">
              Question {currentQuestion + 1}
            </div>
          </div>
          <h3 className="text-lg mb-4">
            {survey?.questions[currentQuestion].question}
          </h3>
          {survey &&
            survey.questions.length > currentQuestion &&
            (survey?.questions[currentQuestion].type === "single" ? (
              <RadioGroup
                value={
                  (answers[survey.questions[currentQuestion].id] as string) ||
                  ""
                }
                onValueChange={(value) =>
                  handleAnswer(survey.questions[currentQuestion].id, value)
                }
                className="space-y-2"
              >
                {survey.questions[currentQuestion].options.map(
                  (option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <label
                        htmlFor={`option-${index}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {" "}
                        {option}
                      </label>
                    </div>
                  )
                )}
              </RadioGroup>
            ) : (
              <div className="space-y-2">
                {survey.questions[currentQuestion].options.map(
                  (option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`option-${index}`}
                        checked={
                          Array.isArray(
                            answers[survey.questions[currentQuestion].id]
                          ) &&
                          (
                            answers[
                              survey.questions[currentQuestion].id
                            ] as string[]
                          ).includes(option)
                        }
                        onCheckedChange={(checked) =>
                          handleAnswer(
                            survey.questions[currentQuestion].id,
                            option
                          )
                        }
                      />
                      <label
                        htmlFor={`option-${index}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor=not-allowed peer-disabled:opacity-70"
                      >
                        {option}
                      </label>
                    </div>
                  )
                )}
              </div>
            ))}
          <div className="flex justify-end mt-6">
            {survey && currentQuestion < survey.questions.length - 1 ? (
              <Button onClick={handleNext} className="bg-teal-600">
                Next Question
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-teal-700">
                Submit Survey
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyDetailPage;
