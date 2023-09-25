---
id: create-button
title: Create
swizzle: true
---

`<CreateButton>` uses Material UI's [`<Button>`](https://mui.com/material-ui/react-button/) component. It uses the `create` method from [`useNavigation`](/api-reference/core/hooks/navigation/useNavigation.md) under the hood. It can be useful to redirect the app to the create page route of resource.

:::info-tip Swizzle
You can swizzle this component with the [**refine CLI**](/docs/packages/documentation/cli) to customize it.
:::

## Usage

```tsx live url=http://localhost:3000/posts previewHeight=340px
const { Create } = RefineMui;
// visible-block-start
import {
    useDataGrid,
    List,
    // highlight-next-line
    CreateButton,
} from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", type: "number" },
    { field: "title", headerName: "Title", minWidth: 400, flex: 1 },
];

const PostsList: React.FC = () => {
    const { dataGridProps } = useDataGrid<IPost>();

    return (
        // highlight-next-line
        <List headerButtons={<CreateButton />}>
            <DataGrid {...dataGridProps} columns={columns} autoHeight />
        </List>
    );
};

interface IPost {
    id: number;
    title: string;
}
// visible-block-end

render(
    <RefineMuiDemo
        resources={[
            {
                name: "posts",
                list: PostsList,
                create: () => <Create>Rest of the page here...</Create>,
            },
        ]}
    />,
);
```

## Properties

### `resource`

It is used to redirect the app to the `create` action path of the given resource name. By default, the app redirects to the inferred resource's `create` action path.

```tsx live disableScroll previewHeight=120px
const { useRouterContext } = RefineCore;

// visible-block-start
import { CreateButton } from "@refinedev/mui";

const MyCreateComponent = () => {
    return (
        <CreateButton
            // highlight-next-line
            resource="categories"
        />
    );
};

// visible-block-end

const CreatePage = () => {
    const params = useRouterContext().useParams();
    return <div>{JSON.stringify(params)}</div>;
};

render(
    <RefineMuiDemo
        initialRoutes={["/"]}
        resources={[
            {
                name: "posts",
            },
            {
                name: "categories",
                create: CreatePage,
            },
        ]}
        DashboardPage={MyCreateComponent}
    />,
);
```

Clicking the button will trigger the `create` method of [`useNavigation`](/api-reference/core/hooks/navigation/useNavigation.md) and then redirect the app to the `create` action path of the resource, filling the necessary parameters in the route.

If you have multiple resources with the same name, you can pass the `identifier` instead of the `name` of the resource. It will only be used as the main matching key for the resource, data provider methods will still work with the `name` of the resource defined in the `<Refine/>` component.

> For more information, refer to the [`identifier` section of the `<Refine/>` component documentation &#8594](/docs/api-reference/core/components/refine-config#identifier)

### `meta`

It is used to pass additional parameters to the `create` method of [`useNavigation`](/api-reference/core/hooks/navigation/useNavigation.md). By default, existing parameters in the route are used by the `create` method. You can pass additional parameters or override the existing ones using the `meta` prop.

If the `create` action route is defined by the pattern: `/posts/:authorId/create`, the `meta` prop can be used as follows:

```tsx
const MyComponent = () => {
    return (
        <CreateButton meta={{ authorId: "10" }} />
    );
};
```

### `hideText`

`hideText` is used to show or hide the text of the button. When `true`, only the button icon is visible.

```tsx live disableScroll previewHeight=120px
const { useRouterContext } = RefineCore;

// visible-block-start
import { CreateButton } from "@refinedev/mui";

const MyCreateComponent = () => {
    return (
        <CreateButton
            // highlight-next-line
            hideText={true}
        />
    );
};

// visible-block-end

const CreatePage = () => {
    const params = useRouterContext().useParams();
    return <div>{JSON.stringify(params)}</div>;
};

render(
    <RefineMuiDemo
        initialRoutes={["/"]}
        resources={[
            {
                name: "posts",
                list: MyCreateComponent,
                create: CreatePage,
            },
        ]}
    />,
);
```

### `accessControl`

The `accessControl` prop can be used to skip access control check with its `enabled` property or to hide the button when the user does not have the permission to access the resource with `hideIfUnauthorized` property. This is relevant only when an [`accessControlProvider`](/api-reference/core/providers/accessControl-provider.md) is provided to [`<Refine/>`](/api-reference/core/components/refine-config.md)

```tsx
import { CreateButton } from "@refinedev/mui";

export const MyListComponent = () => {
    return (
        <CreateButton
            accessControl={{ enabled: true, hideIfUnauthorized: true }}
        />
    );
};
```

### ~~`resourceNameOrRouteName`~~ <PropTag deprecated />

> `resourceNameOrRouteName` prop is deprecated. Use `resource` prop instead.

`resourceNameOrRouteName` is used to redirect the app to the `/create` endpoint of the given resource name. By default, the app redirects to a URL with `/create` defined by the name property of resource object.

```tsx live disableScroll previewHeight=120px
const { useRouterContext } = RefineCore;

// visible-block-start
import { CreateButton } from "@refinedev/mui";

const MyCreateComponent = () => {
    return (
        <CreateButton
            // highlight-next-line
            resourceNameOrRouteName="categories"
        />
    );
};

// visible-block-end

const CreatePage = () => {
    const params = useRouterContext().useParams();
    return <div>{JSON.stringify(params)}</div>;
};

render(
    <RefineMuiDemo
        initialRoutes={["/"]}
        resources={[
            {
                name: "posts",
            },
            {
                name: "categories",
                create: CreatePage,
            },
        ]}
        DashboardPage={MyCreateComponent}
    />,
);
```

Clicking the button will trigger the `create` method of [`useNavigation`](/api-reference/core/hooks/navigation/useNavigation.md) and then redirect to `/posts/create`.

## API Reference

### Properties

<PropsTable module="@refinedev/mui/CreateButton" />

:::tip External Props
It also accepts all props of Material UI [Button](https://mui.com/material-ui/react-button/).
:::
