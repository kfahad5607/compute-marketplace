import { SubmitHandler } from "react-hook-form";
import { GPU, NewGPU } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/api-client";
import ProductForm from "@/components/elements/ProductForm";
import { useNavigate } from "react-router-dom";

const ProductCreatePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation<GPU, Error, NewGPU>({
    mutationFn: async (newGPU) => {
      const response = await apiClient.post("gpus", newGPU);

      return response.data.data;
    },
    onSuccess: (savedGPU) => {
      queryClient.invalidateQueries({ queryKey: ["gpus/mine"] });
      navigate(`/gpus/${savedGPU.id}/edit`);
    },
  });

  const onSubmit: SubmitHandler<NewGPU> = (data) => {
    mutation.mutate(data);
  };

  return <ProductForm formType="add" onSubmit={onSubmit} />;
};

export default ProductCreatePage;
