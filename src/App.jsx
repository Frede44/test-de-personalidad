
import Header from './components/Header'
import './App.css'
import UserForm from './components/UserForm';
import { useEffect, useState } from 'react';
import { UserProvider } from './components/UserContext';
import { Route, Routes } from 'react-router-dom';
import Question from './components/Question';
import Results from './components/Results';

function App() {

  const questions = [
    {
      question: "¿Cuál es tu color favorito?",
      options: ["Rojo 🔴", "Azul 🔵", "Verde 🟢", "Amarillo 🟡"],
    }, {
      question: "¿Cuál es tu animal favorito?",
      options: ["Perro 🐶", "Gato 🐱", "Pájaro 🐦", "Pez 🐟"],
    },
  ];

  const keywords = {
    Fire: "fuego",
    Water: "agua",
    Earth: "tierra",
    Air: "aire",
  };
  const elements = {
    "Rojo 🔴": "Fuego",
    "Azul 🔵": "Agua",
    "Verde 🟢": "Tierra",
    "Amarillo 🟡": "Aire",
    "Perro 🐶": "Tierra",
    "Gato 🐱": "Agua",
    "Pájaro 🐦": "Aire",
    "Pez 🐟": "Agua"
    // Continue mapping all your possible options to a keyword
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [userName, setUserName] = useState("");
  const [element, setElement] = useState("");
  const [artwork, fetchArtwork] = useState(null)


  function handleAnswer(answer) {
    setAnswers([...answers, answer]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  function handleUserFormSubmit(name) {
    setUserName(name);
  };

  function determineElement(answers) {
    const counts = {};
    answers.forEach(function (answer) {
      const element = elements[answer];
      counts[element] = (counts[element] || 0) + 1;
    });
    return Object.keys(counts).reduce(function (a, b) {
      return counts[a] > counts[b] ? a : b
    });
  };



  useEffect(
    function () {
      if (currentQuestionIndex === questions.length) {
        const selectedElement = determineElement(answers);
        setElement(selectedElement);
        fetchArtwork(keywords[selectedElement]);
      }
    },
    [currentQuestionIndex]
  );

 
// Fetch artwork based on the determined element
useEffect(
  function () {
    if (element) {
      fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${keywords[element]}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.objectIDs && data.objectIDs.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.objectIDs.length);
            const objectID = data.objectIDs[randomIndex];
            return fetch(
              `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
            );
          } else {
            throw new Error("No se encontraron obras de arte.");
          }
        })
        .then((res) => res.json())
        .then((artworkData) => {
          fetchArtwork(artworkData);
        })
        .catch((error) => {
          console.error("Error fetching artwork:", error);
          fetchArtwork(null);
        });
    }
  },
  [element, keywords, fetchArtwork] // <--- ¡AQUÍ ESTÁ LA SOLUCIÓN!
);

  return (
    <>
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
    </>
  )
}

export default App
