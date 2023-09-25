---
id: refresh-button
title: Refresh
swizzle: true
---

`<RefreshButton>` uses Ant Design's [`<Button>`](https://ant.design/components/button/) component to update the data shown on the page via the [`useInvalidate`][use-invalidate] hook.

:::info-tip Swizzle
You can swizzle this component to customize it with the [**refine CLI**](/docs/packages/documentation/cli)
:::

## Usage

```tsx live
// visible-block-start
import { useShow } from "@refinedev/core";
import {
    // highlight-next-line
    RefreshButton,
    Show,
} from "@refinedev/antd";
import { Typography } from "antd";

const { Title, Text } = Typography;

const PostShow: React.FC = () => {
    const { queryResult } = useShow<IPost>();
    const { data, isLoading } = queryResult;
    const record = data?.data;

    return (
        <Show
            isLoading={isLoading}
            // highlight-next-line
            headerButtons={<RefreshButton />}
        >
            <Title level={5}>Id</Title>
            <Text>{record?.id}</Text>

            <Title level={5}>Title</Title>
            <Text>{record?.title}</Text>
        </Show>
    );
};

interface IPost {
    id: string;
    title: string;
}
// visible-block-end

render(
    <RefineAntdDemo
        initialRoutes={["/posts/show/123"]}
        resources={[
            {
                name: "posts",
                show: PostShow,
                list: () => {
                    return (
                        <RefineAntd.List>
                            <p>Your list page here</p>
                        </RefineAntd.List>
                    );
                },
            },
        ]}
    />,
);
```

## Properties

### `recordItemId`

`recordItemId` allows us to manage which data is going to be refreshed.

```tsx live disableScroll previewHeight=120px
// visible-block-start
import { RefreshButton } from "@refinedev/antd";

const MyRefreshComponent = () => {
    return (
        <RefreshButton
            resource="posts"
            // highlight-next-line
            recordItemId="1"
        />
    );
};
// visible-block-end

render(
    <RefineAntdDemo
        initialRoutes={["/"]}
        resources={[
            {
                name: "posts",
            },
        ]}
        DashboardPage={MyRefreshComponent}
    />,
);
```

Clicking the button will trigger the [`useInvalidate`][use-invalidate] hook and then fetch the record whose resource is "post" and whose id is "1".

:::note
`<RefreshButton>` component reads the id information from the route by default.
:::

### `resource`

`resource` allows us to manage which resource is going to be refreshed.

```tsx live disableScroll previewHeight=120px
// visible-block-start
import { RefreshButton } from "@refinedev/antd";

const MyRefreshComponent = () => {
    return (
        <RefreshButton
            // highlight-next-line
            resource="categories"
            // highlight-next-line
            recordItemId="2"
        />
    );
};
// visible-block-end

render(
    <RefineAntdDemo
        initialRoutes={["/"]}
        resources={[
            {
                name: "posts",
            },
            {
                name: "categories",
            },
        ]}
        DashboardPage={MyRefreshComponent}
    />,
);
```

Clicking the button will trigger the [`useInvalidate`][use-invalidate] hook and then fetches the record whose resource is "categories" and whose id is "2".

:::note
`<RefreshButton>` component reads the resource name from the route by default.
:::

If you have multiple resources with the same name, you can pass the `identifier` instead of the `name` of the resource. It will only be used as the main matching key for the resource, data provider methods will still work with the `name` of the resource defined in the `<Refine/>` component.

> For more information, refer to the [`identifier` of the `<Refine/>` component documentation &#8594](/docs/api-reference/core/components/refine-config#identifier)

### `hideText`

`hideText` is used to hide the text of the button. When its `true`, only the button icon will be visible.

```tsx live disableScroll previewHeight=120px
// visible-block-start
import { RefreshButton } from "@refinedev/antd";

const MyRefreshComponent = () => {
    return (
        <RefreshButton
            // highlight-next-line
            hideText
        />
    );
};
// visible-block-end

render(
    <RefineAntdDemo
        initialRoutes={["/"]}
        resources={[
            {
                name: "posts",
            },
        ]}
        DashboardPage={MyRefreshComponent}
    />,
);
```

### ~~`resourceNameOrRouteName`~~ <PropTag deprecated />

> `resourceNameOrRouteName` prop is deprecated. Use `resource` prop instead.

`resourceNameOrRouteName` allows us to manage which resource is going to be refreshed.

```tsx live disableScroll previewHeight=120px
// visible-block-start
import { RefreshButton } from "@refinedev/antd";

const MyRefreshComponent = () => {
    return (
        <RefreshButton
            // highlight-next-line
            resourceNameOrRouteName="categories"
            // highlight-next-line
            recordItemId="2"
        />
    );
};
// visible-block-end

render(
    <RefineAntdDemo
        initialRoutes={["/"]}
        resources={[
            {
                name: "posts",
            },
            {
                name: "categories",
            },
        ]}
        DashboardPage={MyRefreshComponent}
    />,
);
```

Clicking the button will trigger the [`useInvalidate`][use-invalidate] hook and then fetches the record whose resource is "categories" and whose id is "2".

:::note
`<RefreshButton>` component reads the resource name from the route by default.
:::

## API Reference

### Properties

<PropsTable module="@refinedev/antd/RefreshButton" />

:::tip External Props
It also accepts all props of Ant Design [Button](https://ant.design/components/button/#API).
:::

[use-invalidate]: /docs/api-reference/core/hooks/invalidate/useInvalidate
