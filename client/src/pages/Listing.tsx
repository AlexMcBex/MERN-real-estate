import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Contact from "../components/Contact";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
SwiperCore.use([Navigation]);
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { useSelector } from "react-redux";

interface Listing {
  userRef: string;
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
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);

  const params = useParams();
  const { currentUser = null } = useSelector((state: any) => state.user || {});


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
          <Swiper navigation={true}>
            {listing.imageUrls.map((url: string) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url("${url}") center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
                {/* <img src={url} alt="listing image" /> */}
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 bordeer rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 3000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2 font-bold text-slate-800">
              Link Copied
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ${" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>

            <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${+listing.regularPrice - +listing.discountPrice}{" "}
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="flex items-center text-green-900 font-semibold text-md  gap-4 sm:gap-6 flex-wrap">
              <li className="flex items-center gap-2 whitespace-nowrap text-green-900 font-semibold text-md">
                <FaBed className="text-lg" />
                {listing.bedrooms}
                {listing.bedrooms > 1 ? ` beds` : ` bed`}
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap text-green-900 font-semibold text-md">
                <FaBath className="text-lg" />
                {listing.bathrooms}
                {listing.bathrooms > 1 ? ` baths` : ` bath`}
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap text-green-900 font-semibold text-md">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking" : "No Parking"}
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap text-green-900 font-semibold text-md">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Not furnished"}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact &&
            <button 
            onClick={()=> setContact(true)}
            className="bg-slate-700 text-white rounded-lg uppercase hover hover:opacity-95 p-3">Contact Landlord</button>
            }
            {contact && <Contact listing={listing}/>}
          </div>
        </>
      )}
      {/* {listing && <p>{JSON.stringify(listing)}</p>} */}
    </div>
  );
} 
