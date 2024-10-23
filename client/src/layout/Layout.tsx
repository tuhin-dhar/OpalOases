import { useAppContext } from "@/context/AppContext";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import Hero from "../Components/Hero";
import SearchBar from "../Components/SearchBar";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const {} = useAppContext();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Hero />
      <div className="container mx-auto">
        <SearchBar />
      </div>

      <div className="container mx-auto py-10 flex-1">{children}</div>
      <Footer />
    </div>
  );
}
