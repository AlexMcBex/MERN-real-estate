import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserError,
  deleteUserStart,
  deleteUserError,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserError,
  signOutUserSuccess,
} from "../redux/user/userSlice"; //redux
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FaDraft2Digital } from "react-icons/fa";

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

export default function Profile() {
  const { currentUser, loading, error } = useSelector(
    (state: { user: { currentUser: any; loading: boolean; error: any } }) =>
      state.user
  );
  // in TS the pipe "|" character is an union, declares that a variable can be either one or the other type
  const [file, setFile] = useState<File | undefined>(undefined);
  // image upload percentage status
  const [filePerc, setFilePerc] = useState<number>(0);
  // image upload error
  const [uploadError, setUploadError] = useState<boolean>(false);

  const [formError, setFormError] = useState<boolean>(false);
  // we store the file for the image profile in a const using useref()
  // we specify with this syntax that formData contains a avatar string optional property
  const [formData, setFormData] = useState<{ avatar?: string }>({});

  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [showListingsError, setShowListingsError] = useState(false);

  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  // console.log(formData);
  // console.log(filePerc)
  // console.log(uploadError)

  // Being in TS we give the type to the const
  const fileRef = useRef<HTMLInputElement>(null);
  // console.log(currentUser);
  // change rules in firbease to the following:
  // allow read
  //     allow write: if
  //     request.resource.size < 2 *1024 *1024 &&
  //     request.resource.contentType.matches('image/.*');

  const handleFileUpload = (file: File) => {
    const storage = getStorage(app);
    // this way we will always have a different file name
    const fileName = new Date().getTime() + file.name;
    // with storageRef we say where to save the file in the storage
    // in this case, having only fileName as second value there wont be any folders
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress displays the % progress of upload
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done')
        setFilePerc(Math.round(progress));
      },
      () => {
        setUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserError(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
    } catch (error: any) {
      dispatch(updateUserError(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserError(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error: any) {
      dispatch(deleteUserError(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`api/auth/signout`);
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserError(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (err) {
      dispatch(signOutUserError(err));
    }
  };

  const showListings = async () => {
    try {
      const res = await fetch(`api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      console.log(data);
      setUserListings(data);
    } catch (err) {
      setShowListingsError(true);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* we reference to file Ref with ref to upload images */}
        <input
          onChange={(e) => {
            setFile(e.target.files![0]);
          }}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          // "!" after a variable functions as a non-null assertion
          onClick={() => {
            fileRef.current!.click();
          }}
          // if formData avatar contains a image display that
          src={formData.avatar || currentUser.avatar}
          alt="profile avatar"
          // referrerPolicy="no-referrer"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 "
        />
        {/* Display upload percentage */}
        <p className="text-small self-center">
          {uploadError ? (
            <span className="text-red-700">
              Error! (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image uploaded sucessfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg "
          onChange={handleChange}
          id="username"
        />
        <input
          type="text"
          placeholder="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          id="email"
          defaultValue={currentUser.email}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          to={"/create-listing"}
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      {/* the error here is defined in user.controller.js */}
      <p className="text-red-500 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "User updated successfully" : ""}
      </p>

      <button className="text-green-700" onClick={showListings}>
        Show Listings
      </button>
      <p className="text-red-700">{showListingsError && "An error occoured"}</p>
        {userListings &&
          userListings.length > 0 &&
          <div className="flex flex-col gap-4">
            <h1 className="text-center mt-7 text-xl font-semibold">Your Listings</h1>
          {userListings.map((listing: Listing) => (
            <div
              key={listing._id}
              className="flex border rounded-lg p-3 justify-between items-center my-2 gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="Listing Cover"
                  className="h-16 w-16 object-contain rounded-lg"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold flex-1 hover:underline truncate"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button className="text-red-700 uppercase">Delete</button>
                <button className="text-green-700 uppercase">Edit</button>
              </div>
            </div>
          ))}
      </div>}
    </div>
  );
}
