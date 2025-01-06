'use client'
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface Article {
    id: string;
    title: string;
    description: string;
    url: string;
    slug:string;
    image: string; // Assuming each article has an image URL
    views: number;
    reactions: number;
}

interface CountryArticlesProps {
    country: string;
}

const CountryArticles: React.FC<CountryArticlesProps> = ({ country }) => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/articles/country?country=${encodeURIComponent(country)}`);
                if (!response.ok) {
                    throw new Error(`Error fetching articles: ${response.statusText}`);
                }
                const data = await response.json();
                setArticles(data.articles);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [country]);

    if (loading) {
        return (
            <div className="border border-blue-300 my-8 shadow rounded-md p-4 max-w-sm w-full mx-auto">
                <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                    <div className="flex-1 space-y-6 py-1">
                        <div className="h-2 bg-slate-200 rounded"></div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                            </div>
                            <div className="h-2 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center"><p>Error: {error}</p></div>;
    }

    return (
        <div className="bg-white rounded-lg my-8 border border-gray-800 p-6">
            <h2 className="text-2xl font-bold mb-4">Articles about {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles.map((article) => (
                    <div key={article.id} className="border-b border-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out">
                        <div className="relative h-48">
                            <div className="absolute top-2 right-2 flex gap-2">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                    {article.views} views
                                </span>
                                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                    {article.reactions} reactions
                                </span>
                            </div>
                            <img src={article.image} alt={article.title} className="w-full mb-4 rounded-md object-cover" />
                        </div>
                        <div className="mt-4">
                            <Link className="text-blue-600 hover:text-blue-800 font-medium mt-2 inline-block" href={`/article/${article.slug}`}>
                                <h3 className="text-lg font-semibold mb-2 text-gray-900">{article.title}</h3>
                            </Link>
                            <p className="text-gray-600 line-clamp-2">{article.description}</p>
                            <Link className="text-blue-600 hover:text-blue-800 font-medium mt-2 inline-block" href={`/article/${article.slug}`}>
                                Read More
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CountryArticles;