'use client';
import { useState } from 'react';
import '@/styles/contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '', botField: ''});
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.botField !== '') return; // bot detected

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forms/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });

      if (res.ok) setSubmitted(true);
      else setError("Submission error");
    } catch (err) {
      console.error(err);
      setError("Submission error");
    }
  };

  return (<>
    <div className="contact-container">
      <h1 className="contact-title">Say hi :)</h1>

      {error && <div className="contact-error">{error}</div>}
      {submitted ? (
        <div className="contact-success">
          🎉 Thanks for reaching out! I’ll get back to you soon.
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <div style={{ display: 'none' }}>
        <label>Don’t fill this out if you're human</label>
        <input name="botField" value={form.botField} onChange={handleChange} />
      </div>
          <div>
            <label className="contact-label" htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="contact-input"
            />
          </div>

          <div>
            <label className="contact-label" htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="contact-input"
            />
          </div>

          <div>
            <label className="contact-label" htmlFor="message">Message</label>
            <textarea
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={handleChange}
              className="contact-textarea"
            />
          </div>

          {error && <p className="contact-error">{error}</p>}

          <button type="submit" className="contact-button">Send</button>
        </form>
      )}

    </div></>
  );
}
