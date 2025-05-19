import { useState } from 'react';
import axios from 'axios';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Pencil, 
  Trash2, 
  X, 
  Check, 
  GripVertical, 
  Loader2, 
  Clock, 
  CalendarClock 
} from 'lucide-react';

const TaskCard = ({ task, onTaskUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(task);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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
    zIndex: isDragging ? 100 : 1,
  };

  const getPriorityColor = () => {
    const priority = task.priority || 'medium';
    switch(priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
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

  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`mb-3 rounded-lg transition-all ${
        isDragging ? 'ring-2 ring-blue-400 shadow-lg bg-white' : 'bg-white shadow-sm hover:shadow-md'
      }`}
    >
      {isEditing ? (
        <div className="p-3">
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Task title"
            />
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description (optional)"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Priority</label>
                <select 
                  value={formData.priority || 'medium'} 
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Due Date</label>
                <input 
                  type="date" 
                  value={formData.dueDate || ''} 
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button"
                onClick={() => setIsEditing(false)} 
                disabled={isSubmitting}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded transition-colors"
              >
                <X className="h-3.5 w-3.5" /> Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded transition-colors"
              >
                {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                Save
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div 
          className="relative p-3"
          onClick={() => !isDragging && setShowDetails(!showDetails)}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {formData.priority && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityColor()}`}>
                    {formData.priority}
                  </span>
                )}
                {formData.dueDate && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CalendarClock className="w-3 h-3" />
                    {new Date(formData.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              
              <h3 className="font-medium text-gray-800 mt-2">
                {showDetails ? task.title : truncateText(task.title, 40)}
              </h3>
              
              {(task.description && showDetails) && (
                <p className="text-sm text-gray-600 mt-2">{task.description}</p>
              )}
              {(task.description && !showDetails) && (
                <p className="text-sm text-gray-600 mt-1">{truncateText(task.description, 60)}</p>
              )}
            </div>
            {/* Drag Handle */}
            <div 
              className="cursor-grab text-gray-400 hover:text-gray-600" 
              {...listeners}
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex justify-between items-center pt-2 border-t border-gray-100">
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => setIsEditing(true)} 
                className="text-gray-500 hover:text-blue-600 text-xs flex items-center gap-1 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button 
                onClick={handleDelete} 
                disabled={isDeleting}
                className={`text-xs flex items-center gap-1 transition-colors ${isDeleting ? 'text-gray-400' : 'text-gray-500 hover:text-red-600'}`}
              >
                {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
            <div className="text-xs text-gray-400">
              {showDetails ? 'Click to collapse' : 'Click to expand'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
