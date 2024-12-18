import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListingType from "../types/ListingType";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css/bundle";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import ListingCard from "../components/ListingCard";

export default function Home() {
  const [offerListings, setOfferListings] = useState<ListingType[]>([]);
  const [saleListings, setSaleListings] = useState<ListingType[]>([]);
  const [rentListings, setRentListings] = useState<ListingType[]>([]);

  // console.log(offerListings)
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (err) {
        console.log(err);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchOfferListings();
  }, []);
  return (
    <div className="">
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span> home
          with ease.
          <br />
        </h1>
        <div className="text-gray-700 text-xs sm:text-sm">
          Truest Estate is the best platform to find your next place to live.
          <br />
          We will help you to find the perfect place for you.
        </div>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Search for a house...
        </Link>
      </div>
      {/* swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${
                    listing.imageUrls[0] ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeVnLTDlMxpTIH3bW-9_eGp-A53dp-ECQT1Q&s"
                  }) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px] "
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600 ">
                Recent Offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline font-bold"
                to="/searh?offer=true"
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600 ">
                Recent Properties for Rent
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline font-bold"
                to="/searh?type=rent"
              >
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600 ">
                Recent Properties for Sale
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline font-bold"
                to="/searh?type=sale"
              >
                Show more properties for Sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/*  */}
    </div>
  );
}
