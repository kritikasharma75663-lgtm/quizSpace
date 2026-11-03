import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';

const CategoryFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('BookOpen');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setIcon(initialData.icon || 'BookOpen');
    } else {
      setName('');
      setDescription('');
      setIcon('BookOpen');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      icon,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Category' : 'Create Category'}
      subtitle="Organize quizzes under structured academic categories"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Artificial Intelligence"
          required
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the topics covered..."
            className="block w-full rounded-lg border border-slate-300 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Icon Identifier
          </label>
          <select
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 text-sm py-2.5 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="Code">Code (Programming)</option>
            <option value="Database">Database</option>
            <option value="Terminal">Terminal (Python/CLI)</option>
            <option value="Network">Network</option>
            <option value="Cpu">CPU (Algorithms)</option>
            <option value="Cloud">Cloud & DevOps</option>
            <option value="BookOpen">BookOpen (General)</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {initialData ? 'Update Category' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryFormModal;
