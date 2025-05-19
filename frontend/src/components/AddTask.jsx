import { useState } from 'react';
import axios from 'axios';
import { X, Check, Loader2 } from 'lucide-react';

const AddTask = ({ status, onTaskAdded, onCancel }) => {
  const [formData, setFormData] = useState({ title: '', description: '', status });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return; 
    
    setIsSubmitting(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/tasks`, formData);
      onTaskAdded();
      if (onCancel) onCancel();
      setFormData({ title: '', description: '', status });
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <input
            required
            placeholder="Task title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>
        <div className="mb-3">
          <textarea
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button 
            type="button" 
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            <span>Cancel</span>
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Add Task</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;