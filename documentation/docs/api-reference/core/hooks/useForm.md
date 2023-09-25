---
id: useForm
title: useForm
source: packages/core/src/hooks/form/useForm.ts
---

```tsx live shared
import React from "react";
import {
    Refine,
    LayoutProps,
    useList,
    HttpError,
    useShow,
    useNavigation,
} from "@refinedev/core";

import { Layout } from "components";

import { PostList, PostCreate, PostEdit, PostShow } from "pages/posts";

import routerProvider from "@refinedev/react-router-v6";

import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";

type FormValues = Omit<IPost, "id">;

interface IPost {
    id: number;
    title: string;
    content: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div
            style={{
                background: "white",
                height: "100vh",
            }}
        >
            {children}
        </div>
    );
};

const PAGE_SIZE = 10;

const PostList: React.FC = () => {
    const [page, setPage] = React.useState(1);

    const { edit, create, clone } = useNavigation();

    const { data } = useList<IPost>({
        resource: "posts",
        pagination: {
            current: page,
            pageSize: PAGE_SIZE,
        },
    });

    const posts = data?.data || [];
    const toalCount = data?.total || 0;

    const pageCount = Math.ceil(toalCount / PAGE_SIZE);
    const hasNext = page * PAGE_SIZE < toalCount;
    const hasPrev = page > 1;

    return (
        <div>
            <div>
                <button onClick={() => create("posts")}>
                    <span>Create Post</span>
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>
                            <div>ID</div>
                        </th>
                        <th>
                            <div>Title</div>
                        </th>

                        <th>
                            <div>Action</div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post) => (
                        <tr key={post.id}>
                            <td>{post.id}</td>
                            <td>{post.title}</td>
                            <td>
                                <div>
                                    <button
                                        onClick={() => edit("posts", post.id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => edit("posts", post.id)}
                                    >
                                        Clone
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <div>
                    <button onClick={() => setPage(1)} disabled={!hasPrev}>
                        First
                    </button>
                    <button
                        onClick={() => setPage((prev) => prev - 1)}
                        disabled={!hasPrev}
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={!hasNext}
                    >
                        Next
                    </button>
                    <button
                        onClick={() => setPage(pageCount)}
                        disabled={!hasNext}
                    >
                        Last
                    </button>
                </div>
                <span>
                    Page{" "}
                    <strong>
                        {page} of {pageCount}
                    </strong>
                </span>
                <span>
                    Go to page:
                    <input
                        type="number"
                        defaultValue={page + 1}
                        onChange={(e) => {
                            const value = e.target.value
                                ? Number(e.target.value)
                                : 1;
                            setPage(value);
                        }}
                    />
                </span>
            </div>
        </div>
    );
};

const PostEdit: React.FC = () => {
    const { formLoading, onFinish, queryResult } = useForm<FormValues>();
    const defaultValues = queryResult?.data?.data;

    const [formValues, seFormValues] = useState<FormValues>({
        title: defaultValues?.title || "",
        content: defaultValues?.content || "",
    });

    const handleOnChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        seFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onFinish(formValues);
    };

    useEffect(() => {
        seFormValues({
            title: defaultValues?.title || "",
            content: defaultValues?.content || "",
        });
    }, [defaultValues]);

    return (
        <div>
            <br />
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        value={formValues.title}
                        onChange={handleOnChange}
                    />
                </div>
                <div>
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        name="content"
                        placeholder="Content"
                        rows={10}
                        value={formValues.content}
                        onChange={handleOnChange}
                    />
                </div>
                <button type="submit" disabled={formLoading}>
                    {formLoading && <div>Loading...</div>}
                    <span>Save</span>
                </button>
            </form>
        </div>
    );
};

const PostCreate: React.FC = () => {
    const { formLoading, onFinish } = useForm<IPost, HttpError, FormValues>();

    const [formValues, seFormValues] = useState<FormValues>({
        title: "",
        content: "",
    });

    const handleOnChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        seFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onFinish(formValues);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        value={formValues.title}
                        onChange={handleOnChange}
                    />
                </div>

                <div>
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        name="content"
                        placeholder="Content"
                        value={formValues.content}
                        onChange={handleOnChange}
                    />
                </div>
                <button type="submit" disabled={formLoading}>
                    {formLoading && <div>Loading...</div>}
                    <span>Save</span>
                </button>
            </form>
        </div>
    );
};
```

`useForm` is a hook that allows you to manage forms. It has some `action` methods that `create`, `edit` and `clone` the form. The hook return value comes according to the called action, and it can run different logic depending on the `action`.

You can think of `useForm` as a bridge between your `state` and `dataProvider`. It's a low-level hook that you can use to build your own form components. It's also using `notificationProvider` to inform users according to the `action` and `dataProvider` responses.

