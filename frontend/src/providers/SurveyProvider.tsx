"use client";
import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export interface SurveyType {
  id: string;
  title: string;
  questions: {
    id: string;
    question: string;
    type: string;
    options: string[];
    responses: string | null;
    createdAt: string;
  }[];
  createdAt: string;
}
interface SurveyContextType {
  fetchSurveys: () => void;
  surveys: SurveyType[];

  setSurveys: React.Dispatch<React.SetStateAction<SurveyType[]>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: (surveyId: string) => void;
}

export const SurveyContext = createContext<SurveyContextType>({
  surveys: [],
  setSurveys: () => {},
  open: false,
  setOpen: () => {},
  fetchSurveys: () => {},
  handleDelete: () => {},
});

export const SurveyProvider = ({ children }: { children: React.ReactNode }) => {
  const [surveys, setSurveys] = useState<SurveyType[]>([]);

  const [open, setOpen] = useState(false);

  const fetchSurveys = async () => {
    try {
      const res = await fetch("http://localhost:8008/survey/");
      const data = await res.json();
      console.log("fetched surveys data", data);
      if (res.ok) {
        setSurveys(data);
      } else {
        toast.error("Failed to get surveys data");
      }
    } catch (error) {
      console.log("Error fetching surveys:", error);
      toast.error("Failed to fetch surveys");
    }
  };

  console.log("survyes", surveys);

  useEffect(() => {
    fetchSurveys();
  }, [surveys]);

  const handleDelete = async (surveyId: string) => {
    try {
      const res = await fetch(`http://localhost:8008/survey/${surveyId}`, {
        method: "Delete",
      });
      if (!res.ok) {
        throw new Error("Failed to delete survey");
      }
      setSurveys((prevSurveys) =>
        prevSurveys.filter((survey) => survey.id !== surveyId)
      );
      toast.success("Survey successfully deleted");
    } catch (error) {
      console.log("Error deleting survey", error);
      toast.error("Failed to delete survey");
    }
  };
  return (
    <SurveyContext.Provider
      value={{ surveys, setSurveys, fetchSurveys, handleDelete, open, setOpen }}
    >
      {children}
    </SurveyContext.Provider>
  );
};
