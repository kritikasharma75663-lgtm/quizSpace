import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import CategoryFormModal from '../../components/admin/CategoryFormModal';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, FolderTree, BookOpen } from 'lucide-react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await adminService.getCategories();
      setCategories(res.data || []);
    } catch (err) {
      toast.error('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFormSubmit = async (formData) => {
    setActionLoading(true);
    try {
      if (editingCategory) {
        await adminService.updateCategory(editingCategory._id, formData);
        toast.success('Category updated successfully!');
      } else {
        await adminService.createCategory(formData);
        toast.success('Category created successfully!');
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    setActionLoading(true);
    try {
      await adminService.deleteCategory(deletingCategory._id);
      toast.success('Category deleted successfully!');
      setDeletingCategory(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Category Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize quizzes under academic subjects and skill domains
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
        >
          Add New Category
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <TableSkeleton rows={6} cols={5} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4 text-center">Quizzes</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{cat.name}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{cat.slug}</td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-sm truncate">
                      {cat.description || 'No description provided.'}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-indigo-700">
                      {cat.quizCount || 0}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {cat.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingCategory(cat);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingCategory(cat)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingCategory}
        isLoading={actionLoading}
      />

      <ConfirmDialog
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDeleteCategory}
        title="Delete Category?"
        message={`Are you sure you want to delete category "${deletingCategory?.name}"? Quizzes in this category must be reassigned or deleted first.`}
        confirmText="Yes, Delete Category"
        isLoading={actionLoading}
      />
    </div>
  );
};

export default AdminCategories;
