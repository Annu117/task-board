import { DndContext, closestCorners } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import Column from './Column';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Board = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
  ];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/tasks`);
      setTasks(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeTask = tasks.find(t => t.id === Number(active.id));
    const overTask = tasks.find(t => t.id === Number(over.id));

    if (!activeTask || !overTask) return;

    const sourceStatus = activeTask.status;
    const targetStatus = overTask.status;

    let newTasks = [...tasks];

    if (sourceStatus === targetStatus) {
      const sameStatusTasks = newTasks.filter(t => t.status === sourceStatus);
      const oldIndex = sameStatusTasks.findIndex(t => t.id === activeTask.id);
      const newIndex = sameStatusTasks.findIndex(t => t.id === overTask.id);

      const reordered = arrayMove(sameStatusTasks, oldIndex, newIndex).map((t, idx) => ({ ...t, order: idx }));

      newTasks = newTasks.map(t => reordered.find(r => r.id === t.id) || t);
    } else {
      // Move to another column
      newTasks = newTasks.map(t => {
        if (t.id === activeTask.id) {
          return { ...t, status: targetStatus, order: 0 };
        }
        return t;
      });

      const reorderedTarget = newTasks
        .filter(t => t.status === targetStatus)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((t, idx) => ({ ...t, order: idx }));

      newTasks = newTasks.map(t => reorderedTarget.find(r => r.id === t.id) || t);
    }

    setTasks(newTasks);

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/tasks/${Number(activeTask.id)}`, {
        ...activeTask,
        status: targetStatus,
        order: 0
      });
      
    } catch {
      toast.error('Failed to update task. Reverting.');
      fetchTasks();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <p className="text-red-600 font-medium">{error}</p>
        <button onClick={fetchTasks} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Retry</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="flex flex-col md:flex-row gap-6">
          {columns.map(col => (
            <SortableContext
              key={col.id}
              items={tasks.filter(t => t.status === col.title).map(t => t.id.toString())}
              strategy={rectSortingStrategy}
            >
              <Column
                columnId={col.id}
                title={col.title}
                tasks={tasks.filter(t => t.status === col.title)}
                onTaskChange={fetchTasks}
              />
            </SortableContext>
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default Board;