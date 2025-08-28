"use client";

import {Button} from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {zodResolver} from "@hookform/resolvers/zod";
import {StarPicker} from "@/components/star-picker";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {ReviewGetOneOutput} from "../../types";
import {useTRPC} from "@/trpc/client";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {Skeleton} from "@/components/ui/skeleton";

interface Props {
  productId: string;
  initialData?: ReviewGetOneOutput;
}
interface ReviewSkeletonProps {
  lines?: number;
  showButtons?: boolean;
}

const formSchema = z.object({
  rating: z.number().min(1, {message: "Rating is required"}).max(5),
  description: z.string().min(1, {message: "Description is required"}),
});

export default function ReviewForm({productId, initialData}: Props) {
  const [isPreview, setIsPreview] = useState(!!initialData);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createReview = useMutation(
    trpc.reviews.create.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries(
          trpc.reviews.getOne.queryOptions({productId})
        );
        setIsPreview(true);
      },
      onError(error) {
        toast.error(error.message);
      },
    })
  );

  const updateReview = useMutation(
    trpc.reviews.update.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries(
          trpc.reviews.getOne.queryOptions({productId})
        );
        setIsPreview(true);
      },
      onError(error) {
        toast.error(error.message);
      },
    })
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: initialData?.rating || 0,
      description: initialData?.description || "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Handle form submission logic here
    if (initialData) {
      updateReview.mutate({
        reviewId: initialData.id,
        description: data.description,
        rating: data.rating,
      });
    } else {
      createReview.mutate({
        productId,
        rating: data.rating,
        description: data.description,
      });
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-4"
        >
          <p className="font-medium">
            {isPreview ? "Your rating" : "Liked it? Give it a rating"}
          </p>

          <FormField
            control={form.control}
            name="rating"
            render={({field}) => (
              <FormItem>
                <FormControl>
                  <StarPicker
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isPreview}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({field}) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Want to leave a written review?"
                    disabled={isPreview}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isPreview && (
            <Button
              type="submit"
              disabled={createReview.isPending || updateReview.isPending}
              size="lg"
              className="bg-black text-white mt-4 hover:bg-pink-400 hover:text-black w-fit transition-colors"
            >
              {initialData ? "Update Review" : "Submit Review"}
            </Button>
          )}
        </form>
      </Form>

      {isPreview && (
        <Button
          onClick={() => setIsPreview(false)}
          size="lg"
          type="button"
          variant="outline"
          className="w-fit"
        >
          Edit
        </Button>
      )}
    </div>
  );
}

export function ReviewSkeleton({
  lines = 3,
  showButtons = true,
}: ReviewSkeletonProps) {
  return (
    <div className="space-y-4 w-full max-w-xl">
      {/* title */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40 rounded-md" />
        <Skeleton className="h-6 w-16 rounded-md" />
      </div>

      {/* star row */}
      <div className="flex items-center gap-2">
        {Array.from({length: 5}).map((_, i) => (
          <Skeleton key={i} className="h-8 w-8 rounded-md" />
        ))}
      </div>

      {/* description lines */}
      <div className="space-y-2">
        {Array.from({length: lines}).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-4 rounded-md ${i === 0 ? "w-full" : i === lines - 1 ? "w-3/4" : "w-11/12"}`}
          />
        ))}
      </div>

      {/* textarea preview box */}
      <Skeleton className="h-24 w-full rounded-md" />

      {/* buttons */}
      {showButtons && (
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-32 rounded-2xl" />
          <Skeleton className="h-10 w-20 rounded-2xl" />
        </div>
      )}
    </div>
  );
}
