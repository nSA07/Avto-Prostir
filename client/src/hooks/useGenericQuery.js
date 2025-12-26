import { useQuery } from "@tanstack/react-query"

export function useGenericQuery({
  queryKey,
  queryFn,
  enabled = true
}) {
  return useQuery({
    queryKey,
    queryFn,
    enabled,
  })
}
