import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GPU } from "@/types";
import { Link } from "react-router-dom";

interface Props {
  data: GPU;
  viewOnly: boolean;
  onDelete: (id: number) => void;
}

const ProductCard = ({ data, viewOnly, onDelete }: Props) => {
  return (
    <Card className="w-full max-w-96">
      <CardHeader>
        <div className="w-full h-48">
          <img
            src="https://picsum.photos/500/280"
            alt={data.name}
            className="rounded-t-lg object-cover w-full h-full"
          />
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{data.name}</CardTitle>
          <Badge variant="secondary">{data.status}</Badge>
        </div>
        <div className="text-sm text-muted-foreground">{data.description}</div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Base Price</span>
            <span className="text-lg font-semibold">${data.price}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Current Bid</span>
            <span className="text-lg font-semibold text-green-600">
              $725.50
            </span>
          </div>
        </div>

        {viewOnly ? (
          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Time Left</span>
              <span className="text-lg font-semibold">2d 14h 37m</span>
            </div>
            <Button className="w-32" asChild>
              <Link to={`/gpus/${data.id}/view`}>Place Bid</Link>
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between mt-4">
            <Button asChild className="w-32">
              <Link to={`/gpus/${data.id}/edit`}>Edit</Link>
            </Button>
            <Button
              onClick={() => onDelete(data.id)}
              variant="destructive"
              className="w-32"
            >
              Delete
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        *Auction ends on July 15, 2023, at 3:00 PM EST
      </CardFooter>
    </Card>
  );
};

export default ProductCard