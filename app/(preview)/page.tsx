"use client";

import { useState } from "react";
import { experimental_useObject } from "ai/react";
import { questionsSchema } from "@/lib/schemas";
import { z } from "zod";
import { toast } from "sonner";
import { FileUp, Plus, Loader2, LinkedinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Quiz from "@/components/quiz";
import { Link } from "@/components/ui/link";
import NextLink from "next/link";
import { generateQuizTitle } from "./actions";
import { AnimatePresence, motion } from "framer-motion";
import { VercelIcon, GitIcon } from "@/components/icons";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export default function ChatWithFiles() {
  const [files, setFiles] = useState<File[]>([]);
  const [questions, setQuestions] = useState<z.infer<typeof questionsSchema>>(
    [],
  );
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState<string>();

  const {
    submit,
    object: partialQuestions,
    isLoading,
  } = experimental_useObject({
    api: "/api/generate-quiz",
    schema: questionsSchema,
    initialValue: undefined,
    onError: (error) => {
      toast.error("Failed to generate quiz. Please try again.");
      setFiles([]);
    },
    onFinish: ({ object }) => {
      setQuestions(object ?? []);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari && isDragging) {
      toast.error(
        "Safari does not support drag & drop. Please use the file picker.",
      );
      return;
    }

    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf" && file.size <= 5 * 1024 * 1024,
    );
    console.log(validFiles);

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Only PDF files under 5MB are allowed.");
    }

    setFiles(validFiles);
  };

  const encodeFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmitWithFiles = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const encodedFiles = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        type: file.type,
        data: await encodeFileAsBase64(file),
      })),
    );
    submit({ files: encodedFiles });
    const generatedTitle = await generateQuizTitle(encodedFiles[0].name);
    setTitle(generatedTitle);
  };

  const clearPDF = () => {
    setFiles([]);
    setQuestions([]);
  };

  const progress = partialQuestions ? (partialQuestions.length / 10) * 100 : 0;

  if (questions.length === 10) {
    return (
      <Quiz title={title ?? "Quiz"} questions={questions} clearPDF={clearPDF} />
    );
  }

  return (
    <BackgroundBeamsWithCollision className="h-[100dvh] overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full p-4 md:p-8">
        <Card className="w-full max-w-md border border-purple-200/20 bg-white/10 dark:border-white/10 dark:bg-black/10 backdrop-blur-xl shadow-2xl rounded-xl">
          <CardHeader className="text-center space-y-6">
            <div className="mx-auto flex items-center justify-center space-x-2 text-purple-700 dark:text-purple-300">
              <div className="rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-sm p-2">
                <FileUp className="h-6 w-6" />
              </div>
              <Plus className="h-4 w-4" />
              <div className="rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-sm p-2">
                <Loader2 className="h-6 w-6" />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold">
                Heroic PDF Quiz Generator
              </CardTitle>
              <CardDescription className="text-base">
                Upload a PDF to generate an interactive quiz based on its content
                using the <Link href="https://sdk.vercel.ai">AI SDK</Link> and{" "}
                <Link href="https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai">
                  Google&apos;s Gemini 2.0 Flash Experiment
                </Link>
                .
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitWithFiles} className="space-y-4">
              <div
                className={`relative flex flex-col items-center justify-center border-2 border-dashed border-purple-300/30 dark:border-white/10 rounded-lg p-6 transition-colors hover:border-purple-400/40 dark:hover:border-white/20 bg-white/5 dark:bg-white/5 backdrop-blur-sm`}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="application/pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <FileUp className="h-8 w-8 mb-2 text-foreground" />
                <p className="text-sm text-foreground text-center">
                  {files.length > 0 ? (
                    <span className="font-medium text-foreground">
                      {files[0].name}
                    </span>
                  ) : (
                    <span>Drop your PDF here or click to browse.</span>
                  )}
                </p>
              </div>
              <Button
                type="submit"
                className="w-full bg-purple-200/20 dark:bg-white/10 backdrop-blur-sm hover:bg-purple-300/30 dark:hover:bg-white/20 text-purple-900 dark:text-foreground border border-purple-200/30 dark:border-white/10"
                disabled={files.length === 0}
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-foreground" />
                    <span>Generating Quiz...</span>
                  </span>
                ) : (
                  "Generate Quiz"
                )}
              </Button>
            </form>
          </CardContent>
          {isLoading && (
            <CardFooter className="flex flex-col space-y-4 border-t border-white/10">
              <div className="w-full space-y-1">
                <div className="flex justify-between text-sm text-foreground">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-white/10 dark:bg-white/5" />
              </div>
              <div className="w-full space-y-2">
                <div className="grid grid-cols-6 sm:grid-cols-4 items-center space-x-2 text-sm">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      isLoading ? "bg-yellow-500/50 animate-pulse" : "bg-white/20 dark:bg-white/10"
                    }`}
                  />
                  <span className="text-foreground text-center col-span-4 sm:col-span-2">
                    {partialQuestions
                      ? `Generating question ${partialQuestions.length + 1} of 10`
                      : "Analyzing PDF content"}
                  </span>
                </div>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </BackgroundBeamsWithCollision>
  );
}
