import { SubmitHandler } from "react-hook-form";
import { NewGPU } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/api-client";
import { useParams } from "react-router-dom";
import ProductForm from "@/components/elements/ProductForm";

const ProductEditPage = () => {
  const { gpuId } = useParams();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["gpus", gpuId],
    queryFn: async () => {
      const response = await apiClient.get(`gpus/${gpuId}`);

      return response.data.data;
    },
  });

  const mutation = useMutation<NewGPU, Error, NewGPU>({
    mutationFn: async (updatedGPU) => {
      const response = await apiClient.patch(`gpus/${gpuId}`, updatedGPU);

      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gpus/mine"] });
    },
  });

  const onSubmit: SubmitHandler<NewGPU> = (data) => {
    mutation.mutate(data);
  };

  if (!data || isLoading) return <h1>Loading...</h1>;
  if (error) return <h1>Error loading GPU</h1>;

  return <ProductForm data={data} formType="edit" onSubmit={onSubmit} />;
};

export default ProductEditPage;
