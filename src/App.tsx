import { useState } from "react";
import Sidebar from "./components/Sidebar.tsx";
import MainContent from './components/MainContent.tsx';
import AddTask from "./components/addTask.tsx";
import Filters from "./components/Filters.tsx"
import './index.css';

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
      }],
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
  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };
  return (
    <div className="h-screen flex flex-row p-4 bg-red">
      <Sidebar
        lists={lists}
        setLists={setLists}
        selectedList={selectedList}
        setSelectedList={setSelectedList}
        setTasks={setTasks}
        tasks={tasks}
      ></Sidebar>
      <MainContent
        selectedList={selectedList}
        Lists={lists}
        tasks={tasks}
        setTasks={setTasks}
        filters={filters}
        searchText={searchText}
        setSearchText={setSearchText}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        setShowModal={setShowModal}
      ></MainContent>

      {showFilters && (
        <Filters filters={filters} handleFilterChange={handleFilterChange} />
      )}
      {showModal && (
        <AddTask
          formData={formData}
          setFormData={setFormData}
          tasks={tasks}
          setShowModal={setShowModal}
          setTasks={setTasks}
          selectedList={selectedList}
        ></AddTask>
      )}
    </div>
  )
}
export default TodoApp;
