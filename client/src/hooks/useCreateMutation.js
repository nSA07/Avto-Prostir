import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router"

export function useCreateMutation({
  mutationKey,
  mutationFn,
  getSuccessMessage,
  getRedirectPath,
  queryToInvalidate,
}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate()

  const { mutate, isPending } = useMutation({
    mutationKey: [mutationKey],
    mutationFn: ({ data }) => mutationFn(data),
    onSuccess: (data, variables) => {
      variables.form.reset();

      if (getRedirectPath) {
        const path = getRedirectPath(data);
        if (path) navigate(path);
      }

      if (getSuccessMessage) {
        toast.success(getSuccessMessage(data));
      }

      if (queryToInvalidate) {
        queryClient.invalidateQueries({ queryKey: [queryToInvalidate] });
      }
    },
    onError: (error) => {
      
      toast.error(error.response?.data?.message || "Щось пішло не так");
    },
  });

  return { mutate, isPending };
}
