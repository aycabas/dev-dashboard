export interface DevOpsModel {
    id?: string;
    url?: string;
    fields: DevOpsFieldsModel;
}

export interface DevOpsFieldsModel {
    title?: string;
    workItemType?: string;
    createdBy?: DevOpsFieldsCreatedByModel;
}

export interface DevOpsFieldsCreatedByModel {
    displayName?: string;
    links?: DevOpsFieldsCreatedByAvatarModel;
}
export interface DevOpsFieldsCreatedByAvatarModel {
    avatar?: DevOpsFieldsCreatedByAvatarHrefModel;
}
export interface DevOpsFieldsCreatedByAvatarHrefModel {
    href?: string;
}
