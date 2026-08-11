import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckSquare, Square, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function TodoWidget() {
  const [todos, setTodos] = useState([]);
  const [newText, setNewText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      const res = await axios.get('/api/widgets/todos');
      setTodos(res.data);
    } catch (e) {
      console.error('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    try {
      const res = await axios.post('/api/widgets/todos', { text: newText });
      setTodos(prev => [...prev, res.data]);
      setNewText('');
    } catch (e) {
      console.error('Failed to add todo');
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await axios.put(`/api/widgets/todos/${id}/toggle`);
      setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: res.data.completed } : t));
    } catch (e) {
      console.error('Failed to toggle todo');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/widgets/todos/${id}`);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (e) {
      console.error('Failed to delete todo');
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-4 text-slate-200 flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" /> To-Do List
        </h3>
        <span className="text-[11px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
          {todos.filter(t => t.completed).length}/{todos.length}
        </span>
      </div>

      <form onSubmit={handleAdd} className="flex items-center gap-2">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 bg-slate-900/80 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-sky-400"
        />
        <button type="submit" className="p-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white transition">
          <Plus className="w-4 h-4" />
        </button>
      </form>

      <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-1">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between p-2 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition group"
          >
            <div
              onClick={() => handleToggle(todo.id)}
              className="flex items-center gap-2 flex-1 cursor-pointer min-w-0"
            >
              {todo.completed ? (
                <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-500 flex-shrink-0" />
              )}
              <span className={`text-xs truncate ${todo.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                {todo.text}
              </span>
            </div>

            <button
              onClick={() => handleDelete(todo.id)}
              className="p-1 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
