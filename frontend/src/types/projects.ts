export interface UserBasic {
    id: number;
    name: string;
    email: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'done' | 'overdue';
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Project {
    id: number;
    name: string;
    description: string;
    owner: UserBasic;
    created_at: string;
    tasks?: Task[];
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    due_date: string;
    assignee?: UserBasic;
    project?: Pick<Project, 'id' | 'name'>;
}