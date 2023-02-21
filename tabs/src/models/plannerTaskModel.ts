export interface TaskModel {
    id: string;
    name: string;
    percentComplete?: string;
    priority?: string;
    createdDateTime?: string;
    assignments?: TaskAssignedToModel[];
}

export interface TaskAssignedToModel {
    userId: string;
    userDisplayName: string;
    userAvatar: any;
}
