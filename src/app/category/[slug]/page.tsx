import { getProductsByCategory, getCategoryBySlug } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
import { notFound } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategoryBySlug(params.slug);
  const products = getProductsByCategory(params.slug);

  if (!category) {
    notFound();
  }

  const brands = ['Nike', 'Puma', 'Adidas', 'Other Brands'];
  const teams = ['FC Barcelona', 'Real Madrid', 'Manchester United'];
  const nationalTeams = ['Brazil', 'Argentina', 'Germany'];

  return (
    <div className="grid md:grid-cols-4 gap-8">
      <div className="md:col-span-1">
        <Card className="p-6 rounded-2xl glassmorphism sticky top-24">
          <h2 className="text-2xl font-bold mb-6 font-headline">{category.name}</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3 text-white">Sort by</h3>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Featured" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-white">Brand</h3>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox id={`brand-${brand}`} />
                    <Label htmlFor={`brand-${brand}`} className="text-neutral-300">{brand}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-white">Teams</h3>
              <div className="space-y-2">
                {teams.map((team) => (
                  <div key={team} className="flex items-center space-x-2">
                    <Checkbox id={`team-${team}`} />
                    <Label htmlFor={`team-${team}`} className="text-neutral-300">{team}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-white">National Teams</h3>
              <div className="space-y-2">
                {nationalTeams.map((team) => (
                  <div key={team} className="flex items-center space-x-2">
                    <Checkbox id={`national-team-${team}`} />
                    <Label htmlFor={`national-team-${team}`} className="text-neutral-300">{team}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="md:col-span-3">
        {products.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 rounded-2xl glassmorphism">
            <h3 className="text-2xl font-bold">No products found</h3>
            <p className="text-neutral-400 mt-2">Check back later or browse other categories.</p>
          </div>
        )}
      </div>
    </div>
  );
}
