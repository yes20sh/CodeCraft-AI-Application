import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Editor from '@monaco-editor/react';
import Select from 'react-select';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import RingLoader from 'react-spinners/RingLoader';
import { motion } from 'framer-motion';

const App = () => {
  const options = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'rust', label: 'Rust' },
    { value: 'dart', label: 'Dart' },
    { value: 'scala', label: 'Scala' },
    { value: 'perl', label: 'Perl' },
    { value: 'haskell', label: 'Haskell' },
    { value: 'elixir', label: 'Elixir' },
    { value: 'r', label: 'R' },
    { value: 'matlab', label: 'MATLAB' },
    { value: 'bash', label: 'Bash' }
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [output, setOutput] = useState('');
  const ai = new GoogleGenAI({ apiKey: 'Your_API_Key' });

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#1e1e20',
      borderColor: '#3f3f46',
      color: '#fff',
      borderRadius: '0.75rem'
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#1e1e20',
      color: '#fff'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#fff'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#27272a' : '#1e1e20',
      color: '#fff',
      cursor: 'pointer'
    }),
    input: (provided) => ({
      ...provided,
      color: '#fff'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#a1a1aa'
    }),
  };

  const reviewCode = async () => {
    setResponse('');
    setLoading(true);
    try {
      const reviewResponse = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `You are an expert-level software developer, skilled in writing efficient, clean, and advanced code.
I’m sharing a piece of code written in ${selectedOption.value}.
Your job is to deeply review this code and provide the following:

1️⃣ A quality rating: Better, Good, Normal, or Bad.
2️⃣ Detailed suggestions for improvement, including best practices and advanced alternatives.
3️⃣ A clear explanation of what the code does, step by step.
4️⃣ A list of any potential bugs or logical errors, if found.
5️⃣ Identification of syntax errors or runtime errors, if present.
6️⃣ Solutions and recommendations on how to fix each identified issue.

Code: ${code}`,
      });
      setResponse(reviewResponse.text);
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const fixCode = async () => {
    if (code.trim() === '') {
      alert('🚨 Please enter some code first!');
      return;
    }

    setLoading(true);
    setResponse('');
    try {
      const fixResponse = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `You're a senior developer. Fix the following ${selectedOption.value} code:

Code:
${code}

Respond ONLY with the improved/fixed version of the code, with no explanation.`,
      });

      setCode(fixResponse.text.trim());
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const runCode = async () => {
    if (code.trim() === '') {
      alert('🚨 Please enter some code first!');
      return;
    }

    setLoading(true);
    setOutput('');
    try {
      const runResponse = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `You are an AI code execution assistant. I will share a code snippet written in ${selectedOption.value}.
Your job is to analyze the code and simulate its output.

Code:
${code}

Provide ONLY the output (no explanation).`,
      });

      // Handling the output from the AI simulation
      setOutput(runResponse.text);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const handleReviewClick = () => {
    if (code.trim() === '') {
      alert('🚨 Please enter some code first!');
      return;
    }
    reviewCode();
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row bg-gradient-to-br from-[#0f0f11] via-[#1e1e22] to-[#131316] min-h-screen overflow-hidden px-2 md:px-4 py-4 gap-4">
        {/* Left Panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 backdrop-blur-md bg-white/5 rounded-2xl p-4 shadow-xl ring-1 ring-zinc-700"
        >
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <div className="w-full md:w-1/3">
              <Select
                value={selectedOption}
                onChange={setSelectedOption}
                options={options}
                styles={customStyles}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={fixCode}
              className="px-4 py-2 rounded-xl text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-md"
            >
              Fix Code
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleReviewClick}
              className="px-4 py-2 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md"
            >
              Review
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={runCode}
              className="px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md"
            >
              Run Code
            </motion.button>
          </div>
          <div className="rounded-xl overflow-hidden ring-1 ring-zinc-700 shadow-inner">
            <Editor
              height="calc(100vh - 220px)"
              theme="vs-dark"
              language={selectedOption.value}
              value={code}
              onChange={setCode}
            />
          </div>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 backdrop-blur-md bg-white/5 rounded-2xl p-4 shadow-xl ring-1 ring-zinc-700 overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 100px)' }}
        >
          <h2 className="text-xl font-bold text-white mb-4 glow">
            🔍 Code Review Response
          </h2>
          {loading ? (
            <div className="flex justify-center items-center h-[60vh]">
              <RingLoader color="#9333ea" />
            </div>
          ) : (
            <div className="prose prose-invert text-zinc-200 markdown-body max-w-none">
              <Markdown>{response}</Markdown>
            </div>
          )}
          <h2 className="text-xl font-bold text-white mt-6 mb-4 glow">
            🖥️ Code Output
          </h2>
          <div className="bg-zinc-800 text-white p-4 rounded-xl">
            {output ? output : 'No output yet.'}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default App;