Let's review how `useForm` works behind the scenes.

<Tabs
defaultValue="create"
values={[
{label: 'create', value: 'create'},
{label: 'edit', value: 'edit'},
{label: 'clone', value: 'clone'}
]}>
<TabItem value="create">

After form is submitted:

1. `useForm` calls `onFinish` function with the form values.
2. `onFinish` function calls [`useCreate`](/docs/api-reference/core/hooks/data/useCreate/) with the form values.
3. `useCreate` calls [`dataProvider`](/docs/api-reference/core/providers/data-provider/)'s `create` function and returns the response.
4. `useForm` calls `onSuccess` or `onError` function with the response, depending on the response status.
5. `onSuccess` or `onError` function then calls the `open` function of the [`notificationProvider`](/docs/api-reference/core/providers/notification-provider/) to inform the user.
6. `useForm` redirects to the `list` page.

</TabItem>

<TabItem value="edit">

On mount, `useForm` calls [`useGetOne`](/docs/api-reference/core/hooks/data/useOne/) hook to retrieve the record to be edited. The `id` for the record is obtained from the `URL` or `props`.

After form is submitted:

1.  `useForm` calls `onFinish` function with the form values.
2.  `onFinish` function calls [`useUpdate`](/docs/api-reference/core/hooks/data/useUpdate/) with the form values.
3.  `useUpdate` calls [`dataProvider`](/docs/api-reference/core/providers/data-provider/)'s `update` function and returns the response.
4.  `useForm` calls `onSuccess` or `onError` function with the response, depending on the response status.
5.  `onSuccess` or `onError` function then calls the `open` function of the [`notificationProvider`](/docs/api-reference/core/providers/notification-provider/) to inform the user.
6.  `useForm` redirects to the `list` page.

</TabItem>

<TabItem value="clone">

On mount, `useForm` calls [`useGetOne`](/docs/api-reference/core/hooks/data/useOne/) hook to retrieve the record to be edited. The `id` for the record is obtained from the `URL` or `props`.

After form is submitted:

1.  `useForm` calls `onFinish` function with the form values.
2.  `onFinish` function calls [`useCreate`](/docs/api-reference/core/hooks/data/useCreate/) with the form values.
3.  `useUpdate` calls [`dataProvider`](/docs/api-reference/core/providers/data-provider/)'s `update` function and returns the response.
4.  `useForm` calls `onSuccess` or `onError` function with the response, depending on the response status.
5.  `onSuccess` or `onError` function then calls the `open` function of the [`notificationProvider`](/docs/api-reference/core/providers/notification-provider/) to inform the user.
6.  `useForm` redirects to the `list` page.

</TabItem>

</Tabs>

