"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PreviewPost from "./PreviewPost";
import MDEditor from "@uiw/react-md-editor";
// //import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { PlusIcon } from "@heroicons/react/20/solid";
import { ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface FAQ {
  question: string;
  answer: string;
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
  faqs: FAQ[];
}

interface PostFormProps {
  post?: Post;
  isAdminEdit?: boolean;
}

export default function PostForm({ post, isAdminEdit = false }: PostFormProps) {
  const router = useRouter();

  // const { data: session } = useSession();
  // const isAdmin = session?.user?.role === "admin";

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  // const [isImageValid, setIsImageValid] = useState(false);
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

  const [faqs, setFaqs] = useState<FAQ[]>(post?.faqs || [{ question: '', answer: '' }]);
  const [imageError, setImageError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const isValid =
      formData.title.trim() !== "" &&
      formData.content.trim() !== "" &&
      formData.categoryIds.length > 0 &&
      formData.image.trim() !== "" && validateImageUrl(formData.image)

    setIsFormValid(isValid);
  }, [formData]);

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
    if (!url) return true // Allow empty URL
    if (!url.startsWith('https://i.ibb.co/')) {
      setImageError('Please use a valid image URL from imgbb.com')
      return false
    }
    setImageError(null)
    return true
  }

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleFaqChange = (index: number, field: keyof FAQ, value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setFaqs(newFaqs);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (faqs.some(faq => !faq.question || !faq.answer)) {
      setError('At least one complete FAQ is required');
      setIsLoading(false);
      return;
    }

    if (faqs.some(faq => faq.question.length > 70)) {
      setError('FAQ questions must be under 40 characters');
      setIsLoading(false);
      return;
    }

    if (faqs.some(faq => faq.answer.length > 200)) {
      setError('FAQ answers must be under 100 characters');
      setIsLoading(false);
      return;
    }

    if (formData.categoryIds.length === 0) {
      setError("Please select at least one category");
      return;
    }

    if (!validateImageUrl(formData.image)) return

    try {
      const response = await fetch(
        post ? `/api/posts/${post.id}/update` : "/api/posts",
        {
          method: post ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            categories: formData.categoryIds,
            faqs
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
    } catch {
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
          <div className={cn(
            "space-y-6",
            !isAdminEdit && post && "opacity-50 pointer-events-none"
          )}>
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
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
                id="seoTitle"
                type="text"
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
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="Brief description of the post"
                rows={3}
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.description.length}/160 characters recommended
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Featured Image URL
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value })
                    validateImageUrl(e.target.value)
                  }}
                  className={cn(
                    "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500",
                    imageError && "border-red-300 focus:border-red-500 focus:ring-red-500"
                  )}
                />
                {imageError && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <ExclamationCircleIcon className="h-4 w-4" />
                    {imageError}
                  </p>
                )}
                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <InformationCircleIcon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        How to add an image:
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Go to <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">imgbb.com</a></li>
                          <li>Upload your image (32 MB limit)</li>
                          <li>After upload, copy the <strong>Direct link</strong> (starts with https://i.ibb.co/)</li>
                          <li>Paste the link in this field</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          


          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <div className="mt-1">
              <MDEditor
                value={content}
                onChange={(value) => setContent(value || '')}
                preview="edit"
                height={400}
                data-color-mode="light"
              />
            </div>
          </div>

          <div className=" bg-white p-5 rounded ">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Categories
              </label>
              <span className="text-xs text-red-500">* Required</span>
            </div>
            <p className="text-sm text-gray-500 mt-1 mb-3">
              Select at least one category to publish your post. For better monetization opportunities, we recommend choosing a focused category that best matches your content.
            </p>
            <div className="mt-1">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors"
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
            {formData.categoryIds.length === 0 && (
              <p className="text-sm text-amber-600 mt-2">
                Please select at least one category before publishing
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">FAQs</h3>
              <button
                type="button"
                onClick={handleAddFaq}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusIcon className="h-4 w-4 mr-1.5" />
                Add FAQ
              </button>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-gray-700">
                          Question ({70 - faq.question.length} characters left)
                        </label>
                        {faqs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFaq(index)}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        maxLength={70}
                        value={faq.question}
                        onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Answer ({200 - faq.answer.length} characters left)
                      </label>
                      <textarea
                        maxLength={200}
                        value={faq.answer}
                        onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                        rows={5}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-center flex-1">
                <input
                  type="checkbox"
                  id="publishStatus"
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData({ ...formData, published: e.target.checked })
                  }
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  aria-describedby="publish-description"
                />
                <label htmlFor="publishStatus" className="ml-3 flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">Publish Post</span>
                </label>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Publishing Options
              </h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Check to submit your post for review and publishing
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Uncheck to save as draft for later editing
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Drafts can be accessed and edited anytime
                </li>
              </ul>
            </div>
          </div>
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
