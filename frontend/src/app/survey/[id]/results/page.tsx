"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface QuestionResult {
  id: string;
  question: string;
  results: Record<string, number>;
  totalResponses: number;
}

interface SurveyResult {
  title: string;
  questions: QuestionResult[];
}

interface UserAnswers {
  surveyId: string;
  title: string;
  answers: Record<string, string | string[]>;
}

const SurveyResultPage = () => {
  const params = useParams();
  const id = params?.id;
  const [results, setResults] = useState<SurveyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<UserAnswers | null>(null);

  useEffect(() => {
    const savedResults = localStorage.getItem(`survey_result_${id}`);
    if (savedResults) {
      setUserAnswers(JSON.parse(savedResults));
    }
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8008/survey/${id}/results`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error("Failed to fetch results");
        }
        setResults(data);
      } catch (error) {
        console.error("Error fetching results", error);
        toast.error("Failed to fetch survey results");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchResults();
    }
  }, [id]);

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading...</div>;
  }

  if (!results) {
    return (
      <div className="container mx-auto p-4 text-center">
        Results not available
      </div>
    );
  }
  console.log("userAnswers", userAnswers);
  console.log("results", results);
  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto mt-4 shadow-lg">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-6">{results.title}</h2>

          {userAnswers && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Your Answers</h3>
              {Object.entries(userAnswers.answers).map(
                ([questionId, answer]) => (
                  <div key={questionId} className="mb-4">
                    <p className="font-medium">
                      {
                        results.questions.find((q) => q.id === questionId)
                          ?.question
                      }
                    </p>
                    <p className="text-gray-600">
                      {Array.isArray(answer) ? answer.join(", ") : answer}
                    </p>
                  </div>
                )
              )}
            </div>
          )}

          <h3 className="text-xl font-semibold mb-4">Overall Results</h3>
          {results.questions.map((question, index) => (
            <div key={index} className="mb-6">
              <p className="font-medium mb-2">{question.question}</p>
              {Object.entries(question.results).map(([option, count]) => (
                <div key={option} className="mb-2">
                  <div className="flex justify-between mb-1">
                    <span>{option}</span>
                    <span>{count} responses</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-teal-600 h-2.5 rounded-full"
                      style={{
                        width: `${(count / question.totalResponses) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyResultPage;
