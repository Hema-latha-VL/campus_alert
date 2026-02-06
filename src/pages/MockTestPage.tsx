import { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockTests, type MockTest, type Question } from '@/data/mockTestData';
import { ArrowLeft, BookOpen, Cpu, Zap, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MockTestPage = () => {
  const navigate = useNavigate();
  const [selectedTest, setSelectedTest] = useState<MockTest | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectTest = (test: MockTest) => {
    setSelectedTest(test);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleNext = () => {
    if (selectedTest && currentQuestionIndex < selectedTest.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!selectedTest) return { correct: 0, total: 0, percentage: 0 };

    const correct = selectedTest.questions.filter(
      (q) => userAnswers[q.id] === q.correctAnswer
    ).length;
    const total = selectedTest.questions.length;
    const percentage = Math.round((correct / total) * 100);

    return { correct, total, percentage };
  };

  const handleReset = () => {
    setSelectedTest(null);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
  };

  const getCategoryIcon = (category: string) => {
    if (category === 'computer') return <Cpu className="h-5 w-5" />;
    return <Zap className="h-5 w-5" />;
  };

  const getCategoryColor = (category: string) => {
    if (category === 'computer') return 'bg-blue-500/15 text-blue-400 border-blue-500/25';
    return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25';
  };

  // Test Selection View
  if (!selectedTest) {
    const computerTests = mockTests.filter((t) => t.category === 'computer');
    const electricalTests = mockTests.filter((t) => t.category === 'electrical');

    return (
      <PageLayout className="pt-28 pb-12 px-6" showOrbs>
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Mock Tests</h1>
              <p className="text-muted-foreground">
                Practice with curated questions to prepare for your exams
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Computer Science Tests */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Cpu className="h-6 w-6 text-blue-400" />
              <h2 className="text-2xl font-bold">Computer Science</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {computerTests.map((test) => (
                <GlassCard
                  key={test.id}
                  className="p-6 cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => handleSelectTest(test)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(test.category)}
                      <h3 className="text-xl font-bold">{test.title}</h3>
                    </div>
                    <Badge className={getCategoryColor(test.category)} variant="outline">
                      {test.questions.length} Qs
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{test.description}</p>
                  <Button className="w-full" size="sm">
                    Start Test
                  </Button>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* Electrical Tests */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-yellow-400" />
              <h2 className="text-2xl font-bold">Electrical Engineering</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {electricalTests.map((test) => (
                <GlassCard
                  key={test.id}
                  className="p-6 cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => handleSelectTest(test)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(test.category)}
                      <h3 className="text-xl font-bold">{test.title}</h3>
                    </div>
                    <Badge className={getCategoryColor(test.category)} variant="outline">
                      {test.questions.length} Qs
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{test.description}</p>
                  <Button className="w-full" size="sm">
                    Start Test
                  </Button>
                </GlassCard>
              ))}
            </div>
          </section>
        </div>
      </PageLayout>
    );
  }

  // Results View
  if (showResults) {
    const score = calculateScore();

    return (
      <PageLayout className="pt-28 pb-12 px-6" showOrbs>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Results Header */}
          <GlassCard className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">{selectedTest.title} - Results</h2>
            <div className="flex items-center justify-center gap-8 mb-6">
              <div>
                <p className="text-5xl font-bold text-primary">{score.percentage}%</p>
                <p className="text-muted-foreground mt-2">Score</p>
              </div>
              <div className="h-20 w-px bg-white/10" />
              <div>
                <p className="text-3xl font-bold">
                  {score.correct}/{score.total}
                </p>
                <p className="text-muted-foreground mt-2">Correct Answers</p>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Another Test
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowResults(false);
                  setCurrentQuestionIndex(0);
                }}
              >
                Review Answers
              </Button>
            </div>
          </GlassCard>

          {/* Question Review */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Question Review</h3>
            {selectedTest.questions.map((question, index) => {
              const userAnswer = userAnswers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;

              return (
                <GlassCard key={question.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {isCorrect ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold mb-3">
                        {index + 1}. {question.question}
                      </p>
                      <div className="space-y-2 mb-3">
                        {question.options.map((option, optIndex) => {
                          const isUserAnswer = userAnswer === optIndex;
                          const isCorrectAnswer = question.correctAnswer === optIndex;

                          return (
                            <div
                              key={optIndex}
                              className={`p-3 rounded-lg border ${
                                isCorrectAnswer
                                  ? 'bg-green-500/10 border-green-500/50 text-green-400'
                                  : isUserAnswer
                                  ? 'bg-red-500/10 border-red-500/50 text-red-400'
                                  : 'bg-white/5 border-white/10'
                              }`}
                            >
                              {option}
                              {isCorrectAnswer && (
                                <span className="ml-2 text-xs">(Correct)</span>
                              )}
                              {isUserAnswer && !isCorrectAnswer && (
                                <span className="ml-2 text-xs">(Your answer)</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {question.explanation && (
                        <div className="p-3 bg-blue-500/10 border border-blue-500/25 rounded-lg">
                          <p className="text-sm text-blue-400">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </PageLayout>
    );
  }

  // Test Taking View
  const currentQuestion = selectedTest.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / selectedTest.questions.length) * 100;
  const answeredCount = Object.keys(userAnswers).length;

  return (
    <PageLayout className="pt-28 pb-12 px-6" showOrbs>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Test Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{selectedTest.title}</h2>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {selectedTest.questions.length}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Exit
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress: {Math.round(progress)}%</span>
            <span>Answered: {answeredCount}/{selectedTest.questions.length}</span>
          </div>
        </div>

        {/* Question Card */}
        <GlassCard className="p-8">
          <div className="space-y-6">
            <div>
              <Badge className="mb-4">Question {currentQuestionIndex + 1}</Badge>
              <h3 className="text-xl font-semibold">{currentQuestion.question}</h3>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = userAnswers[currentQuestion.id] === index;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-primary/20 border-primary text-primary font-semibold'
                        : 'bg-white/5 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'border-primary bg-primary' : 'border-white/30'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </GlassCard>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentQuestionIndex === selectedTest.questions.length - 1 ? (
            <Button onClick={handleSubmit} disabled={answeredCount < selectedTest.questions.length}>
              Submit Test
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <BookOpen className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Question Navigation */}
        <GlassCard className="p-6">
          <h4 className="text-sm font-semibold mb-3">Question Navigator</h4>
          <div className="grid grid-cols-10 gap-2">
            {selectedTest.questions.map((q, index) => {
              const isAnswered = userAnswers[q.id] !== undefined;
              const isCurrent = index === currentQuestionIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-full aspect-square rounded-lg border text-sm font-semibold transition-all ${
                    isCurrent
                      ? 'bg-primary border-primary text-white'
                      : isAnswered
                      ? 'bg-green-500/20 border-green-500/50 text-green-400'
                      : 'bg-white/5 border-white/10 hover:border-white/30'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </PageLayout>
  );
};

export default MockTestPage;
