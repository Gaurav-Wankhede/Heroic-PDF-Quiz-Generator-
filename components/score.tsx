import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface QuizScoreProps {
  correctAnswers: number
  totalQuestions: number
}

export default function QuizScore({ correctAnswers, totalQuestions }: QuizScoreProps) {
  const score = (correctAnswers / totalQuestions) * 100
  const roundedScore = Math.round(score)

  const getMessage = () => {
    if (score === 100) return "Perfect score! Congratulations! You've mastered the material!"
    if (score >= 90) return "Excellent work! You're very close to perfection!"
    if (score >= 80) return "Great job! You've shown a strong understanding of the subject!"
    if (score >= 70) return "Good effort! You're doing well, but there's still room to improve."
    if (score >= 60) return "Not bad! You're on the right track, keep studying to boost your score."
    if (score >= 50) return "You're halfway there! With more practice, you can significantly improve."
    if (score >= 40) return "You've made a start, but there's plenty of room for improvement."
    if (score >= 30) return "Keep going! Don't get discouraged, focus on the areas you struggled with."
    if (score >= 20) return "It's a challenging subject, but don't give up! Review the material and try again."
    return "Every expert was once a beginner. Keep studying, and you'll see improvement!"
  }

  return (
    <Card className="w-full">
      <CardContent className="space-y-4 p-8">
        <div className="text-center">
          <p className="text-4xl font-bold">{roundedScore}%</p>
          <p className="text-sm text-muted-foreground">
            {correctAnswers} out of {totalQuestions} correct
          </p>
        </div>
        <p className="text-center font-medium">{getMessage()}</p>
      </CardContent>
    </Card>
  )
}
