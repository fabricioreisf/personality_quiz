import './App.css'
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { UserProvider, UserContext } from './components/UserContext';
import Header from './components/Header';
import UserForm from './components/UserForm';
import Question from './components/Question';
import Results from './components/Results';

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [element, setElement] = useState('');
  const [artwork, setArtwork] = useState('');
  const [userName, setUserName] = useState('');

  const questions = [
  {
    question: "What's your favorite color?",
    options: ["Red 🔴", "Blue 🔵", "Green 🟢", "Yellow 🟡"],
  },
 ];
  const keywords = {
    Fire: "fire",
    Water: "water",
    Earth: "earth",
    Air: "air",
  };
  const elements = {
    "Red 🔴": "Fire",
    "Blue 🔵": "Water",
    "Green 🟢": "Earth",
    "Yellow 🟡": "Air",
    // Continue mapping all your possible options to a keyword
  };

  function handleAnswer(answer) {
    setAnswers([...answers, answer]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  function handleUserFormSubmit(name) {
    setUserName(name);
  };

  useEffect(() => {
      setAnswers([]);
      setCurrentQuestionIndex(0);
    }, [userName]
  );

  useEffect(
    function () {
      function determineElement(answers) {
        const counts = {};
        answers.forEach(function(answer) {
          const element = elements[answer];
          counts[element] = (counts[element] || 0) + 1;
        });
        return Object.keys(counts).reduce(function(a, b) {
          return counts[a] > counts[b] ? a : b
        });
      };
      async function fetchImage() {
        try {
          const response = await fetch("https://dog.ceo/api/breeds/image/random");
          if (!response.ok) {
            throw new Error("Erro ao buscar imagem");
          }
          const data = await response.json();
          setArtwork(data);
        }
        catch(error) {
          console.log(error);
        }
      }
      
      if (currentQuestionIndex === questions.length) {
        const selectedElement = determineElement(answers);
        setElement(selectedElement);
        fetchImage(keywords[selectedElement]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentQuestionIndex, userName]
  );

  return (
    <UserProvider value={{ name: userName, setName: setUserName }}>
      <Header />
      <Routes>
        <Route path="/" element={<UserForm onSubmit={handleUserFormSubmit} />} />
        <Route
          path="/quiz"
          element={
            currentQuestionIndex < questions.length ? (
              <Question question={questions[currentQuestionIndex].question} options={questions[currentQuestionIndex].options} onAnswer={handleAnswer} />
            ) : (
              <Results element={element} artwork={artwork} />
            )
          }
        />
      </Routes>
    </UserProvider>
  )
}

export default App
