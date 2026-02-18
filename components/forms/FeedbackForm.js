'use client';

import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button'; // ✅ default import

export default function FeedbackForm() {
  const [form, setForm] = useState({ symptoms: '' });

  const handleChange = (e) => setForm({ ...form, symptoms: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Submitted symptoms: ' + form.symptoms);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Describe your symptoms"
        value={form.symptoms}
        onChange={handleChange}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
