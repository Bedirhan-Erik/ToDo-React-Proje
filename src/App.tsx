import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import MainContent from './components/MainContent';
import AddTask from "./components/addTask";
import Filters from "./components/Filters";
import './index.css';

interface Task {
  id: number;
  name: string;
  description: string;
  deadline: string;
  status: string
  createDate?: string;
  dependencies?: number[];
}

interface List {
  id: number;
  name: string;
}

interface Post {
  id: string | number;
  title: string;
  deadline: string;
  dependencies?: number[];
}

interface FormData {
  name: string;
  description: string;
  deadline: string;
  status: string
  dependencies: number[];
}

interface FiltersState {
  status: string
  name: string
  expired: boolean
  orderBy: 'Name' | 'Create Date' | 'Deadline' | 'Status';
}

type FilterKeys = keyof FiltersState;
type FilterValues = FiltersState[FilterKeys];

const convertPostToTask = (post: Post): Task => ({
  id: Number(post.id),
  name: post.title,
  description: "Fake Server JSON",
  deadline: post.deadline,
  status: "Not Started",
  createDate: new Date().toISOString().split("T")[0],
  dependencies: post.dependencies || []
});

function TodoApp() {
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    deadline: '',
    status: 'Not Started',
    dependencies: []
  });

  const [lists, setLists] = useState<List[]>([
    { id: 1, name: 'Example List 1' },
    { id: 2, name: 'Example List 2' },
    { id: 3, name: 'Example List 3' }
  ]);

  const [selectedList, setSelectedList] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  const [filters, setFilters] = useState<FiltersState>({
    status: 'Any',
    name: '',
    expired: false,
    orderBy: 'Create Date'
  });

  const [tasks, setTasks] = useState<Record<number, Task[]>>({
    1: [{
      id: 1,
      name: "task 1",
      description: "Task 1 Description..",
      deadline: "07.30.2025",
      status: "Not Started",
      dependencies: [2]
    },
    {
      id: 2,
      name: "task 2",
      description: "Task 2 Description..",
      deadline: "07.29.2025",
      status: "In Progress"
    }
    ],
    2: [],
    3: []
  });

  useEffect(() => {
    fetch('http://localhost:4000/posts')
      .then((res: Response) => res.json())
      .then((data: Post[]) => {
        const postsAsTasks: Task[] = data.map(convertPostToTask);
        setTasks((prevTasks: Record<number, Task[]>) => {
          const existingIds: Set<number> = new Set((prevTasks[1] || []).map((t: Task) => t.id));
          const newTasks: Task[] = postsAsTasks.filter((task: Task) => !existingIds.has(task.id));
          return {
            ...prevTasks,
            1: [...(prevTasks[1] || []), ...newTasks]
          };
        });
      })
      .catch((error: Error) => {
        console.error('Error fetching posts:', error);
      });
  }, []);

  const handleFilterChange = (key: FilterKeys, value: FilterValues): void => {
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
      />
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
        posts={[]}
      />

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
        />
      )}
    </div>
  );
}

export default TodoApp;