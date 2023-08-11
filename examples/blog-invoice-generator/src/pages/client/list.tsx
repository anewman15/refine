import { HttpError, IResourceComponentsProps } from "@refinedev/core";

import {
    CreateButton,
    List,
    useDrawerForm,
    useSimpleList,
} from "@refinedev/antd";

import { List as AntdList } from "antd";

import { ClientItem, CreateClient, EditClient } from "components/client";
import { IClient } from "interfaces";

export const ClientList: React.FC<IResourceComponentsProps> = () => {
    const { listProps } = useSimpleList<IClient>({
        metaData: { populate: ["contacts"] },
    });

    const {
        drawerProps: createDrawerProps,
        formProps: createFormProps,
        saveButtonProps: createSaveButtonProps,
        show: createShow,
    } = useDrawerForm<IClient, HttpError, IClient>({
        action: "create",
        resource: "clients",
        redirect: false,
    });

    const {
        drawerProps: editDrawerProps,
        formProps: editFormProps,
        saveButtonProps: editSaveButtonProps,
        show: editShow,
    } = useDrawerForm<IClient, HttpError, IClient>({
        action: "edit",
        resource: "clients",
        redirect: false,
        metaData: {
            populate: ["contacts"],
        },
    });

    return (
        <>
            <List
                headerProps={{
                    extra: <CreateButton onClick={() => createShow()} />,
                }}
            >
                <AntdList
                    grid={{ gutter: 24, xs: 1 }}
                    {...listProps}
                    renderItem={(item) => (
                        <AntdList.Item>
                            <ClientItem item={item} editShow={editShow} />
                        </AntdList.Item>
                    )}
                />
            </List>
            <CreateClient
                drawerProps={createDrawerProps}
                formProps={createFormProps}
                saveButtonProps={createSaveButtonProps}
            />
            <EditClient
                drawerProps={editDrawerProps}
                formProps={editFormProps}
                saveButtonProps={editSaveButtonProps}
            />
        </>
    );
};
