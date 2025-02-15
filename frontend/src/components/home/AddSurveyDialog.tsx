import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SurveyContext } from "@/providers/SurveyProvider";
import { IoMdAdd } from "react-icons/io";

import React, { useContext, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { toast } from "react-toastify";
import { ScrollArea } from "../ui/scroll-area";

type QuestionType = "multiple" | "single" | "";

interface Question {
  question: string;
  type: QuestionType;
  options: string[];
}

const AddSurveyDialog = () => {
  const [title, setTitle] = useState("");
  const { open, setOpen } = useContext(SurveyContext);
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", type: "", options: [] },
  ]);

  const questionTypes = [
    { value: "multiple", label: "Multiple Choice" },
    { value: "single", label: "Single Choice" },
  ];

  const handleQuestionChange = (
    index: number,
    field: keyof Question,
    value: string
  ) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [field]: value,
      };
      return updatedQuestions;
    });
  };

  const addOption = (questionIndex: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, index) =>
        index === questionIndex
          ? { ...question, options: [...(question.options || []), ""] }
          : question
      )
    );
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { question: "", type: "", options: [] },
    ]);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Survey title is required");
      return;
    }
    const validQuestions = questions.filter((q) => q.question.trim() !== "");
    if (validQuestions.length === 0) {
      toast.error("At least one question is required");
      return;
    }
    const surveyData = {
      title: title,
      questions: validQuestions.map((q) => ({
        question: q.question,
        type: q.type,
        options: q.options,
      })),
    };

    try {
      const res = await fetch("http://localhost:8008/survey/", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(surveyData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Survey created successfully");
        setOpen(false);
        setTitle("");
        setQuestions([{ question: "", type: "", options: [] }]);
      } else {
        console.error("Error creating survey", data);
        toast.error(data.message || "Failed to create survey");
      }
    } catch (error) {
      console.log("Error", error);
      toast.error("Failed to create survey");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex  justify-center gap-2 border  hover:border-cyan-500 text-[16px] rounded-sm py-6 px-4"
        >
          <IoMdAdd className="text-emerald-500 text-xl" />
          Add Survey
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] shadow-2xl">
        <ScrollArea className="h-[50vh]">
          <DialogHeader>
            <DialogTitle>Create new survey</DialogTitle>
            <DialogDescription>Create your own survey free</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 w-[380px] mx-auto pt-10">
            <Input
              placeholder="Enter survey title"
              value={title}
              className="border"
              onChange={(e) => setTitle(e.target.value)}
            />
            {questions.map((q, questionIndex) => (
              <div key={questionIndex}>
                <Input
                  placeholder="Enter your question"
                  className=" border"
                  value={q.question}
                  onChange={(e) =>
                    handleQuestionChange(
                      questionIndex,
                      "question",
                      e.target.value
                    )
                  }
                />

                <Select
                  value={q.type}
                  onValueChange={(value) =>
                    handleQuestionChange(questionIndex, "type", value)
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select question type"></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {questionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(q.type === "multiple" || q.type === "single") && (
                  <div className="space-y-2">
                    {Array.isArray(q.options) &&
                      q.options.map((option, optionIndex) => (
                        <Input
                          key={optionIndex}
                          className="my-4"
                          placeholder={`Option${optionIndex + 1}`}
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(
                              questionIndex,
                              optionIndex,
                              e.target.value
                            )
                          }
                        />
                      ))}
                    <Button
                      variant="outline"
                      className="bg-emerald-700 text-white mt-8"
                      size="sm"
                      onClick={() => addOption(questionIndex)}
                    >
                      Add option
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <DialogFooter className="flex gap-3 items-center mt-8 pr-20">
            <Button
              variant="outline"
              className="border border-emerald-600"
              onClick={addQuestion}
            >
              Add question
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="bg-emerald-700 text-white"
            >
              Submit Survey
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddSurveyDialog;
