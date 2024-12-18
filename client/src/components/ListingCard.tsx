import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

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

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-md overflow-hidden w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0] || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeVnLTDlMxpTIH3bW-9_eGp-A53dp-ECQT1Q&s"}
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2">
          <p className="text-lg font-semibold text-slate-700 truncate">
            {listing.name}
          </p>
          <div className="flex gap-1 items-center">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm truncate text-gray-600">{listing.address}</p>
          </div>
          <p className="line-clamp-2 text-sm text-gray-600 ">{listing.description}
          </p>
          <p className="text-slate-500 mt-2 font- font-semibold">
            $ {listing.offer ? listing.discountPrice.toLocaleString("en-US"): listing.regularPrice.toLocaleString("en-US")} {listing.type === "rent" ? " / month" : ""}
          </p>
          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs">
                {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </div>
            <div className="font-bold text-xs">
                {listing.bedrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
