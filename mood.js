const moodForm = document.getElementById('moodForm');
const moodHistory = document.getElementById('moodHistory').getElementsByTagName('tbody')[0];
const suggestionDiv = document.getElementById('suggestion');

// Mood-based suggestions
const moodSuggestions = {
  happy: "Great to hear you're feeling happy! Keep up the good vibes!",
  neutral: "Feeling neutral? Take a moment to reflect on what might bring you joy.",
  sad: "It's okay to feel sad. Consider talking to someone or doing something you enjoy.",
  overwhelmed: "Feeling overwhelmed? Take a deep breath and break tasks into smaller steps.",
  angry: "Feeling angry? Try stepping away for a moment and practicing deep breathing."
};

// Store mood history
let history = [];

moodForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const mood = document.getElementById('mood').value;
  const context = document.getElementById('context').value;

  // Add to history
  const entry = {
    date: new Date().toLocaleString(),
    mood: mood,
    context: context || 'No context provided'
  };
  history.push(entry);

  // Display suggestion
  suggestionDiv.textContent = moodSuggestions[mood];

  // Update mood history table
  updateHistoryTable();

  // Reset form
  moodForm.reset();
});

function updateHistoryTable() {
  // Clear existing rows
  moodHistory.innerHTML = '';

  // Add new rows
  history.forEach(entry => {
    const row = moodHistory.insertRow();
    row.insertCell().textContent = entry.date;
    row.insertCell().textContent = entry.mood;
    row.insertCell().textContent = entry.context;
  });
}