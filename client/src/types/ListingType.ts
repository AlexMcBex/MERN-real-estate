export default interface ListingType {
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
  