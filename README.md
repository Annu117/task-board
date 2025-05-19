# TaskBoard - Kanban-style Task Management App
*A modern Trello-like task board with drag-and-drop functionality*

**Live Demo:** [Frontend on Vercel](https://task-board--sable.vercel.app/)  
**Backend API:** [Backend on Render](https://task-board-jqed.onrender.com/)

## Features

- 🗂️ Three interactive columns: To Do, In Progress, Done
- ✨ Create/edit/delete tasks
- 🖱️ Smooth drag-and-drop between columns using Dnd Kit
- 🔄 Auto-save task positions and statuses
- 📱 Mobile-responsive design
- ⚡ Optimistic UI updates

## Tech Stack

**Frontend:**
- React + Vite
- Dnd Kit (drag-and-drop library)
- Tailwind CSS + Lucide icons
- Axios for API communication

**Backend:**
- Python/Flask REST API
- JSON-based storage
- Flask-CORS for cross-origin support

## Installation

### Backend Setup

```bash
# Clone repository
git clone https://github.com/Annu117/task-board.git
cd task-board/backend

# Install dependencies
pip install flask flask-cors

# Start server (Port 5000)
python app.py
```

### Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment
echo "REACT_APP_API_URL=http://localhost:5000" > .env

# Start dev server (Port 3000)
npm run dev
```

## Key Implementation Details

### Drag-and-Drop Architecture
- **Dnd Kit Core** for drag handling
- **Collision Detection** with closestCorners strategy
- Smooth CSS transitions during reordering

### Critical Fixes & Optimizations
1. **Column ID Synchronization**
   - Unified column IDs between backend and frontend
   - Created status mapping system for display names

2. **Drag State Management**
   - Implemented proper transform/transition handling
   - Added visual feedback with opacity changes
   - Optimized re-renders with memoized sorted tasks

3. **API Integration**
   - Real-time sync with backend on drop events
   - Error recovery with automatic state refresh

## File Structure

```
task-board/
├── backend/
│   ├── app.py            # Flask API endpoints
│   └── tasks.json        # JSON data file (created automatically)
├── src/
│   ├── components/
│   │   ├── AddTask.jsx   # Component for adding new tasks
│   │   ├── Board.jsx     # Drag context
│   │   ├── Column.jsx    # Column component that renders tasks
│   │   └── Task.jsx      # Individual task component
│   │   └── TaskCard.jsx  # Draggable items
│   ├── App.js            # Root React component
│   └── index.js          # Entry point for React app

```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/tasks` | GET | Get all tasks |
| `/tasks` | POST | Create new task |
| `/tasks/{id}` | PUT | Update task |
| `/tasks/{id}` | DELETE | Delete a task |

---

**Built with ❤️ using Modern Web Technologies**  
[![GitHub](https://img.shields.io/badge/Repo_Stars-Welcome!-blue?logo=github)](https://github.com/Annu117/task-board)
```
