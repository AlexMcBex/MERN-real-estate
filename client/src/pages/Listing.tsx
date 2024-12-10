import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
SwiperCore.use([Navigation]);
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
interface Listing {
  name: string;
  description: string;
  address: string;
  regularPrice: number;
  discountPrice: number;
  bathrooms: number;
  bedrooms: number;
  furnished: boolean;
  parking: boolean;
  type: string;
  offer: boolean;
  imageUrls: string[];
  _id: string;
}
export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const params = useParams();
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.id}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          setError(false);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.id]);
  return (
    <div>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong</p>
      )}
      {listing && !loading && !error && (
        <>
          {/* <h1 className="text-center my-7 text-2xl">{listing.name}</h1> */}
          <Swiper navigation= {true} >
            {listing.imageUrls.map((url: string) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{ background: `url("${url}") center no-repeat`, backgroundSize: "cover" }}
                ></div>
                {/* <img src={url} alt="listing image" /> */}
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
      {/* {listing && <p>{JSON.stringify(listing)}</p>} */}
    </div>
  );
}
