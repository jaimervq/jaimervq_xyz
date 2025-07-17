import MasonryGrid from "../components/masonry_grid";
import galleryDigital from "@/lib/gallery_digital.json";
import galleryTraditional from "@/lib/gallery_traditional.json";


export const runtime = "nodejs";
export const dynamic = "force-static";


export default function GalleryPage() {
  return (
    <>
      <h1>Digital art</h1>
      <MasonryGrid imagePaths={galleryDigital} />
      <br />
      <h1>Traditional art</h1>
      <MasonryGrid imagePaths={galleryTraditional} />
    </>
  );
}