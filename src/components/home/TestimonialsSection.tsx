
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Star, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface Review {
  name: string;
  rating: number;
  text: string;
  imageUrl?: string;
}

const TestimonialsSection: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Load reviews from localStorage on component mount
  useEffect(() => {
    const savedReviews = localStorage.getItem("userReviews");
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, []);

  // Save reviews to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("userReviews", JSON.stringify(reviews));
  }, [reviews]);

  const handleSubmitReview = () => {
    // Validate inputs
    if (!name || !reviewText) {
      toast.error("Please enter your name and review");
      return;
    }

    // Create new review
    const newReview: Review = {
      name,
      rating,
      text: reviewText,
      imageUrl: imageUrl || undefined
    };

    // Add review to state
    setReviews([...reviews, newReview]);

    // Reset form and close dialog
    setName("");
    setRating(5);
    setReviewText("");
    setImageUrl(null);
    setImageFile(null);
    setIsDialogOpen(false);

    toast.success("Thank you for your review!");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const removeImage = () => {
    setImageUrl(null);
    setImageFile(null);
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">What Our Customers Say</h2>
          <p className="mt-2 text-gray-600">Don't just take our word for it</p>
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-1 mb-4 text-lemonade-yellow">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className="h-5 w-5 fill-current"
                      fill={i < review.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{review.text}</p>
                {review.imageUrl && (
                  <div className="mb-4">
                    <img 
                      src={review.imageUrl} 
                      alt="Review image" 
                      className="w-full h-40 object-cover rounded-md"
                    />
                  </div>
                )}
                <p className="font-semibold">— {review.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mb-8">No reviews yet. Be the first to share your experience!</p>
        )}

        <div className="mt-8 text-center">
          <Button 
            className="bg-lemonade-yellow hover:bg-lemonade-green text-black px-8"
            onClick={() => setIsDialogOpen(true)}
          >
            Share Your Review
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl">Submit Your Review</DialogTitle>
              <DialogDescription>
                Share your experience with our lemonade products.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-2">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="name">
                  Your Name
                </label>
                <Input
                  id="name"
                  placeholder="First Name + Last Initial (e.g., John D.)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-7 w-7 cursor-pointer"
                      onClick={() => setRating(star)}
                      fill={star <= rating ? "#FFD700" : "none"}
                      stroke={star <= rating ? "#FFD700" : "currentColor"}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="review">
                  Your Review
                </label>
                <textarea
                  id="review"
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell us about your experience..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Add Image (Optional)
                </label>
                {!imageUrl ? (
                  <div className="border-2 border-dashed rounded-md p-4 text-center">
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <Upload className="h-6 w-6 mb-2 text-gray-400" />
                      <span className="text-sm text-gray-500">Upload an image</span>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <button
                      className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-lemonade-yellow hover:bg-lemonade-green text-black"
                  onClick={handleSubmitReview}
                >
                  Submit Review
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default TestimonialsSection;
