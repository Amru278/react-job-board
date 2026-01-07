// src/components/Dashboard/InterviewPrep/InterviewPrep.jsx
import React, { useState, useEffect } from 'react';
import './InterviewPrep.css';

const InterviewPrep = () => {
  const [activeTab, setActiveTab] = useState('coding'); // coding, behavioral, tips
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [difficulty, setDifficulty] = useState('easy');
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [timer, setTimer] = useState(1800); // 30 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Programming languages
  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: '🟨' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'cpp', name: 'C++', icon: '⚡' },
    { id: 'csharp', name: 'C#', icon: '🔷' }
  ];

  // Difficulty levels
  const difficulties = [
    { id: 'easy', name: 'Easy', color: '#10b981' },
    { id: 'medium', name: 'Medium', color: '#f59e0b' },
    { id: 'hard', name: 'Hard', color: '#ef4444' }
  ];

  // Coding problems database
  const codingProblems = [
    {
      id: 1,
      title: 'Two Sum',
      difficulty: 'easy',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      examples: [
        'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].',
        'Input: nums = [3,2,4], target = 6\nOutput: [1,2]'
      ],
      constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
      testCases: [
        { input: '[2,7,11,15], 9', expected: '[0,1]' },
        { input: '[3,2,4], 6', expected: '[1,2]' },
        { input: '[3,3], 6', expected: '[0,1]' }
      ]
    },
    {
      id: 2,
      title: 'Reverse String',
      difficulty: 'easy',
      description: 'Write a function that reverses a string. The input string is given as an array of characters s.',
      examples: [
        'Input: s = ["h","e","l","l","o"]\nOutput: ["o","l","l","e","h"]',
        'Input: s = ["H","a","n","n","a","h"]\nOutput: ["h","a","n","n","a","H"]'
      ],
      constraints: ['1 <= s.length <= 10^5', 's[i] is a printable ascii character.'],
      testCases: [
        { input: '["h","e","l","l","o"]', expected: '["o","l","l","e","h"]' },
        { input: '["H","a","n","n","a","h"]', expected: '["h","a","n","n","a","H"]' }
      ]
    },
    {
      id: 3,
      title: 'Valid Parentheses',
      difficulty: 'medium',
      description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
      examples: [
        'Input: s = "()"\nOutput: true',
        'Input: s = "()[]{}"\nOutput: true',
        'Input: s = "(]"\nOutput: false'
      ],
      constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only "()[]{}".'],
      testCases: [
        { input: '"()"', expected: 'true' },
        { input: '"()[]{}"', expected: 'true' },
        { input: '"(]"', expected: 'false' },
        { input: '"([)]"', expected: 'false' }
      ]
    },
    {
      id: 4,
      title: 'Merge Two Sorted Lists',
      difficulty: 'easy',
      description: 'Merge two sorted linked lists and return it as a sorted list.',
      examples: [
        'Input: l1 = [1,2,4], l2 = [1,3,4]\nOutput: [1,1,2,3,4,4]',
        'Input: l1 = [], l2 = []\nOutput: []'
      ],
      constraints: ['The number of nodes in both lists is in the range [0, 50].', '-100 <= Node.val <= 100'],
      testCases: [
        { input: '[1,2,4], [1,3,4]', expected: '[1,1,2,3,4,4]' },
        { input: '[], []', expected: '[]' },
        { input: '[], [0]', expected: '[0]' }
      ]
    },
    {
      id: 5,
      title: 'Maximum Subarray',
      difficulty: 'medium',
      description: 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
      examples: [
        'Input: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: [4,-1,2,1] has the largest sum = 6.',
        'Input: nums = [1]\nOutput: 1',
        'Input: nums = [5,4,-1,7,8]\nOutput: 23'
      ],
      constraints: ['1 <= nums.length <= 3 * 10^4', '-10^5 <= nums[i] <= 10^5'],
      testCases: [
        { input: '[-2,1,-3,4,-1,2,1,-5,4]', expected: '6' },
        { input: '[1]', expected: '1' },
        { input: '[5,4,-1,7,8]', expected: '23' }
      ]
    }
  ];

  // Template code by language
  const codeTemplates = {
    javascript: `function solution(input) {
    // Write your code here
    // Return the result
}`,
    python: `def solution(input):
    # Write your code here
    # Return the result
    pass`,
    java: `class Solution {
    public Object solution(Object input) {
        // Write your code here
        // Return the result
        return null;
    }
}`,
    cpp: `class Solution {
public:
    // Write your code here
    // Return the result
};`,
    csharp: `public class Solution {
    public object Solution(object input) {
        // Write your code here
        // Return the result
        return null;
    }
}`
  };

  // Behavioral questions
  const behavioralQuestions = [
    {
      category: 'Teamwork',
      questions: [
        "Tell me about a time you had to work closely with someone whose personality was very different from yours.",
        "Give me an example of a time you faced a conflict while working on a team. How did you handle that?",
        "Describe a time when you struggled to build a relationship with someone important. How did you eventually overcome that?"
      ]
    },
    {
      category: 'Problem Solving',
      questions: [
        "Describe a time when you were faced with a stressful situation that demonstrated your coping skills.",
        "Tell me about a time you failed. How did you deal with the situation?",
        "Describe a situation in which you found a creative way to overcome an obstacle."
      ]
    },
    {
      category: 'Leadership',
      questions: [
        "Tell me about a time you had to persuade a group of people to accept a new idea or process.",
        "Describe a situation where you had to step up and lead a project or initiative.",
        "Give an example of a time you motivated others to achieve a challenging goal."
      ]
    },
    {
      category: 'Adaptability',
      questions: [
        "Tell me about a time you had to adjust to a significant change at work.",
        "Describe a situation where you had to learn something new quickly.",
        "Give an example of when you had to think on your feet to navigate a difficult situation."
      ]
    }
  ];

  // Interview tips
  const interviewTips = [
    {
      category: 'Coding Interviews',
      tips: [
        'Always clarify the problem before coding',
        'Think out loud - explain your thought process',
        'Start with brute force, then optimize',
        'Consider edge cases',
        'Test your code with examples'
      ]
    },
    {
      category: 'Behavioral Interviews',
      tips: [
        'Use the STAR method (Situation, Task, Action, Result)',
        'Prepare 5-7 stories covering different scenarios',
        'Quantify your achievements',
        'Be honest about failures and what you learned',
        'Practice with a friend or record yourself'
      ]
    },
    {
      category: 'General Tips',
      tips: [
        'Research the company and role thoroughly',
        'Prepare questions to ask the interviewer',
        'Dress professionally',
        'Arrive 10-15 minutes early',
        'Send thank you email within 24 hours'
      ]
    }
  ];

  useEffect(() => {
    // Select first problem on load
    if (codingProblems.length > 0 && !currentProblem) {
      setCurrentProblem(codingProblems[0]);
      setUserCode(codeTemplates[selectedLanguage]);
    }

    // Timer logic
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimer(1800);
  };

  const selectProblem = (problem) => {
    setCurrentProblem(problem);
    setUserCode(codeTemplates[selectedLanguage]);
    setTestResults([]);
  };

  const runTests = () => {
    // Simulate test execution
    const results = currentProblem.testCases.map((testCase, index) => {
      // In a real app, this would execute the code
      const passed = Math.random() > 0.3; // Simulate 70% pass rate
      return {
        id: index + 1,
        input: testCase.input,
        expected: testCase.expected,
        passed,
        output: passed ? testCase.expected : 'Incorrect output'
      };
    });
    setTestResults(results);
  };

  const submitSolution = () => {
    runTests();
    const allPassed = testResults.every(r => r.passed);
    if (allPassed) {
      alert('🎉 Congratulations! All tests passed!');
    } else {
      alert('❌ Some tests failed. Keep trying!');
    }
  };

  const getFilteredProblems = () => {
    return codingProblems.filter(problem => 
      difficulty === 'all' || problem.difficulty === difficulty
    );
  };

  return (
    <div className="interview-prep-container">
      <div className="prep-header">
        <h1>💻 Technical Interview Prep</h1>
        <p>Practice coding challenges and behavioral questions to ace your interviews</p>
      </div>

      {/* Timer Section */}
      <div className="timer-section">
        <div className="timer-display">
          <div className="timer-label">Practice Timer</div>
          <div className="timer">{formatTime(timer)}</div>
          <div className="timer-controls">
            <button 
              className={`timer-btn ${isTimerRunning ? 'pause' : 'start'}`}
              onClick={() => isTimerRunning ? setIsTimerRunning(false) : startTimer()}
            >
              {isTimerRunning ? '⏸️ Pause' : '▶️ Start'}
            </button>
            <button className="timer-btn reset" onClick={resetTimer}>
              🔄 Reset
            </button>
          </div>
        </div>
        <div className="timer-tip">
          ⏱️ <strong>Tip:</strong> Practice with time limits to simulate real interview conditions
        </div>
      </div>

      {/* Main Tabs */}
      <div className="prep-tabs">
        <button 
          className={`prep-tab ${activeTab === 'coding' ? 'active' : ''}`}
          onClick={() => setActiveTab('coding')}
        >
          💻 Coding Practice
        </button>
        <button 
          className={`prep-tab ${activeTab === 'behavioral' ? 'active' : ''}`}
          onClick={() => setActiveTab('behavioral')}
        >
          👥 Behavioral Questions
        </button>
        <button 
          className={`prep-tab ${activeTab === 'tips' ? 'active' : ''}`}
          onClick={() => setActiveTab('tips')}
        >
          💡 Interview Tips
        </button>
      </div>

      {/* Coding Practice Tab */}
      {activeTab === 'coding' && (
        <div className="coding-practice">
          <div className="coding-sidebar">
            <div className="sidebar-section">
              <h3>🔍 Filter Problems</h3>
              <div className="filter-options">
                <div className="filter-group">
                  <label>Difficulty:</label>
                  <div className="difficulty-buttons">
                    {difficulties.map(diff => (
                      <button
                        key={diff.id}
                        className={`difficulty-btn ${difficulty === diff.id ? 'active' : ''}`}
                        style={{ borderColor: diff.color }}
                        onClick={() => setDifficulty(diff.id)}
                      >
                        <span className="dot" style={{ backgroundColor: diff.color }}></span>
                        {diff.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="filter-group">
                  <label>Language:</label>
                  <div className="language-buttons">
                    {languages.map(lang => (
                      <button
                        key={lang.id}
                        className={`language-btn ${selectedLanguage === lang.id ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedLanguage(lang.id);
                          setUserCode(codeTemplates[lang.id]);
                        }}
                      >
                        {lang.icon} {lang.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="sidebar-section">
              <h3>📋 Problems List</h3>
              <div className="problems-list">
                {getFilteredProblems().map(problem => (
                  <div
                    key={problem.id}
                    className={`problem-item ${currentProblem?.id === problem.id ? 'active' : ''}`}
                    onClick={() => selectProblem(problem)}
                  >
                    <div className="problem-header">
                      <h4>{problem.title}</h4>
                      <span className={`difficulty-badge ${problem.difficulty}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <p className="problem-description">
                      {problem.description.substring(0, 80)}...
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="coding-main">
            {currentProblem && (
              <>
                <div className="problem-statement">
                  <div className="problem-header">
                    <h2>{currentProblem.title}</h2>
                    <div className="problem-meta">
                      <span className={`difficulty ${currentProblem.difficulty}`}>
                        {currentProblem.difficulty}
                      </span>
                      <span className="time-estimate">⏱️ 30 min</span>
                    </div>
                  </div>
                  
                  <div className="problem-description">
                    <p>{currentProblem.description}</p>
                    
                    <div className="examples">
                      <h4>Examples:</h4>
                      {currentProblem.examples.map((example, idx) => (
                        <div key={idx} className="example">
                          <pre>{example}</pre>
                        </div>
                      ))}
                    </div>
                    
                    <div className="constraints">
                      <h4>Constraints:</h4>
                      <ul>
                        {currentProblem.constraints.map((constraint, idx) => (
                          <li key={idx}>{constraint}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="code-editor-section">
                  <div className="editor-header">
                    <h3>Code Editor ({selectedLanguage.toUpperCase()})</h3>
                    <div className="editor-actions">
                      <button className="run-btn" onClick={runTests}>
                        ▶️ Run Code
                      </button>
                      <button className="submit-btn" onClick={submitSolution}>
                        🚀 Submit Solution
                      </button>
                    </div>
                  </div>
                  
                  <div className="code-editor">
                    <textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      spellCheck="false"
                      placeholder="Write your solution here..."
                    />
                  </div>
                  
                  <div className="test-results">
                    <h4>Test Results</h4>
                    {testResults.length > 0 ? (
                      <div className="results-list">
                        {testResults.map(result => (
                          <div key={result.id} className={`test-result ${result.passed ? 'passed' : 'failed'}`}>
                            <div className="result-header">
                              <span className="result-icon">
                                {result.passed ? '✅' : '❌'}
                              </span>
                              <span>Test Case {result.id}</span>
                            </div>
                            <div className="result-details">
                              <div><strong>Input:</strong> {result.input}</div>
                              <div><strong>Expected:</strong> {result.expected}</div>
                              <div><strong>Output:</strong> {result.output}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-results">Run your code to see test results</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Behavioral Questions Tab */}
      {activeTab === 'behavioral' && (
        <div className="behavioral-practice">
          <div className="behavioral-intro">
            <h2>👥 Behavioral Interview Practice</h2>
            <p>Practice answering common behavioral questions using the STAR method</p>
          </div>
          
          <div className="star-method-guide">
            <h3>⭐ STAR Method Guide</h3>
            <div className="star-grid">
              <div className="star-step">
                <div className="step-letter">S</div>
                <h4>Situation</h4>
                <p>Describe the context and background</p>
              </div>
              <div className="star-step">
                <div className="step-letter">T</div>
                <h4>Task</h4>
                <p>Explain your responsibility</p>
              </div>
              <div className="star-step">
                <div className="step-letter">A</div>
                <h4>Action</h4>
                <p>Detail the steps you took</p>
              </div>
              <div className="star-step">
                <div className="step-letter">R</div>
                <h4>Result</h4>
                <p>Share the outcome and learnings</p>
              </div>
            </div>
          </div>
          
          <div className="behavioral-questions">
            {behavioralQuestions.map(category => (
              <div key={category.category} className="question-category">
                <h3>{category.category}</h3>
                <div className="questions-list">
                  {category.questions.map((question, idx) => (
                    <div key={idx} className="question-card">
                      <div className="question-text">{question}</div>
                      <div className="question-actions">
                        <button className="practice-btn">🎤 Practice Answer</button>
                        <button className="example-btn">📝 See Example</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interview Tips Tab */}
      {activeTab === 'tips' && (
        <div className="interview-tips">
          <div className="tips-intro">
            <h2>💡 Interview Tips & Best Practices</h2>
            <p>Essential advice to help you succeed in technical interviews</p>
          </div>
          
          <div className="tips-grid">
            {interviewTips.map(category => (
              <div key={category.category} className="tip-category">
                <h3>{category.category}</h3>
                <ul className="tips-list">
                  {category.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="resources-section">
            <h3>📚 Additional Resources</h3>
            <div className="resources-grid">
              <a href="https://leetcode.com" target="_blank" rel="noopener noreferrer" className="resource-card">
                <div className="resource-icon">🧠</div>
                <h4>LeetCode</h4>
                <p>Practice coding challenges</p>
              </a>
              <a href="https://hackerrank.com" target="_blank" rel="noopener noreferrer" className="resource-card">
                <div className="resource-icon">💻</div>
                <h4>HackerRank</h4>
                <p>Coding practice platform</p>
              </a>
              <a href="https://pramp.com" target="_blank" rel="noopener noreferrer" className="resource-card">
                <div className="resource-icon">👥</div>
                <h4>Pramp</h4>
                <p>Mock interview platform</p>
              </a>
              <a href="https://glassdoor.com" target="_blank" rel="noopener noreferrer" className="resource-card">
                <div className="resource-icon">🏢</div>
                <h4>Glassdoor</h4>
                <p>Company interview reviews</p>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPrep;