This is the default behavior of `useForm`. You can customize it by passing your own [`redirect`](/docs/api-reference/core/hooks/useForm/#redirect), [`onFinish`](/docs/api-reference/core/hooks/useForm/##how-can-i-change-the-form-data-before-submitting-it-to-the-api), [`onMutationSuccess`](/docs/api-reference/core/hooks/useForm/#onmutationsuccess) and [`onMutationError`](/docs/api-reference/core/hooks/useForm/#onmutationerror) props.

:::info
`useForm` does not manage any state. If you're looking for a complete form library, `refine` supports three form libraries out-of-the-box.

-   [React Hook Form](https://react-hook-form.com/) (for Headless users) - [Documentation](/packages/documentation/react-hook-form/useForm.md) - [Example](/examples/form/react-hook-form/useForm.md)
-   [Ant Design Form](https://ant.design/components/form/#header) (for Ant Design users) - [Documentation](/api-reference/antd/hooks/form/useForm.md) - [Example](/examples/form/antd/useForm.md)
-   [Mantine Form](https://mantine.dev/form/use-form) (for Mantine users) - [Documentation](/api-reference/mantine/hooks/form/useForm.md) - [Example](/examples/form/mantine/useForm.md)

:::

<GeneralConceptsLink />

## Basic Usage

We'll show the basic usage of `useForm` by adding an creating form.

```tsx
import { useState } from "react";
import { useForm } from "@refinedev/core";

const PostCreate = () => {
    const [title, setTitle] = useState();
    const { onFinish } = useForm({
        action: "create",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        onFinish({ title });
    };

    return (
        <form onSubmit={onSubmit}>
            <input onChange={(e) => setTitle(e.target.value)} />
            <button type="submit">Submit</button>
        </form>
    );
};
```

-   Returns the `mutationResult` after called the `onFinish` callback.
-   Accepts generic type parameters. It is used to define response type of the mutation and query.

## Properties

### `action`

`useForm` can handle `edit`, `create` and `clone` actions. By default the `action` is inferred from the active route. It can be overridden by passing the `action` explicitly.

<Tabs
defaultValue="create"
values={[
{label: 'create', value: 'create'},
{label: 'edit', value: 'edit'},
{label: 'clone', value: 'clone'}
]}>
<TabItem value="create">

`action: "create"` is used for creating a new record that didn't exist before.

`useForm` uses [`useCreate`](/docs/api-reference/core/hooks/data/useCreate/) under the hood for mutations on create mode.

In the following example, we will show how to use `useForm` with `action: "create"`.

```tsx live  url=http://localhost:3000/posts/create previewHeight=420px
setInitialRoutes(["/posts/create"]);

// visible-block-start
import React, { useState } from "react";
import { useForm } from "@refinedev/core";

interface FormValues {
    id: number;
    title: string;
    content: string;
}

const PostCreatePage: React.FC = () => {
    const { formLoading, onFinish } = useForm<IPost, HttpError, FormValues>();

    const [formValues, seFormValues] = useState<FormValues>({
        title: "",
        content: "",
    });

    const handleOnChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        seFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onFinish(formValues);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        value={formValues.title}
                        onChange={handleOnChange}
                    />
                </div>

                <div>
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        name="content"
                        placeholder="Content"
                        value={formValues.content}
                        onChange={handleOnChange}
                    />
                </div>
                <button type="submit" disabled={formLoading}>
                    {formLoading && <div>Loading...</div>}
                    <span>Save</span>
                </button>
            </form>
        </div>
    );
};
// visible-block-end

const App = () => {
    return (
        <BrowserRouter>
            <Refine
                dataProvider={RefineSimpleRest.default(
                    "https://api.fake-rest.refine.dev",
                )}
                routerProvider={routerProvider}
                resources={[
                    {
                        name: "posts",
                        list: "/posts",
                        create: "/posts/create",
                        edit: "/posts/edit/:id",
                    },
                ]}
            >
                <Layout>
                    <Routes>
                        <Route path="/posts" element={<PostList />} />
                        <Route
                            path="/posts/create"
                            element={<PostCreatePage />}
                        />
                        <Route path="/posts/edit/:id" element={<PostEdit />} />
                    </Routes>
                </Layout>
            </Refine>
        </BrowserRouter>
    );
};

render(<App />);
```

</TabItem>

<TabItem value="edit">

`action: "edit"` is used for editing an existing record. It requires the `id` to determine the record to edit. By default, it uses the `id` from the route. It can be changed with the `setId` function or `id` property.

It fetches the record data according to the `id` with [`useOne`](/docs/api-reference/core/hooks/data/useOne/) and returns the `queryResult` for you to fill the form. After the form is submitted, it updates the record with [`useUpdate`](/docs/api-reference/core/hooks/data/useUpdate/).

In the following example, we'll show how to use `useForm` with `action: "edit"`.

```tsx live  url=http://localhost:3000/edit/123 previewHeight=420px
setInitialRoutes(["/posts/edit/123"]);

// visible-block-start
import React, { useState, useEffect } from "react";
import { useForm } from "@refinedev/core";

interface FormValues {
    id: number;
    title: string;
    content: string;
}

const PostEditPage: React.FC = () => {
    const { formLoading, onFinish, queryResult } = useForm<FormValues>();
    const defaultValues = queryResult?.data?.data;

    const [formValues, seFormValues] = useState<FormValues>({
        title: defaultValues?.title || "",
        content: defaultValues?.content || "",
    });

    const handleOnChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        seFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onFinish(formValues);
    };

    useEffect(() => {
        seFormValues({
            title: defaultValues?.title || "",
            content: defaultValues?.content || "",
        });
    }, [defaultValues]);

    return (
        <div>
            <br />
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        value={formValues.title}
                        onChange={handleOnChange}
                    />
                </div>
                <div>
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        name="content"
                        placeholder="Content"
                        rows={10}
                        value={formValues.content}
                        onChange={handleOnChange}
                    />
                </div>
                <button type="submit" disabled={formLoading}>
                    {formLoading && <div>Loading...</div>}
                    <span>Save</span>
                </button>
            </form>
        </div>
    );
};
// visible-block-end

const App = () => {
    return (
        <BrowserRouter>
            <Refine
                dataProvider={RefineSimpleRest.default(
                    "https://api.fake-rest.refine.dev",
                )}
                routerProvider={routerProvider}
                resources={[
                    {
                        name: "posts",
                        list: "/posts",
                        create: "/posts/create",
                        edit: "/posts/edit/:id",
                    },
                ]}
            >
                <Layout>
                    <Routes>
                        <Route path="/posts" element={<PostList />} />
                        <Route path="/posts/create" element={<PostCreate />} />
                        <Route
                            path="/posts/edit/:id"
                            element={<PostEditPage />}
                        />
                    </Routes>
                </Layout>
            </Refine>
        </BrowserRouter>
    );
};

render(<App />);
```

</TabItem>

<TabItem value="clone">

`action: "clone"` is used for cloning an existing record. It requires the `id` to determine the record to clone. By default, it uses the `id` from the route. It can be changed with the `setId` function.

You can think `action:clone` like save as. It's similar to `action:edit` but it creates a new record instead of updating the existing one.

It fetches the record data according to the `id` with [`useOne`](/docs/api-reference/core/hooks/data/useOne/) and returns the `queryResult` for you to fill the form. After the form is submitted, it creates a new record with [`useCreate`](/docs/api-reference/core/hooks/data/useCreate/).

In the following example, we'll show how to use `useForm` with `action: "clone"`.

```tsx live  url=http://localhost:3000/clone/123 previewHeight=420px
setInitialRoutes(["/posts/clone/123"]);

// visible-block-start
import React, { useState, useEffect } from "react";
import { useForm } from "@refinedev/core";

interface FormValues {
    id: number;
    title: string;
    content: string;
}

const PostCreatePage: React.FC = () => {
    const { formLoading, onFinish, queryResult } = useForm<FormValues>();
    const defaultValues = queryResult?.data?.data;

    const [formValues, seFormValues] = useState<FormValues>({
        title: defaultValues?.title || "",
        content: defaultValues?.content || "",
    });

    const handleOnChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        seFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onFinish(formValues);
    };

    useEffect(() => {
        seFormValues({
            title: defaultValues?.title || "",
            content: defaultValues?.content || "",
        });
    }, [defaultValues]);

    return (
        <div>
            <br />
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        value={formValues.title}
                        onChange={handleOnChange}
                    />
                </div>
                <div>
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        name="content"
                        placeholder="Content"
                        rows={10}
                        value={formValues.content}
                        onChange={handleOnChange}
                    />
                </div>
                <button type="submit" disabled={formLoading}>
                    {formLoading && <div>Loading...</div>}
                    <span>Save</span>
                </button>
            </form>
        </div>
    );
};
// visible-block-end

const App = () => {
    return (
        <BrowserRouter>
            <Refine
                dataProvider={RefineSimpleRest.default(
                    "https://api.fake-rest.refine.dev",
                )}
                routerProvider={routerProvider}
                resources={[
                    {
                        name: "posts",
                        list: "/posts",
                        create: "/posts/create",
                        edit: "/posts/edit/:id",
                        clone: "/posts/clone/:id",
                    },
                ]}
            >
                <Layout>
                    <Routes>
                        <Route path="/posts" element={<PostList />} />
                        <Route
                            path="/posts/clone/:id"
                            element={<PostCreatePage />}
                        />
                        <Route path="/posts/edit/:id" element={<PostEdit />} />
                    </Routes>
                </Layout>
            </Refine>
        </BrowserRouter>
    );
};

render(<App />);
```

</TabItem>

</Tabs>

### `resource`

> Default: It reads the `resource` value from the current URL.

It will be passed to the [`dataProvider`][data-provider]'s method as a params. This parameter is usually used to as a API endpoint path. It all depends on how to handle the `resource` in your [`dataProvider`][data-provider]. See the [`creating a data provider`](/api-reference/core/providers/data-provider.md#creating-a-data-provider) section for an example of how `resource` are handled.

-   When `action` is `"create"`, it will be passed to the [`create`][create] method from the [`dataProvider`][data-provider].
-   When `action` is `"edit"`, it will be passed to the [`update`][update] and the [`getOne`][get-one] method from the [`dataProvider`][data-provider].
-   When `action` is `"clone"`, it will be passed to the [`create`][create] and the [`getOne`][get-one] method from the [`dataProvider`][data-provider].

```tsx
useForm({
    resource: "categories",
});
```

:::caution

If the `resource` is passed, the `id` from the current URL will be ignored because it may belong to a different resource. To retrieve the `id` value from the current URL, use the `useParsed` hook and pass the `id` value to the `useForm` hook.

```tsx
import { useForm, useParsed } from "@refinedev/core";

const { id } = useParsed();

useForm({
    resource: "custom-resource",
    id,
});
```

Or you can use the `setId` function to set the `id` value.

```tsx
import { useForm } from "@refinedev/core";

const { setId } = useForm({
    resource: "custom-resource",
});

setId("123");
```

:::

If you have multiple resources with the same name, you can pass the `identifier` instead of the `name` of the resource. It will only be used as the main matching key for the resource, data provider methods will still work with the `name` of the resource defined in the `<Refine/>` component.

> For more information, refer to the [`identifier` of the `<Refine/>` component documentation &#8594](/docs/api-reference/core/components/refine-config#identifier)

### `id`

`id` is used for determining the record to `edit` or `clone`. By default, it uses the `id` from the route. It can be changed with the `setId` function or `id` property.

It is useful when you want to `edit` or `clone` a `resource` from a different page.

:::note
`id` is required when `action: "edit"` or `action: "clone"`.
:::

```tsx
useForm({
    action: "edit", // or clone
    resource: "categories",
    id: 1, // <BASE_URL_FROM_DATA_PROVIDER>/categories/1
});
```

### `redirect`

`redirect` is used for determining the page to redirect to after the form is submitted. By default, it uses the `list`. It can be changed with the `redirect` property.

It can be set to `"show" | "edit" | "list" | "create"` or `false` to prevent the page from redirecting to the list page after the form is submitted.

```tsx
useForm({
    redirect: false,
});
```

### `onMutationSuccess`

It's a callback function that will be called after the mutation is successful.

It receives the following parameters:

-   `data`: Returned value from [`useCreate`](/docs/api-reference/core/hooks/data/useCreate/) or [`useUpdate`](/docs/api-reference/core/hooks/data/useUpdate/) depending on the `action`.
-   `variables`: The variables passed to the mutation.
-   `context`: react-query context.
-   `isAutoSave`: It's a boolean value that indicates whether the mutation is triggered by the [`autoSave`](#autoSave) feature or not.

```tsx
useForm({
    onMutationSuccess: (data, variables, context, isAutoSave) => {
        console.log({ data, variables, context, isAutoSave });
    },
});
```

### `onMutationError`

It's a callback function that will be called after the mutation is failed.

It receives the following parameters:

-   `data`: Returned value from [`useCreate`](/docs/api-reference/core/hooks/data/useCreate/) or [`useUpdate`](/docs/api-reference/core/hooks/data/useUpdate/) depending on the `action`.
-   `variables`: The variables passed to the mutation.
-   `context`: react-query context.
-   `isAutoSave`: It's a boolean value that indicates whether the mutation is triggered by the [`autoSave`](#autoSave) feature or not.

```tsx
useForm({
    onMutationError: (data, variables, context, isAutoSave) => {
        console.log({ data, variables, context, isAutoSave });
    },
});
```

### `invalidates`

You can use it to manage the invalidations that will occur at the end of the mutation.

By default it's invalidates following queries from the current `resource`:

-   on `"create"` or `"clone"` mode: `"list"` and `"many"`
-   on `"edit"` mode: `"list"`", `"many"` and `"detail"`

```tsx
useForm({
    invalidates: ["list", "many", "detail"],
});
```

### `dataProviderName`

If there is more than one `dataProvider`, you should use the `dataProviderName` that you will use.
It is useful when you want to use a different `dataProvider` for a specific resource.

:::tip
If you want to use a different `dataProvider` on all resource pages, you can use the [`dataProvider` prop](/docs/api-reference/core/components/refine-config/#dataprovidername) of the `<Refine>` component.
:::

```tsx
useForm({
    dataProviderName: "second-data-provider",
});
```

### `mutationMode`

Mutation mode determines which mode the mutation runs with. Mutations can run under three different modes: `pessimistic`, `optimistic` and `undoable`. Default mode is `pessimistic`.
Each mode corresponds to a different type of user experience.

> For more information about mutation modes, refer to the [Mutation Mode documentation](/docs/advanced-tutorials/mutation-mode)

```tsx
useForm({
    mutationMode: "undoable", // "pessimistic" | "optimistic" | "undoable",
});
```

### `successNotification`

:::caution
[`NotificationProvider`][notification-provider] is required for this prop to work.
:::

After form is submitted successfully, `useForm` will call `open` function from [`NotificationProvider`][notification-provider] to show a success notification. With this prop, you can customize the success notification.

```tsx
useForm({
    successNotification: (data, values, resource) => {
        return {
            message: `Post Successfully created with ${data.title}`,
            description: "Success with no errors",
            type: "success",
        };
    },
});
```

### `errorNotification`

:::caution
[`NotificationProvider`][notification-provider] is required for this prop to work.
:::

After form is submit is failed, `useForm` will call `open` function from [`NotificationProvider`][notification-provider] to show a success notification. With this prop, you can customize the success notification.

```tsx
useForm({
    errorNotification: (data, values, resource) => {
        return {
            message: `Something went wrong when deleting ${data.id}`,
            description: "Error",
            type: "error",
        };
    },
});
```

```json title="Default values"
{
    "message": "Error when updating <resource-name> (status code: ${err.statusCode})" or "Error when creating <resource-name> (status code: ${err.statusCode})",
    "description": "Error",
    "type": "error",
}
```

### `meta`

`meta` is a special property that can be used to pass additional information to data provider methods for the following purposes:

-   Customizing the data provider methods for specific use cases.
-   Generating GraphQL queries using plain JavaScript Objects (JSON).
-   Filling the path parameters when generating the redirection path.
-   Providing additional parameters to the redirection path after the form is submitted.

In the following example, we pass the `headers` property in the `meta` object to the `create` method. With similar logic, you can pass any properties to specifically handle the data provider methods.

```tsx
useForm({
    meta: {
        headers: { "x-meta-data": "true" },
    },
});

const myDataProvider = {
    //...
    // highlight-start
    create: async ({ resource, variables, meta }) => {
        const headers = meta?.headers ?? {};
        // highlight-end
        const url = `${apiUrl}/${resource}`;

        // highlight-next-line
        const { data } = await httpClient.post(url, variables, { headers });

        return {
            data,
        };
    },
    //...
};
```

> For more information, refer to the [`meta` section of the General Concepts documentation &#8594](/docs/api-reference/general-concepts/#meta)

### `queryMeta`

In addition to the [`meta`](#meta) property, you can also pass the `queryMeta` property to the `useForm` hook. This property is used to pass additional information to the `useOne` hook that is used to fetch the data in the `edit` and `clone` modes. This is useful when you have to apply different values to the `useOne` hook from the `useCreate` or `useUpdate` hook mutations.

```tsx
useForm({
    queryMeta: {
        querySpecificValue: "someValue",
    },
});
```

:::tip
If you have overlapping properties in both `meta` and `queryMeta`, the `queryMeta` property will be used.
:::

### `mutationMeta`

In addition to the [`meta`](#meta) property, you can also pass the `mutationMeta` property to the `useForm` hook. This property is used to pass additional information to the `useCreate` or `useUpdate` hook mutations. This is useful when you have to apply different values to the `useCreate` or `useUpdate` hooks from the `useOne` hook query.

```tsx
useForm({
    mutationMeta: {
        mutationSpecificValue: "someValue",
    },
});
```

:::tip
If you have overlapping properties in both `meta` and `mutationMeta`, the `mutationMeta` property will be used.
:::

### `queryOptions`

:::caution
Works only in `action: "edit"` or `action: "clone"` mode.
:::

in `edit` or `clone` mode, **refine** uses [`useOne`](/docs/api-reference/core/hooks/data/useOne/) hook to fetch data. You can pass [`queryOptions`](https://tanstack.com/query/v4/docs/react/reference/useQuery) options by passing `queryOptions` property.

```tsx
useForm({
    queryOptions: {
        retry: 3,
    },
});
```

### `createMutationOptions`

:::caution
This option is only available when `action: "create"` or `action: "clone"`.
:::

In `create` or `clone` mode, **refine** uses [`useCreate`](/docs/api-reference/core/hooks/data/useCreate/) hook to create data. You can pass [`mutationOptions`](https://tanstack.com/query/v4/docs/react/reference/useMutation) by passing `createMutationOptions` property.

```tsx
useForm({
    createMutationOptions: {
        retry: 3,
    },
});
```

### `updateMutationOptions`

:::caution
This option is only available when `action: "edit"`.
:::

In `edit` mode, **refine** uses [`useUpdate`](/docs/api-reference/core/hooks/data/useUpdate/) hook to update data. You can pass [`mutationOptions`](https://tanstack.com/query/v4/docs/react/reference/useMutation) by passing `updateMutationOptions` property.

```tsx
useForm({
    updateMutationOptions: {
        retry: 3,
    },
});
```

### `liveMode`

Whether to update data automatically ("auto") or not ("manual") if a related live event is received. It can be used to update and show data in Realtime throughout your app.

```tsx
useForm({
    liveMode: "auto",
});
```

> For more information, refer to the [Live / Realtime page](/docs/api-reference/core/providers/live-provider/#livemode)

### `onLiveEvent`

The callback function that is executed when new events from a subscription are arrived.

```tsx
useForm({
    onLiveEvent: (event) => {
        console.log(event);
    },
});
```

### `liveParams`

Params to pass to [liveProvider's](/docs/api-reference/core/providers/live-provider/#subscribe) subscribe method.

### `overtimeOptions`

If you want loading overtime for the request, you can pass the `overtimeOptions` prop to the this hook. It is useful when you want to show a loading indicator when the request takes too long.
`interval` is the time interval in milliseconds. `onInterval` is the function that will be called on each interval.

Return `overtime` object from this hook. `elapsedTime` is the elapsed time in milliseconds. It becomes `undefined` when the request is completed.

```tsx
const { overtime } = useForm({
    //...
    overtimeOptions: {
        interval: 1000,
        onInterval(elapsedInterval) {
            console.log(elapsedInterval);
        },
    },
});

console.log(overtime.elapsedTime); // undefined, 1000, 2000, 3000 4000, ...

// You can use it like this:
{
    elapsedTime >= 4000 && <div>this takes a bit longer than expected</div>;
}
```

### `autoSave`

If you want to save the form automatically after some delay when user edits the form, you can pass true to `autoSave.enabled` prop.

It also supports [`onMutationSuccess`](#onmutationsuccess) and [`onMutationError`](#onmutationerror) callback functions. You can use `isAutoSave` parameter to determine whether the mutation is triggered by `autoSave` or not.

:::caution
Works only in `action: "edit"` mode.
:::

`onMutationSuccess` and `onMutationError` callbacks will be called after the mutation is successful or failed.

#### `enabled`

To enable the `autoSave` feature, set the `enabled` parameter to `true`.

```tsx
useForm({
    autoSave: {
        enabled: true,
    },
});
```

#### `debounce`

Set the debounce time for the `autoSave` prop. Default value is `1000`.

```tsx
useForm({
    autoSave: {
        enabled: true,
        // highlight-next-line
        debounce: 2000,
    },
});
```

## Return Values

### `queryResult`

If the `action` is set to `"edit"` or `"clone"` or if a `resource` with an `id` is provided, `useForm` will call [`useOne`](/docs/api-reference/core/hooks/data/useOne/) and set the returned values as the `queryResult` property.

```tsx
const { queryResult } = useForm();

const { data } = queryResult;
```

### `mutationResult`

When in `"create"` or `"clone"` mode, `useForm` will call [`useCreate`](/docs/api-reference/core/hooks/data/useCreate/). When in `"edit"` mode, it will call [`useUpdate`](/docs/api-reference/core/hooks/data/useUpdate/) and set the resulting values as the `mutationResult` property."

```tsx
const { mutationResult } = useForm();

const { data } = mutationResult;
```

### `setId`

`useForm` determine `id` from the router. If you want to change the `id` dynamically, you can use `setId` function.

```tsx
const { id, setId } = useForm();

const handleIdChange = (id: string) => {
    setId(id);
};

return (
    <div>
        <input value={id} onChange={(e) => handleIdChange(e.target.value)} />
    </div>
);
```

### `redirect`

"By default, after a successful mutation, `useForm` will `redirect` to the `"list"` page. To redirect to a different page, you can either use the `redirect` function to programmatically specify the destination, or set the redirect [property](/docs/api-reference/core/hooks/useForm/#redirect) in the hook's options.

In the following example we will redirect to the `"show"` page after a successful mutation.

```tsx
const { onFinish, redirect } = useForm();

// --

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = await onFinish(formValues);
    redirect("show", data?.data?.id);
};

// --
```

### `onFinish`

`onFinish` is a function that is called when the form is submitted. It will call the appropriate mutation based on the `action` property.
You can override the default behavior by passing an `onFinish` function in the hook's options.

For example you can [change values before sending to the API](/docs/api-reference/core/hooks/useForm/#how-can-i-change-the-form-data-before-submitting-it-to-the-api).

### `formLoading`

Loading state of a modal. It's `true` when `useForm` is currently being submitted or data is being fetched for the `"edit"` or `"clone"` mode.

### `overtime`

`overtime` object is returned from this hook. `elapsedTime` is the elapsed time in milliseconds. It becomes `undefined` when the request is completed.

```tsx
const { overtime } = useForm();

console.log(overtime.elapsedTime); // undefined, 1000, 2000, 3000 4000, ...
```

### `autoSaveProps`

If `autoSave` is enabled, this hook returns `autoSaveProps` object with `data`, `error`, and `status` properties from mutation.

## FAQ

### How can Invalidate other resources?

You can invalidate other resources with help of [`useInvalidate`](/docs/api-reference/core/hooks/invalidate/useInvalidate/) hook.

It is useful when you want to `invalidate` other resources don't have relation with the current resource.

```tsx
import { useInvalidate, useForm } from "@refinedev/core";

const PostEdit = () => {
    const invalidate = useInvalidate();

    useForm({
        onMutationSuccess: (data, variables, context) => {
            invalidate({
                resource: "users",
                invalidates: ["resourceAll"],
            });
        },
    });

    // ---
};
```

### How can I change the form data before submitting it to the API?

You may need to modify the form data before it is sent to the API.

For example, Let's send the values we received from the user in two separate inputs, `name` and `surname`, to the API as `fullName`.

```tsx title="src/users/create.tsx"
import React, { useState } from "react";
import { useForm } from "@refinedev/core";

export const UserCreate: React.FC = () => {
    const [name, setName] = useState();
    const [surname, setSurname] = useState();

    const { onFinish } = useForm();

    const onSubmit = (e) => {
        e.preventDefault();
        const fullName = `${name} ${surname}`;
        onFinish({
            fullName: fullName,
            name,
            surname,
        });
    };

    return (
        <form onSubmit={onSubmit}>
            <input onChange={(e) => setName(e.target.value)} />
            <input onChange={(e) => setSurname(e.target.value)} />
            <button type="submit">Submit</button>
        </form>
    );
};
```

### How to pass `meta` values only for the mutation or query?

You can use `meta` property to pass common values to the mutation and the query. But in some cases, you may want to pass different values to the mutation and the query. To do this, you can use `mutationMeta` and `queryMeta` properties.

## API Reference

### Properties

<PropsTable module="@refinedev/core/useForm" />

:::caution
These props have default values in `RefineContext` and can also be set on **<[Refine](/api-reference/core/components/refine-config.md)>** component. `useForm` will use what is passed to `<Refine>` as default but a local value will override it.
:::

### Type Parameters

| Property       | Desription                                                                                                                                                          | Type                       | Default                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | -------------------------- |
| TQueryFnData   | Result data returned by the query function. Extends [`BaseRecord`][baserecord]                                                                                      | [`BaseRecord`][baserecord] | [`BaseRecord`][baserecord] |
| TError         | Custom error object that extends [`HttpError`][httperror]                                                                                                           | [`HttpError`][httperror]   | [`HttpError`][httperror]   |
| TVariables     | Values for params.                                                                                                                                                  | `{}`                       |                            |
| TData          | Result data returned by the `select` function. Extends [`BaseRecord`][baserecord]. If not specified, the value of `TQueryFnData` will be used as the default value. | [`BaseRecord`][baserecord] | `TQueryFnData`             |
| TResponse      | Result data returned by the mutation function. Extends [`BaseRecord`][baserecord]. If not specified, the value of `TData` will be used as the default value.        | [`BaseRecord`][baserecord] | `TData`                    |
| TResponseError | Custom error object that extends [`HttpError`][httperror]. If not specified, the value of `TError` will be used as the default value.                               | [`HttpError`][httperror]   | `TError`                   |

### Return values

| Property       | Description                                            | Type                                                                                                                                                           |
| -------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| onFinish       | Triggers the mutation                                  | `(values: TVariables) => Promise<CreateResponse<TData>` \| `UpdateResponse<TData>` \| `void`>                                                                  |
| queryResult    | Result of the query of a record                        | [`QueryObserverResult<T>`](https://react-query.tanstack.com/reference/useQuery)                                                                                |
| mutationResult | Result of the mutation triggered by calling `onFinish` | [`UseMutationResult<T>`](https://react-query.tanstack.com/reference/useMutation)                                                                               |
| formLoading    | Loading state of form request                          | `boolean`                                                                                                                                                      |
| id             | Record id for `clone` and `create` action              | [`BaseKey`](/api-reference/core/interfaces.md#basekey)                                                                                                         |
| setId          | `id` setter                                            | `Dispatch<SetStateAction<` `string` \| `number` \| `undefined>>`                                                                                               |
| redirect       | Redirect function for custom redirections              | (redirect: `"list"`\|`"edit"`\|`"show"`\|`"create"`\| `false` ,idFromFunction?: [`BaseKey`](/api-reference/core/interfaces.md#basekey)\|`undefined`) => `data` |
| overtime       | Overtime loading props                                 | `{ elapsedTime?: number }`                                                                                                                                     |
| autoSaveProps  | Auto save props                                        | `{ data: UpdateResponse<TData>` \| `undefined, error: HttpError` \| `null, status: "loading"` \| `"error"` \| `"idle"` \| `"success" }`                        |

## Example

<CodeSandboxExample path="form-core-use-form" />

[notification-provider]: /docs/api-reference/core/providers/notification-provider/
[get-one]: /docs/api-reference/core/providers/data-provider/#getone-
[create]: /docs/api-reference/core/providers/data-provider/#create-
[update]: /docs/api-reference/core/providers/data-provider/#update-
[data-provider]: /docs/api-reference/core/providers/data-provider
[baserecord]: /api-reference/core/interfaces.md#baserecord
[httperror]: /api-reference/core/interfaces.md#httperror
