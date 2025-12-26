import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router"

export const useDeleteEntity =(
    options
) => {
    const navigate = useNavigate()
    const queryClient = useQueryClient();

    const {
        mutationKey,
        mutationFn,
        successMessage = "Видалено",
        redirectTo,
        invalidateQueryKey,
    } = options;

    const { mutate: deleteEntity, isPending } = useMutation({
        mutationKey: [mutationKey],
        mutationFn,
        onSuccess: () => {
            toast.success(successMessage);

            if (redirectTo) {
                navigate(redirectTo);
            }

            if (invalidateQueryKey) {
                const finalKey = Array.isArray(invalidateQueryKey) 
                    ? invalidateQueryKey 
                    : [invalidateQueryKey];
                    
                queryClient.invalidateQueries({ queryKey: finalKey });
            }
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    return {
        deleteEntity,
        isDeletePending: isPending,
    };
};
