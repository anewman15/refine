import { SelectProps } from "antd/lib/select";
import { QueryObserverResult } from "@tanstack/react-query";

import {
    useSelect as useSelectCore,
    BaseRecord,
    GetManyResponse,
    GetListResponse,
    HttpError,
    UseSelectProps,
    BaseOption,
} from "@refinedev/core";

export type UseSelectReturnType<
    TData extends BaseRecord = BaseRecord,
    TOption extends BaseOption = BaseOption,
> = {
    selectProps: SelectProps<TOption>;
    queryResult: QueryObserverResult<GetListResponse<TData>>;
    defaultValueQueryResult: QueryObserverResult<GetManyResponse<TData>>;
};

/**
 * `useSelect` hook allows you to manage an Ant Design {@link https://ant.design/components/select/ Select} component when records in a resource needs to be used as select options.
 *
 * @see {@link https://refine.dev/docs/api-reference/antd/hooks/field/useSelect/} for more details.
 *
 * @typeParam TQueryFnData - Result data returned by the query function. Extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}
 * @typeParam TError - Custom error object that extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#httperror `HttpError`}
 * @typeParam TData - Result data returned by the `select` function. Extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}. Defaults to `TQueryFnData`
 *
 */

export const useSelect = <
    TQueryFnData extends BaseRecord = BaseRecord,
    TError extends HttpError = HttpError,
    TData extends BaseRecord = TQueryFnData,
    TOption extends BaseOption = BaseOption,
>(
    props: UseSelectProps<TQueryFnData, TError, TData>,
): UseSelectReturnType<TData, TOption> => {
    const { queryResult, defaultValueQueryResult, onSearch, options } =
        useSelectCore<TQueryFnData, TError, TData, TOption>(props);

    return {
        selectProps: {
            options,
            onSearch,
            loading: defaultValueQueryResult.isFetching,
            showSearch: true,
            filterOption: false,
        },
        queryResult,
        defaultValueQueryResult,
    };
};
