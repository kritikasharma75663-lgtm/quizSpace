import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';

const QuizFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  categories = [],
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Medium',
    duration: 15,
    passingPercentage: 60,
    published: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category?._id || initialData.category || '',
        difficulty: initialData.difficulty || 'Medium',
        duration: initialData.duration || 15,
        passingPercentage: initialData.passingPercentage || 60,
        published: initialData.published !== undefined ? initialData.published : true,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: categories[0]?._id || '',
        difficulty: 'Medium',
        duration: 15,
        passingPercentage: 60,
        published: true,
      });
    }
  }, [initialData, categories, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Quiz' : 'Create New Quiz'}
      subtitle="Configure quiz settings, duration, and passing criteria"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Quiz Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Full Stack Web Development Mastery"
          required
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief overview of what topics this quiz evaluates..."
            required
            className="block w-full rounded-lg border border-slate-300 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="block w-full rounded-lg border border-slate-300 text-sm py-2.5 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Difficulty
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="block w-full rounded-lg border border-slate-300 text-sm py-2.5 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Duration (Minutes)"
            name="duration"
            type="number"
            min="1"
            max="180"
            value={formData.duration}
            onChange={handleChange}
            required
          />

          <Input
            label="Passing Percentage (%)"
            name="passingPercentage"
            type="number"
            min="10"
            max="100"
            value={formData.passingPercentage}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          <label htmlFor="published" className="text-sm font-medium text-slate-800">
            Publish immediately (visible to students)
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {initialData ? 'Save Changes' : 'Create Quiz'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default QuizFormModal;
