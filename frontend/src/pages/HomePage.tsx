import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ProductCard from "@/components/elements/ProductCard";
import { apiClient } from "@/services/api-client";
import { GPU } from "@/types";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  let { type } = useParams();
  if (!["all", "mine"].includes(type || "")) {
    type = "all";
  }

  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<GPU[]>({
    queryKey: ["gpus", type],
    queryFn: async () => {
      const response = await apiClient.get(`gpus?type=${type}`);

      return response.data.data;
    },
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await apiClient.delete(`gpus/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gpus/mine"] });
    },
  });

  if (!data || isLoading) return <h1>Loading...</h1>;
  if (error) return <h1>Error loading GPUs</h1>;

  const viewOnly = type === "all";

  const onDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {type === "all" ? "Bid for GPUs" : "Manage GPUs"}
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of all GPUS!
            </p>
          </div>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button size="sm" asChild>
              <Link to="/gpus/new"> Add GPU</Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-5">
          {data.map((item) => (
            <ProductCard
              key={item.id}
              data={item}
              viewOnly={viewOnly}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;
