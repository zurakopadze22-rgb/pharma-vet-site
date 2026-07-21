import React from 'react';

export const ProductCardSkeleton = () => (
  <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-4 animate-pulse">
    <div className="aspect-square bg-slate-100 rounded-2xl mb-4" />
    <div className="h-3 bg-slate-100 rounded w-1/3 mb-2" />
    <div className="h-4 bg-slate-100 rounded w-3/4 mb-3" />
    <div className="flex justify-between items-center mt-4">
      <div className="h-5 bg-slate-100 rounded w-1/4" />
      <div className="w-8 h-8 bg-slate-100 rounded-xl" />
    </div>
  </div>
);

export const BlogCardSkeleton = () => (
  <div className="bg-white border-2 border-slate-100 rounded-[2rem] overflow-hidden animate-pulse">
    <div className="h-48 bg-slate-100" />
    <div className="p-6">
      <div className="h-3 bg-slate-100 rounded w-1/4 mb-3" />
      <div className="h-5 bg-slate-100 rounded w-5/6 mb-3" />
      <div className="h-3 bg-slate-100 rounded w-full mb-2" />
      <div className="h-3 bg-slate-100 rounded w-2/3" />
    </div>
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
    <div className="h-4 bg-slate-100 rounded w-24 mb-6" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
      <div className="aspect-square bg-slate-100 rounded-[2.5rem]" />
      <div className="space-y-4">
        <div className="h-4 bg-slate-100 rounded w-1/4" />
        <div className="h-8 bg-slate-100 rounded w-3/4" />
        <div className="h-12 bg-slate-100 rounded w-1/3" />
        <div className="h-24 bg-slate-100 rounded-[1.5rem]" />
      </div>
    </div>
  </div>
);

export default {
  ProductCardSkeleton,
  BlogCardSkeleton,
  ProductDetailSkeleton,
};
