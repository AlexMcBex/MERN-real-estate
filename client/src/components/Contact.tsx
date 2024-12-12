import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

interface ContactProps {
  listing: Listing;
}

interface Landlord {
  username: string;
  email: string
}

export default function Contact({ listing }: ContactProps) {
  const [landlord, setLandlord] = useState<Landlord | null>(null);
  const [message, setMessage] = useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>)=>{
    setMessage(e.target.value)
  }

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);


  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p className="">
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows={2}
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
          ></textarea>
          <Link
          to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
          className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
          Send Message
          </Link>
        </div>
      )}
    </>
  );
}
