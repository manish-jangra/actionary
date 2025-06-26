import React, { useState, useEffect } from 'react';

const TAGS = [
  { label: 'To-Do', color: '#007aff' },
  { label: 'In Progress', color: '#ffb300' },
  { label: 'Blocked', color: '#ff5252' },
  { label: 'Completed', color: '#43a047' },
];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme configuration
  const theme = {
    light: {
      appBg: 'rgba(255,255,255,0.18)',
      headerBg: '#fff',
      taskBg: '#f4f8ff',
      inputBg: '#fff',
      textPrimary: '#222',
      textSecondary: '#b0b0b0',
      border: '#e0e0e0',
      shadow: '0 4px 24px rgba(0,0,0,0.10)',
      cardShadow: '0 2px 8px rgba(0,0,0,0.06)',
      taskShadow: '0 1px 4px rgba(0,0,0,0.04)'
    },
    dark: {
      appBg: 'rgba(30,30,30,0.9)',
      headerBg: '#2d2d2d',
      taskBg: '#3a3a3a',
      inputBg: '#2d2d2d',
      textPrimary: '#ffffff',
      textSecondary: '#888888',
      border: '#555555',
      shadow: '0 4px 24px rgba(0,0,0,0.4)',
      cardShadow: '0 2px 8px rgba(0,0,0,0.3)',
      taskShadow: '0 1px 4px rgba(0,0,0,0.2)'
    }
  };

  const currentTheme = isDarkMode ? theme.dark : theme.light;

  // Load tasks and dark mode preference on mount
  useEffect(() => {
    if (window.actionaryAPI) {
      window.actionaryAPI.readTasks().then((loaded) => {
        if (Array.isArray(loaded)) setTasks(loaded);
      });
    }
    // Load dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem('actionary-dark-mode');
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save tasks to file on change
  useEffect(() => {
    if (window.actionaryAPI) {
      window.actionaryAPI.saveTasks(tasks);
    }
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    const newTask = {
      id: generateId(),
      text: input,
      completed: false,
      tag: 'To-Do',
    };
    setTasks([...tasks, newTask]);
    setInput('');
  };

  const toggleComplete = idx => {
    setTasks(tasks.map((t, i) =>
      i === idx ? { ...t, completed: !t.completed, tag: !t.completed ? 'Completed' : 'To-Do' } : t
    ));
  };

  const setTag = (idx, tag) => {
    setTasks(tasks.map((t, i) =>
      i === idx ? { ...t, tag, completed: tag === 'Completed' } : t
    ));
  };

  const deleteTask = idx => {
    setTasks(tasks => tasks.filter((_, i) => i !== idx));
  };

  const getTagColor = tag => TAGS.find(t => t.label === tag)?.color || '#ccc';

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('actionary-dark-mode', JSON.stringify(newDarkMode));
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = (id) => {
    setTasks(tasks => tasks.map(t => t.id === id ? { ...t, text: editingText } : t));
    setEditingId(null);
    setEditingText('');
  };

  // Simple markdown-like parser for bold, italic, underline
  function renderFormatted(text) {
    if (!text) return null;
    // Replace __underline__ first
    let html = text.replace(/__([^_]+?)__/g, '<u>$1</u>');
    // Replace **bold**
    html = html.replace(/\*\*([^*]+?)\*\*/g, '<b>$1</b>');
    // Replace _italic_
    html = html.replace(/_([^_]+?)_/g, '<i>$1</i>');
    // Replace newlines
    html = html.replace(/\n/g, '<br/>');
    return <span style={{ flex: 1, textDecoration: 'none', color: currentTheme.textPrimary, fontSize: 16, cursor: 'pointer', whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: html }} />;
  }

  // Helper for formatting selection in textarea
  function formatSelection(wrapper) {
    const textarea = document.activeElement;
    if (!textarea || textarea.tagName !== 'TEXTAREA') return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = editingText.slice(0, start);
    const selected = editingText.slice(start, end);
    const after = editingText.slice(end);
    setEditingText(before + wrapper + selected + wrapper + after);
    // Move cursor to after the closing wrapper
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = end + 2 * wrapper.length;
    }, 0);
  }

  return (
    <div style={{ padding: 20, background: currentTheme.appBg, backdropFilter: 'blur(32px) saturate(180%)', borderRadius: 16, boxShadow: currentTheme.shadow, WebkitAppRegion: 'drag' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, background: currentTheme.headerBg, borderRadius: 10, boxShadow: currentTheme.cardShadow, padding: '10px 16px 10px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="assets/logo.png" alt="actionary logo" style={{ width: 40, height: 40, objectFit: 'contain', marginRight: 12, borderRadius: 6, background: 'transparent' }} />
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: 22, letterSpacing: 1, color: currentTheme.textPrimary, textTransform: 'lowercase' }}>actionary</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, WebkitAppRegion: 'no-drag' }}>
          <span style={{ color: currentTheme.textPrimary, fontSize: 14, fontWeight: 500 }}>
            {isDarkMode ? '🌙' : '☀️'}
          </span>
          <div
            onClick={toggleDarkMode}
            style={{
              width: 44,
              height: 24,
              borderRadius: 12,
              background: isDarkMode ? '#34c759' : '#e5e5ea',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background-color 0.3s ease',
              border: `1px solid ${isDarkMode ? '#30d158' : '#d1d1d6'}`
            }}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#ffffff',
                position: 'absolute',
                top: 1,
                left: isDarkMode ? 21 : 1,
                transition: 'left 0.3s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
              }}
            />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, WebkitAppRegion: 'no-drag' }}>
        <input
          style={{ 
            flex: 1, 
            padding: 8, 
            borderRadius: 6, 
            border: `1.5px solid ${currentTheme.border}`, 
            fontSize: 15,
            background: currentTheme.inputBg,
            color: currentTheme.textPrimary
          }}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="Add a new task..."
        />
        <button onClick={addTask} style={{ padding: '8px 18px', borderRadius: 6, border: 'none', background: '#007aff', color: '#fff', fontWeight: 600, fontSize: 15, boxShadow: '0 2px 8px rgba(0,122,255,0.08)' }}>Add</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, WebkitAppRegion: 'no-drag', maxHeight: '400px', overflowY: 'auto' }}>
        {tasks
          .map((task, originalIdx) => ({ ...task, originalIdx }))
          .sort((a, b) => {
            // Put "To-Do" tasks first
            if (a.tag === 'To-Do' && b.tag !== 'To-Do') return -1;
            if (b.tag === 'To-Do' && a.tag !== 'To-Do') return 1;
            // For other tags, maintain original order
            return 0;
          })
          .map((task, idx) => (
                      <li key={task.id} style={{
              display: 'flex', alignItems: 'center', marginBottom: 12, background: currentTheme.taskBg, borderRadius: 8, padding: 10, boxShadow: currentTheme.taskShadow
            }}>
            <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(task.originalIdx)} style={{ marginRight: 10, accentColor: getTagColor(task.tag), width: 18, height: 18 }} />
            {editingId === task.id ? (
                              <textarea
                  style={{ 
                    flex: 1, 
                    fontSize: 16, 
                    padding: 4, 
                    borderRadius: 4, 
                    border: `1px solid ${currentTheme.border}`, 
                    marginRight: 4, 
                    resize: 'vertical', 
                    minHeight: 32, 
                    maxHeight: 120,
                    background: currentTheme.inputBg,
                    color: currentTheme.textPrimary
                  }}
                  value={editingText}
                  autoFocus
                  onChange={e => setEditingText(e.target.value)}
                  onBlur={() => saveEdit(task.id)}
                  onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    saveEdit(task.id);
                  }
                  // Cmd/Ctrl+B for bold
                  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
                    e.preventDefault();
                    formatSelection('**');
                  }
                  // Cmd/Ctrl+I for italic
                  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') {
                    e.preventDefault();
                    formatSelection('_');
                  }
                  // Cmd/Ctrl+U for underline
                  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'u') {
                    e.preventDefault();
                    formatSelection('__');
                  }
                }}
                ref={el => {
                  if (editingId === task.id && el) el.focus();
                }}
              />
            ) : (
              <span
                style={{ flex: 1, textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? currentTheme.textSecondary : currentTheme.textPrimary, fontSize: 16, cursor: 'pointer', whiteSpace: 'pre-line' }}
                onClick={() => startEditing(task.id, task.text)}
                title="Click to edit"
              >
                {renderFormatted(task.text)}
              </span>
            )}
            <button onClick={() => deleteTask(task.originalIdx)} style={{ marginLeft: 8, background: 'none', border: 'none', color: '#ff5252', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Delete task">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 8.5V14.5C6 15.3284 6.67157 16 7.5 16H12.5C13.3284 16 14 15.3284 14 14.5V8.5" stroke="#ff5252" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M4 6.5H16" stroke="#ff5252" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8.5 10.5V13" stroke="#ff5252" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M11.5 10.5V13" stroke="#ff5252" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="7" y="4" width="6" height="2" rx="1" stroke="#ff5252" strokeWidth="1.5"/>
              </svg>
            </button>
            <select
              value={task.tag}
              onChange={e => setTag(task.originalIdx, e.target.value)}
              style={{ marginLeft: 10, borderRadius: 5, border: `1px solid ${currentTheme.border}`, background: getTagColor(task.tag), color: '#fff', fontWeight: 600, fontSize: 14, padding: '4px 10px', outline: 'none', cursor: 'pointer', minWidth: 110 }}
            >
              {TAGS.map(tag => <option key={tag.label} value={tag.label} style={{ background: tag.color, color: '#fff' }}>{tag.label}</option>)}
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App; 
