"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PreviewPost from "./PreviewPost";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import { useSession } from "next-auth/react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Post {
  id?: string;
  title: string;
  seoTitle?: string;
  description?: string;
  content: string;
  image?: string;
  published?: boolean;
  categories?: Category[];
}

interface PostFormProps {
  post?: Post;
}

export default function PostForm({ post }: PostFormProps) {
  const router = useRouter();

  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isImageValid, setIsImageValid] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [content, setContent] = useState(post?.content || "");

  const [formData, setFormData] = useState({
    title: post?.title || "",
    seoTitle: post?.seoTitle || "",
    description: post?.description || "",
    content: post?.content || "",
    published: post?.published || false,
    categoryIds: post?.categories?.map((cat) => cat.id) || [],
    image: post?.image || "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const isValid =
      formData.title.trim() !== "" &&
      formData.content.trim() !== "" &&
      formData.categoryIds.length > 0 &&
      (formData.image === "" || isImageValid); // Image is optional but must be valid if provided

    setIsFormValid(isValid);
  }, [formData, isImageValid]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, content }));
  }, [content]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      if (response.ok) {
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const validateImageUrl = (url: string) => {
    if (!url) {
      return true // Empty URL is valid (image is optional)
    }

    try {
      new URL(url) // Basic URL validation
      const isImageUrl = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url)
      
      if (!isImageUrl) {
        return false
      }
      
      return true
    } catch {
      return false
    }
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (formData.categoryIds.length === 0) {
      setError("Please select at least one category");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        post ? `/api/posts/${post.id}` : "/api/posts",
        {
          method: post ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            categories: formData.categoryIds,
          }),
        }
      );

      if (response.ok) {
        router.push("/dashboard/posts");
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || "Something went wrong");
      }
    } catch{
      setError("Failed to save post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData((prev) => {
      const categoryIds = prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId];
      return { ...prev, categoryIds };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end space-x-4 mb-4">
        <button
          type="button"
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isPreviewMode ? "Edit Mode" : "Preview Mode"}
        </button>
      </div>

      {isPreviewMode ? (
        <PreviewPost
          {...formData}
          categories={categories.filter((cat) =>
            formData.categoryIds.includes(cat.id)
          )}
        />
      ) : (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="seoTitle"
              className="block text-sm font-medium text-gray-700"
            >
              SEO Title
            </label>
            <input
              type="text"
              id="seoTitle"
              value={formData.seoTitle}
              onChange={(e) =>
                setFormData({ ...formData, seoTitle: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Optimized title for search engines"
            />
            <p className="mt-1 text-sm text-gray-500">
              {formData.seoTitle.length}/60 characters recommended
            </p>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Brief description of the post"
            />
            <p className="mt-1 text-sm text-gray-500">
              {formData.description.length}/160 characters recommended
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => {
                    const url = e.target.value.trim()
                    const isValid = validateImageUrl(url)
                    setFormData(prev => ({ ...prev, image: url }))
                    setIsImageValid(isValid)
                    if (!isValid && url) {
                      setError('Please enter a valid image URL (jpg, jpeg, png, webp, gif, svg)')
                    } else {
                      setError(null)
                    }
                  }}
                  placeholder="https://example.com/image.jpg"
                  className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 ${
                    isImageValid ? 'border-gray-300 focus:border-blue-500' : 'border-red-300 focus:border-red-500'
                  }`}
                />
                {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
              </div>

              <div className="text-xs text-gray-500">
                Supported formats: JPG, JPEG, PNG, WebP, GIF, SVG
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories
            </label>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={formData.categoryIds.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div data-color-mode="light">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <MDEditor
              value={content}
              onChange={(value) => setContent(value || "")}
              preview="edit"
              previewOptions={{
                rehypePlugins: [[rehypeSanitize]],
              }}
              height={400}
              className="w-full"
              textareaProps={{
                placeholder: "Write your post content here...",
              }}
            />
          </div>

          {/* Only show publish option for admin users */}
          {isAdmin && (
            <div className="flex items-center">
              <input
                id="published"
                type="checkbox"
                checked={formData.published}
                onChange={(e) =>
                  setFormData({ ...formData, published: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="published"
                className="ml-2 block text-sm text-gray-900"
              >
                Publish post
              </label>
            </div>
          )}

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : post ? "Update Post" : "Create Post"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
