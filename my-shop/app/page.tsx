import Banner from '@/components/Banner'
import ProductContainer from '@/components/product/ProductContainer';
import SuggestionP from '@/components/SuggestionP';

export default function Home() {
  return (
    <main className="">
      <Banner />
      <ProductContainer />
      <SuggestionP />
      <SuggestionP />
    </main>
  );
}
