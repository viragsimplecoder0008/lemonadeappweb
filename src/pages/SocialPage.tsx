
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Heart, MessageCircle, Share } from "lucide-react";
import { toast } from "sonner";

interface Post {
  id: string;
  content: string;
  image?: string;
  author: string;
  timestamp: string;
  likes: number;
  comments: number;
}

const SocialPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      content: "Just tried the new strawberry lemonade - absolutely amazing! 🍓",
      author: "Sarah Johnson",
      timestamp: "2 hours ago",
      likes: 15,
      comments: 3
    },
    {
      id: "2",
      content: "Perfect day for some classic lemonade at the park!",
      image: "/classic-lemonade.jpg",
      author: "Mike Chen",
      timestamp: "5 hours ago",
      likes: 28,
      comments: 7
    }
  ]);

  const [newPost, setNewPost] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPost = () => {
    if (!newPost.trim()) {
      toast.error("Please enter some content for your post");
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      content: newPost,
      image: imagePreview || undefined,
      author: "You",
      timestamp: "Just now",
      likes: 0,
      comments: 0
    };

    setPosts([post, ...posts]);
    setNewPost("");
    setSelectedImage(null);
    setImagePreview(null);
    toast.success("Post shared successfully!");
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  return (
    <div className="min-h-screen bg-lemonade-light py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-lemonade-dark mb-8 text-center">
          Lemonade Social
        </h1>

        {/* Create Post Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Share Your Lemonade Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="What's on your mind? Share your lemonade thoughts..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-[100px]"
            />
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                {selectedImage && (
                  <span className="text-sm text-gray-600">
                    {selectedImage.name}
                  </span>
                )}
              </div>
            </div>

            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                >
                  Remove
                </Button>
              </div>
            )}

            <Button
              onClick={handleSubmitPost}
              className="w-full bg-lemonade-yellow hover:bg-lemonade-green text-black"
            >
              Share Post
            </Button>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-lemonade-yellow rounded-full flex items-center justify-center">
                    <span className="font-bold text-black text-sm">
                      {post.author.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lemonade-dark">
                        {post.author}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {post.timestamp}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{post.content}</p>
                    
                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post content"
                        className="w-full h-64 object-cover rounded-lg mb-3"
                      />
                    )}
                    
                    <div className="flex items-center space-x-6 pt-3 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className="text-gray-600 hover:text-red-500"
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        {post.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-blue-500"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-green-500"
                      >
                        <Share className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialPage;
