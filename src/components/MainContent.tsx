
function MainContent({ selectedList, Lists, tasks, setTasks, filters,searchText,
  setSearchText, showFilters, setShowFilters, setShowModal}) {

  const selectedListName = Lists.find(l => l.id === selectedList)?.name || "To-Do List";

  const toggleTaskCompleted = (taskId) => {
    setTasks({
      ...tasks,
      [selectedList]: tasks[selectedList].map(task =>
        task.id === taskId ? { ...task, status: task.status === "Completed" ? "Not Started" : "Completed" } : task
      )
    });
  };

  const deleteTask = (taskId) => {
    setTasks({
      ...tasks,
      [selectedList]: tasks[selectedList].filter(task => task.id !== taskId)
    });
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
          return new Date(a.createDate).getTime() - new Date(b.createDate).getTime();
        case 'Deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'Status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
    return filtered;
  };

  const isDependencyCompleted = (task, taskList) => {
    if (!task.dependencies || task.dependencies.length === 0) return true;
    return task.dependencies.every(depId => taskList.find(t => t.id === depId && t.status === 'Completed'));
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
      <div className="bg-white p-6 mt-4 w-full max-w-4xl flex flex-col gap-2">
        <div className="flex flex-col  sm:flex-row sm:justify-between sm:items-center mb-6">
          <h2 className='text-2xl font-semibold'>{selectedListName}</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-2 rounded font-medium border border-gray-300 bg-gray-100 hover:bg-gray-200"
          >
            Filters
          </button>
        </div>
        <div className="mb-2">
          <input
            type="text"
            placeholder="search tasks..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-[95%] px-5 py-2 border border-gray-300 rounded-xl bg-white shadow text-base focus:border-black"
          />
        </div>

        <div className="w-full flex justify-center">
          <table className="w-full min-w-[700px] border-collapse rounded-xl">
            <thead>
              <tr className="bg-gray-200">
                <th className='p-4 text-center'>Name</th>
                <th className='p-4 text-center'>Description</th>
                <th className='p-4 text-center'>Deadline</th>
                <th className='p-4 text-center'>Status</th>
                <th className='p-4 text-left'>Done</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tasks[selectedList] && filterTasks(tasks[selectedList])
                .filter(task => task.name.toLowerCase().includes(searchText.toLowerCase()))
                .map(task => (
                  <tr key={task.id}>
                    <td className='p-4'>{task.name}</td>
                    <td className='p-4'>{task.description}</td>
                    <td className='p-4'>{task.deadline}</td>
                    <td className='p-4'>{task.status}</td>
                    <td className='p-4'>
                      <input
                        type="checkbox"
                        checked={task.status === "Completed"}
                        onChange={() => toggleTaskCompleted(task.id)}
                        disabled={!isDependencyCompleted(task, tasks[selectedList])}
                        className='accent-black'
                      />
                    </td>
                    <td className='p-4'>
                      <button onClick={() => deleteTask(task.id)} className="text-lg hover:text-red-700 text-black">
                        x
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className='mt-4 flex justify-end'>
          <button
            onClick={() => setShowModal(true)}
            className="mt-6 w-full border-2 border-dashed border-gray-300 rounded-xl bg-gray-100 py-4 text-lg font-light hover:bg-gray-300"
          >
            + New Add Task
          </button>
        </div>
      </div>

    </div>

  );
}

export default MainContent;
