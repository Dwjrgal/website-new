"use client";
import React, { useContext } from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Button } from "../ui/button";
import { IoMdAdd } from "react-icons/io";
import { ScrollArea } from "../ui/scroll-area";
import { SurveyContext } from "@/providers/SurveyProvider";
import AddSurveyDialog from "./AddSurveyDialog";
import Link from "next/link";

const SurveyListTable = () => {
  const { surveys, handleDelete } = useContext(SurveyContext);
  return (
    <Card className="w-[800px] max-w-4xl shadow-xl border">
      <ScrollArea className="h-[60vh]">
        <CardHeader className="my-6">
          <CardTitle className="text-xl">All Surveys</CardTitle>
          <AddSurveyDialog />
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {surveys?.map((survey) => (
              <TableRow key={survey.id}>
                <TableCell className="font-semibold">{survey.title}</TableCell>
                <TableCell className="">
                  {survey.questions.length || 0}
                </TableCell>
                <TableCell>
                  {survey.createdAt
                    ? new Date(survey.createdAt).toLocaleDateString()
                    : "Invalid date"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-3">
                    <Link href={`survey/${survey.id}`} passHref>
                      <Button
                        className="border border-cyan-500"
                        variant="outline"
                      >
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(survey.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
};

export default SurveyListTable;
