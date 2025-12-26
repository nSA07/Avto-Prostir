import { useEffect } from "react"

export function useInitialData(
  reset,
  data,
  status
) {
  useEffect(() => {
    if (status.isSuccess && data) {
      const sanitized = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value ?? ""])
      );

      reset(sanitized);
    }
  }, [status.isSuccess, data])
}
