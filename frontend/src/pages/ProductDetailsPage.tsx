import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { apiClient } from "@/services/api-client";
import { GPU } from "@/types";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const features = [
  { name: "CUDA Cores", value: "8704" },
  { name: "Boost Clock", value: "1.71 GHz" },
  { name: "Memory", value: "10 GB GDDR6X" },
  { name: "Memory Interface Width", value: "320-bit" },
];

const ProductDetailsPage = () => {
  const { gpuId } = useParams();
  const { data, isLoading, error } = useQuery<GPU>({
    queryKey: ["gpus", gpuId],
    queryFn: async () => {
      const response = await apiClient.get(`gpus/${gpuId}`);

      return response.data.data;
    },
  });

  if (!data || isLoading) return <h1>Loading...</h1>;
  if (error) return <h1>Error loading GPU</h1>;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{data.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="w-full h-64 md:h-80">
              <img
                src="https://picsum.photos/600/350"
                alt={data.name}
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
            {/* <p className="text-muted-foreground">{gpuDetails.description}</p> */}
            {/* <div className="grid grid-cols-2 gap-2">
                            <div>
                                <span className="font-semibold">Model:</span> {gpuDetails.model}
                            </div>
                            <div>
                                <span className="font-semibold">Brand:</span> {gpuDetails.brand}
                            </div>
                        </div> */}
          </div>
          <div className="space-y-4">
            <p className="text-muted-foreground">{data.description}</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="font-semibold">Model:</span> {data.model}
              </div>
              <div>
                <span className="font-semibold">Brand:</span> {data.brand}
              </div>
            </div>
            <h3 className="text-xl font-semibold">Features</h3>
            <Table>
              <TableBody>
                {features.map((feature, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {feature.name}
                    </TableCell>
                    <TableCell>{feature.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Auction Details</CardTitle>
            <Button size="lg">Place Your Bid</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Table>
                <TableBody>
                  {features.map((feature, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {feature.name}
                      </TableCell>
                      <TableCell>{feature.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div>
              <Card x-chunk="dashboard-01-chunk-5">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-8">
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src="/avatars/01.png" alt="Avatar" />
                      <AvatarFallback>OM</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        Olivia Martin
                      </p>
                      <p className="text-sm text-muted-foreground">
                        olivia.martin@email.com
                      </p>
                    </div>
                    <div className="ml-auto font-medium">+$1,999.00</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src="/avatars/02.png" alt="Avatar" />
                      <AvatarFallback>JL</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        Jackson Lee
                      </p>
                      <p className="text-sm text-muted-foreground">
                        jackson.lee@email.com
                      </p>
                    </div>
                    <div className="ml-auto font-medium">+$39.00</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src="/avatars/03.png" alt="Avatar" />
                      <AvatarFallback>IN</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        Isabella Nguyen
                      </p>
                      <p className="text-sm text-muted-foreground">
                        isabella.nguyen@email.com
                      </p>
                    </div>
                    <div className="ml-auto font-medium">+$299.00</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src="/avatars/04.png" alt="Avatar" />
                      <AvatarFallback>WK</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        William Kim
                      </p>
                      <p className="text-sm text-muted-foreground">
                        will@email.com
                      </p>
                    </div>
                    <div className="ml-auto font-medium">+$99.00</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src="/avatars/05.png" alt="Avatar" />
                      <AvatarFallback>SD</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        Sofia Davis
                      </p>
                      <p className="text-sm text-muted-foreground">
                        sofia.davis@email.com
                      </p>
                    </div>
                    <div className="ml-auto font-medium">+$39.00</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          {/* {isAuctionEnded && gpuDetails.finalSoldPrice && (
                        <div className="text-center">
                            <p className="text-2xl font-bold">Final Sold Price: ${gpuDetails.finalSoldPrice.toFixed(2)}</p>
                        </div>
                    )} */}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailsPage;