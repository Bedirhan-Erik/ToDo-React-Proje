import { useState } from "react";

function AddTask({ formData, setFormData, tasks, setTasks, selectedList, setShowModal }) {
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 

    if (!formData.name || !formData.description || !formData.deadline) {
      setError("All fields are required.");
      return;
    }

    const newTask = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      deadline: formData.deadline,
      status: formData.status,
      createDate: new Date().toISOString().split('T')[0],
      dependencies: formData.dependencies || []
    };

    setTasks({
      ...tasks,
      [selectedList]: [...(tasks[selectedList] || []), newTask],
    });

    setFormData({ name: '', description: '', deadline: '', status: 'Not Started', dependencies: [] });
    setShowModal(false);
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form onSubmit={handleSubmit} className="bg-white border py-4 px-5 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>

        <input
          type="text"
          placeholder="Task name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-xl"
        />

        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-xl"
        />

        <input
          type="date"
          value={formData.deadline}
          onChange={(e) => handleInputChange("deadline", e.target.value)}
          className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-xl"
        />

        <div className="mb-3">
          <label className="block font-medium mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="block font-medium mb-2">Dependencies</label>
          {tasks[selectedList]?.map(task => (
            <label key={task.id} className="block">
              <input
                type="checkbox"
                value={task.id}
                checked={formData.dependencies?.includes(task.id)}
                onChange={() => {
                  const dependencies = formData.dependencies || [];
                  if (dependencies.includes(task.id)) {
                    setFormData({
                      ...formData,
                      dependencies: dependencies.filter(id => id !== task.id)
                    });
                  } else {
                    setFormData({
                      ...formData,
                      dependencies: [...dependencies, task.id]
                    });
                  }
                }}
                className="mr-2 accent-black"
              />
              {task.name}
            </label>
          ))}
        </div>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTask;
