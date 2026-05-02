import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function Quiz({ quiz, onPass }: { quiz: any; onPass?: () => void }) {
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const questions = (quiz.quiz_questions ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order);

  const submit = async () => {
    let correct = 0;
    questions.forEach((q: any) => { if (answers[q.id] === q.correct_index) correct++; });
    const pct = questions.length ? Math.round((correct / questions.length) * 100) : 0;
    setScore(pct);
    setSubmitted(true);
    const passed = pct >= (quiz.pass_threshold ?? 70);
    if (user) {
      await supabase.from("quiz_attempts").insert({ user_id: user.id, quiz_id: quiz.id, score: pct, passed, answers });
    }
    if (passed) {
      toast.success(`Passed with ${pct}%!`);
      onPass?.();
    } else {
      toast.error(`Scored ${pct}% — need ${quiz.pass_threshold}% to pass.`);
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle className="font-display">{quiz.title}</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        {questions.map((q: any, i: number) => (
          <div key={q.id}>
            <div className="font-medium mb-3">{i + 1}. {q.question}</div>
            <div className="space-y-2">
              {(q.options as string[]).map((opt: string, idx: number) => {
                const selected = answers[q.id] === idx;
                const isCorrect = submitted && idx === q.correct_index;
                const isWrong = submitted && selected && idx !== q.correct_index;
                return (
                  <button
                    key={idx} type="button" disabled={submitted}
                    onClick={() => setAnswers({ ...answers, [q.id]: idx })}
                    className={cn("w-full text-left p-3 rounded-md border text-sm transition-colors flex items-center gap-2",
                      selected && !submitted && "border-primary bg-primary/5",
                      isCorrect && "border-success bg-success/10 text-success",
                      isWrong && "border-destructive bg-destructive/10 text-destructive",
                      !selected && !submitted && "hover:bg-muted")}
                  >
                    {submitted && isCorrect && <CheckCircle2 className="h-4 w-4" />}
                    {submitted && isWrong && <XCircle className="h-4 w-4" />}
                    {opt}
                  </button>
                );
              })}
            </div>
            {submitted && q.explanation && (
              <p className="text-xs text-muted-foreground mt-2">{q.explanation}</p>
            )}
          </div>
        ))}
        {!submitted ? (
          <Button onClick={submit} disabled={Object.keys(answers).length !== questions.length}>Submit answers</Button>
        ) : (
          <div className="text-sm">Score: <span className="font-semibold">{score}%</span></div>
        )}
      </CardContent>
    </Card>
  );
}
