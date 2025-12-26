import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateMutation({
  mutationKey,
  mutationFn,
  getSuccessMessage,
  queryKeysToInvalidate,
}) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: [mutationKey],
    mutationFn: ({ id, data }) => mutationFn({ id, data }),
    onSuccess: (data, variables) => {
      // 1. Безпечне скидання форми
      variables.form?.reset();

      // 2. Повідомлення про успіх
      if (getSuccessMessage) {
        toast.success(getSuccessMessage(data));
      }

      // 3. Безпечна інвалідація ключів
      if (queryKeysToInvalidate) {
        // Перевіряємо: якщо це функція - викликаємо, якщо масив - беремо як є
        const keys = typeof queryKeysToInvalidate === 'function' 
          ? queryKeysToInvalidate(data) 
          : queryKeysToInvalidate;

        // Якщо передано просто ["key"], перетворюємо в [["key"]], щоб forEach працював коректно
        const normalizedKeys = Array.isArray(keys[0]) ? keys : [keys];

        normalizedKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
    },
    onError: (error) => {
      // Виводимо помилку тільки якщо вона прийшла від сервера
      toast.error(error?.response?.data?.message || "Помилка при оновленні");
    },
  });

  return { mutate, isPending };
}
