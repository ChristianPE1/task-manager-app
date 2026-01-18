
export interface Project {
    id: number;
    name: string;
    description: string;
    owner: {
        id: number;
        name: string;
        email: string;
    };
    tasks?: Task[];
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    due_date: string;
}