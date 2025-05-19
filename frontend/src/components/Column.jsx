import { useState, useMemo } from 'react';
import { PlusCircle, X, ArrowDownUp, Filter } from 'lucide-react';
import TaskCard from './TaskCard';
import AddTask from './AddTask';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Column = ({ columnId, title, tasks, onTaskChange }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [sortBy, setSortBy] = useState('order');
  const [showOptions, setShowOptions] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: columnId,
    data: {
      type: 'column',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const columnColors = {
    todo: { 
      bg: 'bg-blue-50', 
      header: 'bg-blue-500', 
      border: 'border-blue-200',
      hover: 'hover:bg-blue-600'
    },
    inprogress: { 
      bg: 'bg-amber-50', 
      header: 'bg-amber-500', 
      border: 'border-amber-200',
      hover: 'hover:bg-amber-600'
    },
    done: { 
      bg: 'bg-green-50', 
      header: 'bg-green-500', 
      border: 'border-green-200',
      hover: 'hover:bg-green-600'
    }
  };

  const colors = columnColors[columnId] || columnColors.todo;

  const sortedTasks = useMemo(() => {
    if (!tasks.length) return [];
    
    const tasksCopy = [...tasks];
    
    switch (sortBy) {
      case 'name':
        return tasksCopy.sort((a, b) => a.title.localeCompare(b.title));
      case 'priority': {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return tasksCopy.sort((a, b) => {
          const aPriority = a.priority || 'medium';
          const bPriority = b.priority || 'medium';
          return priorityOrder[aPriority] - priorityOrder[bPriority];
        });
      }
      case 'dueDate':
        return tasksCopy.sort((a, b) => {
          // Tasks without due dates go to the bottom
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
      case 'order':
      default:
        return tasksCopy.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
  }, [tasks, sortBy]);

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`w-full md:w-80 rounded-lg shadow-md border ${colors.border} flex flex-col ${isDragging ? 'opacity-50' : ''} transition-all`}
    >
      <div 
        className={`${colors.header} text-white p-3 rounded-t-lg flex justify-between items-center relative`}
        {...listeners}
      >
        <div className="flex justify-between items-center w-full cursor-grab">
          <h2 className="font-bold text-lg">{title}</h2>
          <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </div>
        </div>
        
        <div className="absolute right-0 top-full z-10 mt-1">
          {showOptions && (
            <div className="bg-white rounded-md shadow-lg border p-2 w-48">
              <div className="text-gray-800 font-medium text-sm mb-2 pb-1 border-b">Sort by</div>
              <div className="space-y-1">
                <button 
                  onClick={() => {setSortBy('order'); setShowOptions(false);}}
                  className={`w-full text-left text-sm p-1 rounded ${sortBy === 'order' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                >
                  Default order
                </button>
                <button 
                  onClick={() => {setSortBy('name'); setShowOptions(false);}}
                  className={`w-full text-left text-sm p-1 rounded ${sortBy === 'name' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                >
                  Task name
                </button>
                <button 
                  onClick={() => {setSortBy('priority'); setShowOptions(false);}}
                  className={`w-full text-left text-sm p-1 rounded ${sortBy === 'priority' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                >
                  Priority
                </button>
                <button 
                  onClick={() => {setSortBy('dueDate'); setShowOptions(false);}}
                  className={`w-full text-left text-sm p-1 rounded ${sortBy === 'dueDate' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                >
                  Due date
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-2 border-b border-gray-200 bg-white flex items-center justify-between">
        <button 
          onClick={() => setShowOptions(!showOptions)}
          className="text-xs flex items-center gap-1 text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-100"
        >
          <ArrowDownUp className="h-3 w-3" /> Sort
        </button>
        <div className="text-xs text-gray-500">
          {sortBy !== 'order' && (
            <div className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full flex items-center">
              Sorted by: {sortBy === 'name' ? 'Name' : sortBy === 'priority' ? 'Priority' : 'Due date'}
              <button 
                onClick={() => setSortBy('order')}
                className="ml-1 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={`flex-grow p-3 min-h-[300px] ${colors.bg} overflow-y-auto`} style={{ maxHeight: 'calc(100vh - 250px)' }}>
        {tasks.length === 0 && (
          <div className="text-sm text-gray-400 flex flex-col items-center justify-center h-full">
            <p>No tasks yet</p>
            <p>Drag here or add a new one</p>
          </div>
        )}
        
        <SortableContext items={sortedTasks.map(t => t.id.toString())} strategy={rectSortingStrategy}>
          {sortedTasks.map((task) => (
            <TaskCard key={task.id} task={task} onTaskUpdated={onTaskChange} />
          ))}
        </SortableContext>
      </div>

      <div className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
        {isAdding ? (
          <AddTask status={title} onTaskAdded={() => {
            onTaskChange();
            setIsAdding(false);
          }} onCancel={() => setIsAdding(false)} />
        ) : (
          <button 
            onClick={() => setIsAdding(true)} 
            className={`w-full py-2 flex items-center justify-center gap-2 bg-white border border-gray-200 text-${colors.header.split('-')[1]}-600 hover:bg-gray-50 rounded-md transition-colors`}
          >
            <PlusCircle className="h-4 w-4" />
            Add Task
          </button>
        )}
      </div>
    </div>
  );
};

export default Column;
