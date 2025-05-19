from flask import Flask, jsonify, request, abort
from flask_cors import CORS
import json
import os
# from waitress import serve


app = Flask(__name__)
CORS(app)
# DATA_FILE = 'tasks.json'
DATA_FILE = os.path.join(os.path.dirname(__file__), 'tasks.json')

def read_tasks():
    if not os.path.exists(DATA_FILE):
        initial_data = [
            {"id": 1, "title": "Research project requirements", "description": "Gather all necessary information about the project scope and objectives", "status": "To Do", "order": 0},
            {"id": 2, "title": "Create wireframes", "description": "Design basic wireframes for UI components", "status": "In Progress", "order": 1},
            {"id": 3, "title": "Setup development environment", "description": "Install all required tools and libraries", "status": "Done", "order": 2}
        ]
        with open(DATA_FILE, 'w') as f:
            json.dump(initial_data, f, indent=2)
        return initial_data
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def write_tasks(tasks):
    with open(DATA_FILE, 'w') as f:
        json.dump(tasks, f, indent=2)

def handler(request):
    return {
        "statusCode": 200,
        "body": "Hello from Python Serverless!"
    }

@app.route('/')
def index():
    return jsonify({'message': 'Flask Task Manager API is running!'}), 200

@app.route('/tasks', methods=['GET'])
def get_tasks():
    return jsonify(read_tasks())

@app.route('/tasks', methods=['POST'])
def create_task():
    if not request.json or 'title' not in request.json:
        abort(400, description="Title is required")

    new_task = request.json
    tasks = read_tasks()

    new_task['id'] = max(task['id'] for task in tasks) + 1 if tasks else 1
    if 'description' not in new_task:
        new_task['description'] = ""
    if 'status' not in new_task:
        new_task['status'] = "To Do"
    if 'order' not in new_task:
        new_task['order'] = max((task.get('order', 0) for task in tasks), default=0) + 1

    tasks.append(new_task)
    write_tasks(tasks)
    return jsonify(new_task), 201

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    if not request.json:
        abort(400, description="No data provided")

    tasks = read_tasks()
    task_index = next((i for i, t in enumerate(tasks) if t['id'] == task_id), None)

    if task_index is None:
        abort(404, description=f"Task with ID {task_id} not found")

    updated_task = request.json
    updated_task['id'] = task_id

    tasks[task_index] = updated_task
    write_tasks(tasks)
    print(f"[UPDATE] Task {task_id}:", updated_task)
    return jsonify(updated_task)

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    tasks = read_tasks()
    initial_length = len(tasks)
    tasks = [t for t in tasks if t['id'] != task_id]

    if len(tasks) == initial_length:
        abort(404, description=f"Task with ID {task_id} not found")

    write_tasks(tasks)
    print(f"[DELETE] Task {task_id} deleted")
    return jsonify({'message': f'Task {task_id} deleted successfully'})

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found', 'message': str(error)}), 404

@app.errorhandler(400)
def bad_request(error):
    return jsonify({'error': 'Bad request', 'message': str(error)}), 400

if __name__ == "__main__":
    # app.run(debug=True)
    app.run(host="0.0.0.0", port=5000)
