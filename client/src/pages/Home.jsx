import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../App';

const FEATURES = [
  {
    icon: '✍️',
    title: 'Write Together',
    desc: 'Multiple contributors, one shared story. See every addition appear in real time.',
  },
  {
    icon: '📝',
    title: 'Rich Text Editor',
    desc: 'Full WYSIWYG formatting — bold, italic, headings, lists, links and images.',
  },
  {
    icon: '✅',
    title: 'Review & Approve',
    desc: 'Curate every submission. Approve, reject, and reorder until the story is right.',
  },
  {
    icon: '📤',
    title: 'Export Anywhere',
    desc: 'Download finished stories as TXT, PDF, Word doc, or EPUB — ready to publish.',
  },
  {
    icon: '💬',
    title: 'Live Chat',
    desc: 'Discuss ideas and give feedback without ever leaving the writing room.',
  },
  {
    icon: '🎮',
    title: 'Writer Games',
    desc: 'Recharge between sessions with Wordle, Hangman, and Word Ladder.',
  },
];

function Home() {
  const { theme, toggleTheme } = useUser();
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      {/* ── HERO ── */}
      <section className="landing-hero">
        <img src="/assets/logo.svg" alt="Penwove" className="landing-logo" />
        <h1 className="home-title">Penwove</h1>
        <p className="landing-tagline">Where stories are written together.</p>
        <p className="landing-desc">
          A real-time collaborative writing platform for writers, teams, and storytellers.
          Contribute, review, and export — all in one place.
        </p>
        <button className="btn btn-primary landing-cta" onClick={() => navigate('/start')}>
          Start Writing →
        </button>
      </section>

      {/* ── FEATURES ── */}
      <section className="landing-features">
        <h2 className="landing-section-title">Everything you need to write together</h2>
        <p className="landing-section-sub">From first draft to final export — Penwove has you covered.</p>
        <div className="features-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} Penwove — made for writers.</p>
      </footer>
    </div>
  );
}

export default Home;
