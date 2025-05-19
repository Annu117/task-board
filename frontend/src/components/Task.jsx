import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import axios from 'axios';
import { Pencil, Trash2, X, Check, GripVertical, Loader2 } from 'lucide-react';

const Task = ({ task, onTaskUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(task);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      // await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/tasks/${task.id}`);
      await axios.delete(`${process.env.REACT_APP_API_URL}/tasks/${Number(task.id)}`);

      onTaskUpdated();
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/tasks/${task.id}`, formData);
      setIsEditing(false);
      onTaskUpdated();
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Failed to update task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`mb-3 rounded-lg transition-all bg-white ${
        isDragging ? 'ring-2 ring-blue-300 shadow-lg' : 'shadow-sm hover:shadow-md'
      }`}
    >
      {isEditing ? (
        <div className="p-3">
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Task title"
            />
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded min-h-[80px]"
              placeholder="Description (optional)"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setIsEditing(false)} disabled={isSubmitting}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded">
                <X className="h-4 w-4" /> Cancel
              </button>
              <button type="submit" disabled={isSubmitting}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Save
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="p-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">{task.title}</h3>
              {task.description && (
                <p className="text-sm text-gray-600 mt-2">{task.description}</p>
              )}
            </div>
            {/* Drag Handle only area */}
            <div className="cursor-grab text-gray-400 hover:text-gray-600" {...listeners}>
              <GripVertical className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex justify-between items-center pt-2 border-t border-gray-100">
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-blue-600 text-xs flex items-center gap-1">
                <Pencil className="h-4 w-4" /> Edit
              </button>
              <button onClick={handleDelete} disabled={isDeleting}
                className={`text-xs flex items-center gap-1 ${isDeleting ? 'text-gray-400' : 'text-gray-500 hover:text-red-600'}`}>
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
