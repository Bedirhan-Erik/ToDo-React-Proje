import { useState } from 'react';
import './App.css';

function TodoApp() {
  const [lists, setLists] = useState([
    { id: 1, name: 'Example List 1' },
    { id: 2, name: 'Example List 2' },
    { id: 3, name: 'Example List 3' }
  ]);
  const [selectedList, setSelectedList] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'Any',
    name: '',
    expired: false,
    orderBy: 'Create Date'
  });
  const [tasks, setTasks] = useState({
    1: [
      {
        id: 1,
        name: 'Task 1',
        description: 'First task description',
        deadline: '2024-08-05',
        status: 'Not Started',
        createDate: '2024-08-01'
      },
      {
        id: 2,
        name: 'Task 2',
        description: 'Second task description',
        deadline: '2024-08-10',
        status: 'In Progress',
        createDate: '2024-08-02'
      },
      {
        id: 3,
        name: 'Task 3',
        description: 'Third task description',
        deadline: '2024-07-15',
        status: 'Completed',
        createDate: '2024-07-10'
      }
    ],
    2: [],
    3: []
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    deadline: '',
    status: 'Not Started',
    dependencies: []
  });

  const toggleTaskCompleted = (taskId) => {
    setTasks({
      ...tasks, [selectedList]: tasks[selectedList].map(task =>
        task.id === taskId ? { ...task, status: task.status === 'Completed' ? 'Not Started' : 'Completed' } : task
      )
    });
  };

  const deleteList = (id) => {
    setLists(lists.filter(list => list.id !== id));
    const newTasks = { ...tasks };
    delete newTasks[id];
    setTasks(newTasks);

    if (selectedList === id) {
      const next = lists.find(l => l.id !== id);
      setSelectedList(next ? next.id : null);
    }
  };
  const addNewList = () => {
    const newId = Date.now();
    const newList = {
      id: newId,
      name: `New List ${lists.length + 1}`
    };
    setLists([...lists, newList]);
    setTasks({ ...tasks, [newId]: [] });
    setSelectedList(newId);
  };
  const selectList = (listId) => {
    setSelectedList(listId);
  };
  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setFormData({
      name: '',
      description: '',
      deadline: '',
      status: 'Not Started',
      dependencies: []
    });
  };
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  const saveTask = () => {
    if (!formData.name.trim()) return;
    if (!selectedList || !tasks[selectedList]) {
      alert("please select a list");
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
      [selectedList]: [...tasks[selectedList], newTask]
    });

    closeModal();
  };
  const filterTasks = (taskList) => {
    let filtered = taskList;
    if (filters.name) {
      filtered = filtered.filter(task =>
        task.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    if (filters.status !== 'Any') {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    if (filters.expired) {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(task => task.deadline < today);
    }

    filtered.sort((a, b) => {
      switch (filters.orderBy) {
        case 'Name':
          return a.name.localeCompare(b.name);
        case 'Create Date':
          return new Date(a.createDate) - new Date(b.createDate);
        case 'Deadline':
          return new Date(a.deadline) - new Date(b.deadline);
        case 'Status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
    return filtered;
  };

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };
  const deleteTask = (taskId) => {
    setTasks({
      ...tasks,
      [selectedList]: tasks[selectedList].filter(task => task.id !== taskId)
    });
  };
  const selectedListName = lists.find(list => list.id === selectedList)?.name || 'To-Do List';

  const isDependencyCompleted = (task) => {
    if (!task.dependencies || task.dependencies.length === 0) return true;
    return task.dependencies.every(depId => tasks[selectedList].find(t => t.id === depId && t.status === 'Completed'));
  };

  return (
    <div className="todo-container">
      <div className="sidebar">
        <div className="sidebar-inner">
          <div className="sidebar-header">
            <h1>To-Do Lists</h1>
            <button onClick={addNewList} className="add-list-button">+</button>
          </div>
          <div className="sidebar-lists">
            {lists.map(list => (
              <div key={list.id} className="sidebar-list-row">
                <button
                  onClick={() => selectList(list.id)}
                  className={`sidebar-list-item ${selectedList === list.id ? 'active' : ''}`}
                >
                  {list.name}
                </button>
                <button
                  onClick={() => deleteList(list.id)}
                  className="sidebar-list-delete"
                  title="Listeyi Sil"
                >x</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="main-content">
        <div className="main-inner">
          <div className="main-header">
            <h2>{selectedListName}</h2>
            <div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`filters-button ${showFilters ? 'active' : ''}`}
              >
                Filters
              </button>
            </div>
          </div>
          {showFilters && (
            <div className="filters-container">
              <h3 className="filters-header">Filters</h3>
              <div className="filters-grid">
                <div>
                  <label className="filters-label">Status</label>
                  <div className="relative">
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="filters-select"
                    >
                      <option value="Any">Any</option>
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="filters-label">Name</label>
                  <input
                    type="text"
                    value={filters.name}
                    onChange={(e) => handleFilterChange('name', e.target.value)}
                    className="filters-input"
                    placeholder="Filter by name..."
                  />
                </div>
                <div>
                  <label className="filters-label">
                    <input
                      type="checkbox"
                      checked={filters.expired}
                      onChange={(e) => handleFilterChange('expired', e.target.checked)}
                      className="filters-checkbox"
                    />
                    Expired
                  </label>
                </div>
                <div>
                  <label className="filters-label">Order by</label>
                  <div className="filters-group">
                    {['Name', 'Create Date', 'Deadline', 'Status'].map(option => (
                      <label key={option} className="filters-group-label">
                        <input
                          type="radio"
                          name="orderBy"
                          value={option}
                          checked={filters.orderBy === option}
                          onChange={(e) => handleFilterChange('orderBy', e.target.value)}
                          className="filters-group-input"
                        />
                        <span className="filters-group-label">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="search-container">
            <input
              type="text"
              placeholder="search tasks..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="search-input"
            />
          </div>
          <table className="task-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Done</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tasks[selectedList] && filterTasks(tasks[selectedList])
                .filter(task => task.name.toLowerCase().includes(searchText.toLowerCase()))
                .map(task => (
                  <tr key={task.id}>
                    <td>{task.name}</td>
                    <td>{task.description}</td>
                    <td>{task.deadline}</td>
                    <td>{task.status}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={task.status === "Completed"}
                        onChange={() => toggleTaskCompleted(task.id)}
                        disabled={!isDependencyCompleted(task, tasks[selectedList]) ? "Dependencies not completed" : ""}
                      />
                    </td>
                    <td>
                      <button onClick={() => deleteTask(task.id)} className="task-delete-button">
                        x
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <button
            onClick={openModal}
            className="add-task-button"
          >
            + New Add Task
          </button>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add To-Do Item</h3>
              <button
                onClick={closeModal}
                className="modal-close-button"
              >
                x
              </button>
            </div>
            <div className="modal-body">
              <div>
                <label className="modal-label">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="modal-input"
                  placeholder="task name..."
                />
              </div>
              <div>
                <label className="modal-label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="modal-input"
                  placeholder="task description..."
                />
              </div>
              <div className="modal-input">
                <div>
                  <label className="modal-label">Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    className="modal-date-input"
                  />
                </div>
                <div>
                  <label className="modal-label">Status</label>
                  <div className="relative">
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="modal-label">Dependencies</label>
                    {tasks[selectedList]?.map(task => (
                      <label key={task.id} className="modal-checkbox">
                        <input
                          type="checkbox"
                          value={task.id}
                          checked={formData.dependencies.includes(task.id)}
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
                        ></input>
                        {task.name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={closeModal}
                className="modal-close-button"
              >
                Cancel
              </button>
              <button
                onClick={saveTask}
                className="modal-add-button"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoApp;
