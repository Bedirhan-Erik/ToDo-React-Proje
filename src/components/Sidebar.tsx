import React from 'react';

interface Task {
  id: string
  name: string
  description: string
  deadline: string
  status: string   
  createDate: string
  dependencies?: string[]
}

interface List {
  id: string;
  name: string;
}

interface SidebarProps {
  lists: List[];
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
  selectedList: string | null;
  setSelectedList: React.Dispatch<React.SetStateAction<string | null>>;
  setTasks: React.Dispatch<React.SetStateAction<Record<string, Task[]>>>;
  tasks: Record<string, Task[]>;
}

function Sidebar({ lists, setLists, selectedList, setSelectedList, setTasks, tasks }: SidebarProps){

  const deleteList = (id: string): void => {
    setLists(lists.filter((list: List) => list.id !== id));
    const newTasks: Record<string, Task[]> = { ...tasks };
    delete newTasks[id];
    setTasks(newTasks);

    if (selectedList === id) {
      const next: List | undefined = lists.find((list: List) => list.id !== id);
      setSelectedList(next ? next.id : null);
    }
  };

  const addNewList = (): void => {
    const newId: string = Date.now().toString();
    const listNumber: number = lists.length + 1;
    const newList: List = {
      id: newId,
      name: `New List ${listNumber}`
    };
    setLists([...lists, newList]);
    setTasks({ ...tasks, [newId]: [] });
    setSelectedList(newId);
  };

  return (
    <div className="w-100% min-w-100% bg-white border-r border-gray-300 h-full flex flex-col">
      <div className="p-5 flex flex-col">
        <div className="flex justify-between items-center mb-5 gap-x-3">
          <h1 className='text-lg font-bold text-gray-800'>To-Do Lists</h1>
          <button 
            onClick={addNewList} 
            className="bg-gray-200 hover:bg-gray-300 rounded text-lg w-12 h-8"
          >
            +
          </button>
        </div>
        <div>
          {lists.map((list: List) => (
            <div key={list.id} className="flex items-center mb-2">
              <button
                onClick={() => setSelectedList(list.id)}
                className={`flex-1 text-left py-2 px-6 rounded-lg text-lg ${selectedList === list.id ? 'active' : ''}`}
              >
                {list.name}
              </button>
              <button
                onClick={() => deleteList(list.id)}
                className="ml-auto text-black hover:text-red-700 text-sm"
                title="delete list"
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;