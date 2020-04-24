export type Task = {
    taskId: string,
    status: string,
    description: string,
    timestamp: string,
    response: TaskResponse,
    [key: string]: any
}

export type TaskResponse = {
    resourceId: number, 
    [key: string]: any
}