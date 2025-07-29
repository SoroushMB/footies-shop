'use client';

import { useEffect, useState } from 'react';
import { getSuggestions } from '@/app/actions/product';
import type { ProductSuggestionOutput } from '@/ai/flows/product-suggestion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Wand2 } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface ProductSuggestionsProps {
  currentSelection: string;
}

export function ProductSuggestions({ currentSelection }: ProductSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<ProductSuggestionOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSuggestions() {
      setLoading(true);
      const result = await getSuggestions({ currentSelection });
      setSuggestions(result);
      setLoading(false);
    }
    fetchSuggestions();
  }, [currentSelection]);

  if (loading) {
    return (
        <Card className="glassmorphism">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wand2 /> You Might Also Like</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-5/6" />
            </CardContent>
        </Card>
    );
  }

  if (!suggestions || suggestions.suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold font-headline"><Wand2 className="text-accent" /> You Might Also Like</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-neutral-400 italic mb-4">{suggestions.reasoning}</p>
        <ul className="list-disc list-inside space-y-2">
            {suggestions.suggestions.map((suggestion, index) => (
                <li key={index} className="text-neutral-200">{suggestion}</li>
            ))}
        </ul>
      </CardContent>
    </Card>
  );
}
