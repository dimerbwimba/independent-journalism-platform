'use client'
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface Article {
    id: string;
    title: string;
    description: string;
    url: string;
    slug: string;
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
                    <Link
                        key={article.id}
                        href={`/article/${article.slug}`}
                        className="relative group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white h-[300px]"
                    >
                        <div className="h-full w-full relative">
                            <Image
                                src={article.image}
                                alt={`${article.title} Hotels`}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                priority={true}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                            <div className="absolute inset-0 flex flex-col justify-end p-6">
                                <h3 className="text-2xl font-bold text-white drop-shadow-sm">{article.title}</h3>
                                <p className="text-sm text-white/90 mt-2 line-clamp-2 drop-shadow-sm">
                                    {article.description}
                                </p>

                                <div className="mt-4 inline-flex items-center text-sm font-medium text-white translate-y-0 group-hover:translate-x-1 transition-all duration-300">
                                    Read More
                                    <span className="ml-2">→</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CountryArticles;