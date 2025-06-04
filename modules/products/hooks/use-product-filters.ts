import { createLoader, parseAsArrayOf, parseAsStringLiteral, useQueryStates } from 'nuqs'
import { parseAsString } from 'nuqs/server'


const sortValues = ["curated", "trending", "hot-and-new"] as const;

export const params = {
    sort: parseAsStringLiteral(sortValues).withDefault('curated'),
    minPrice: parseAsString.withOptions({
        clearOnDefault: true
    }).withDefault(''),
    maxPrice: parseAsString.withOptions({
        clearOnDefault: true
    }).withDefault(''),
    tags: parseAsArrayOf(parseAsString.withOptions({
        clearOnDefault: true
    })).withDefault([])

}
export const useProductFilters = () => {
    return useQueryStates(params)
}

// creating type
export const loadProductFilters = createLoader(params);