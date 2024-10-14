import { useForm, SubmitHandler } from "react-hook-form";
import io, { Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiClient, BASE_API_URL } from "@/services/api-client";
import { Bid, GPUWithBids } from "@/types";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";

const features = [
  { name: "CUDA Cores", value: "8704" },
  { name: "Boost Clock", value: "1.71 GHz" },
  { name: "Memory", value: "10 GB GDDR6X" },
  { name: "Memory Interface Width", value: "320-bit" },
];

const getQueryKey = (gpuId: number) => {
  return ["gpus", gpuId, "bids"];
};

const ProductDetailsPage = () => {
  const { gpuId } = useParams();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<GPUWithBids>({
    queryKey: getQueryKey(parseInt(gpuId!)),
    queryFn: async () => {
      const response = await apiClient.get(`gpus/${gpuId}?bids=true`);

      return response.data.data;
    },
  });

  const { accessToken, user } = useUserContext();
  const [socket, setSocket] = useState<Socket | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const newSocket = io(BASE_API_URL, {
      auth: {
        accessToken,
      },
    });
    setSocket(newSocket);

    newSocket.on("newBid", (bid: Bid) => {
      const queryKey = getQueryKey(parseInt(gpuId!));
      const oldData = queryClient.getQueryData<GPUWithBids>(queryKey);

      const newBids = [bid, ...(oldData?.bids || [])];
      const newData = { ...oldData, bids: newBids };

      queryClient.setQueryData(queryKey, newData);

      let toastMessage = `You are the highest bidder with $${bid.amount}`;
      if (bid.bidder.id !== user?.id) {
        toastMessage = `${bid.bidder.name} is the highest bidder with $${bid.amount}!`;
      }

      toast({
        variant: "default",
        title: "New Bid Placed",
        description: toastMessage,
      });
    });

    newSocket.on("connect_error", (err: Error) => {
      console.error("Connection error:", err.message);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: err.message,
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  if (!data || isLoading) return <h1>Loading...</h1>;
  if (error) return <h1>Error loading GPU</h1>;

  const placeBid = (amount: number) => {
    const newBid = {
      gpu: data.id,
      amount,
      bidTime: new Date(),
    };
    socket?.emit("placeBid", newBid);
  };

  const getDefaultAmount = () => {
    const increment = 1;
    if (data.bids.length === 0) return data.price + increment;

    return data.bids[0].amount + increment;
  };

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
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg">
                  Place Bid
                </Button>
              </DialogTrigger>
              <BidModal
                defaultAmount={getDefaultAmount()}
                onSubmit={placeBid}
              />
            </Dialog>
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
                  <CardTitle>Recent Bids</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-8">
                  {data.bids.map((bid) => (
                    <div key={bid.id} className="flex items-center gap-4">
                      <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src="/avatars/01.png" alt="Avatar" />
                        <AvatarFallback>OM</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">
                          {bid.bidder.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {bid.bidder.email}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">${bid.amount}</div>
                    </div>
                  ))}
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

interface BidModalProps {
  defaultAmount: number;
  onSubmit: (amount: number) => void;
}
interface BidModalInputs {
  amount: number;
}

const BidModal = ({ defaultAmount, onSubmit }: BidModalProps) => {
  const { register, handleSubmit } = useForm<BidModalInputs>();

  const onSubmitInner: SubmitHandler<BidModalInputs> = (data) => {
    onSubmit(data.amount);
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Place a Bid</DialogTitle>
        <DialogDescription>
          Place an amount higher than last bid.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmitInner)}>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="amount">Amount</Label>
            <Input
              type="number"
              id="amount"
              defaultValue={defaultAmount}
              min={defaultAmount}
              className="w-1/4"
              {...register("amount", { required: true, min: defaultAmount })}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit">Bid</Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default ProductDetailsPage;
