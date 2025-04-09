'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const tasks = [
  {
    tense: "Present Simple",
    title: "Present Simple – daily routine",
    explanation: "Use this tense for regular actions. Example: I work every day.",
    examples: ["I wake up at 6 AM.", "She drives to work.", "We drink coffee in the morning."],
    prompt: "Use the following 3 words in sentences: wake, work, drink.",
    expectedKeywords: ["wake", "work", "drink"],
    acceptableSynonyms: { "wake": ["get up"], "drink": ["have", "sip"] }
  },
  {
    tense: "Past Simple",
    title: "Past Simple – actions in the past",
    explanation: "Use this tense for completed actions in the past.",
    examples: ["I finished my shift.", "We cleaned the machine."],
    prompt: "Use these 2 words in your sentences: finished, cleaned.",
    expectedKeywords: ["finished", "cleaned"],
    acceptableSynonyms: { "cleaned": ["washed", "scrubbed"] }
  },
  {
    tense: "Future Simple",
    title: "Future Simple – plans and decisions",
    explanation: "Use 'will' for future decisions and predictions.",
    examples: ["I will check the machine.", "They will finish at five."],
    prompt: "Write 2 sentences using these words: will, check, finish.",
    expectedKeywords: ["will", "check", "finish"],
    acceptableSynonyms: { "check": ["inspect"], "finish": ["complete"] }
  },
  {
    tense: "Present Continuous",
    title: "Present Continuous – happening now",
    explanation: "Use this tense for actions that are happening right now.",
    examples: ["I am writing.", "She is fixing the bike."],
    prompt: "Write 2 sentences about what you are doing right now.",
    expectedKeywords: ["am", "is", "-ing"],
    acceptableSynonyms: {}
  },
  {
    tense: "Present Perfect",
    title: "Present Perfect – past with effect now",
    explanation: "Use 'have/has + past participle' for actions with present results.",
    examples: ["I have repaired the machine.", "She has left work."],
    prompt: "Use these words in sentences: have, repaired, left.",
    expectedKeywords: ["have", "has", "repaired", "left"],
    acceptableSynonyms: { "repaired": ["fixed"], "left": ["gone"] }
  }
];

const ranks = [
  { title: "Survival Student", threshold: 0 },
  { title: "Grammar Warrior", threshold: 50 },
  { title: "Idiom Master", threshold: 100 },
  { title: "Verb Ninja", threshold: 200 },
  { title: "English Boss", threshold: 350 }
];

export default function EnglishSurvivalApp() {
  const [day, setDay] = useState(0);
  const [responses, setResponses] = useState(Array(tasks.length).fill(""));
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(1);

  const handleInputChange = (e) => {
    const updatedResponses = [...responses];
    updatedResponses[day] = e.target.value;
    setResponses(updatedResponses);
    setFeedback("");
  };

  const checkAnswer = () => {
    const userInput = responses[day].toLowerCase();
    const task = tasks[day];
    const words = userInput.match(/\b\w+\b/g) || [];
    const expected = task.expectedKeywords;
    const synonyms = task.acceptableSynonyms || {};

    let correctCount = 0;
    let missingWords = [];

    expected.forEach(keyword => {
      const isDirect = words.includes(keyword);
      const isSynonym = synonyms[keyword]?.some(s => words.includes(s)) ?? false;
      if (isDirect || isSynonym) {
        correctCount++;
      } else {
        missingWords.push(keyword);
      }
    });

    let newScore = score;
    let resultMessage = "";

    if (correctCount === expected.length) {
      newScore += 10;
      resultMessage = "Perfect! All required words used correctly.";
    } else {
      newScore += 5;
      resultMessage = `Missing: ${missingWords.join(", ")}. You should include: ${expected.join(", ")}.`;
    }

    setFeedback(resultMessage);
    setScore(newScore);
    setHistory([...history, { day: day + 1, tense: task.tense, input: userInput, score: newScore, feedback: resultMessage }]);
  };

  const nextTask = () => {
    const nextDay = (day + 1) % tasks.length;
    setDay(nextDay);
    if (nextDay === 0) {
      setStreak(streak + 1);
    }
    setFeedback("");
  };

  const getRank = () => {
    return ranks
      .slice()
      .reverse()
      .find(rank => score >= rank.threshold)?.title || ranks[0].title;
  };

  const playAudio = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  const task = tasks[day];

  return (
    <div className="p-4 max-w-xl mx-auto bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-1 text-blue-900">English Survival – Day {day + 1}</h1>
      <p className="text-sm text-indigo-700 mb-4">
        Streak: <span className="font-bold">{streak}</span> days | Points: <span className="font-bold">{score}</span> | Level: <span className="font-bold">{getRank()}</span>
      </p>

      <Card className="mb-4 bg-white border border-indigo-200">
        <CardContent>
          <h2 className="text-xl font-semibold mb-2 text-indigo-800">{task.title}</h2>
          <p className="mb-2 text-gray-800">{task.explanation}</p>
          <ul className="list-disc pl-5 mb-2 text-indigo-700">
            {task.examples.map((ex, i) => (
              <li key={i} className="cursor-pointer hover:underline" onClick={() => playAudio(ex)}>
                {ex} <span className="text-xs text-gray-400">(Click to listen)</span>
              </li>
            ))}
          </ul>
          <p className="font-medium italic mb-2 text-blue-700">{task.prompt}</p>
          <Textarea
            placeholder="Write your English answer here..."
            value={responses[day]}
            onChange={handleInputChange}
            className="mb-2 border border-indigo-300"
          />
          <Button onClick={checkAnswer} className="mr-2 bg-blue-600 text-white hover:bg-blue-700">Check Answer</Button>
          <Button onClick={nextTask} className="bg-indigo-500 text-white hover:bg-indigo-600">Next Task</Button>
          {feedback && <p className="mt-2 text-sm text-green-700">{feedback}</p>}
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200">
        <CardContent>
          <h2 className="text-lg font-semibold mb-2 text-indigo-800">Answer History</h2>
          <ul className="text-sm list-disc pl-4 text-gray-800">
            {history.map((entry, i) => (
              <li key={i} className="mb-1">
                <strong>Day {entry.day} ({entry.tense}):</strong> {entry.input} – <span className="text-green-700">{entry.feedback}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
