import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { updateUserStart, updateUserSuccess, updateUserError } from "../redux/user/userSlice"; //redux
import { useDispatch } from "react-redux";

export default function Profile() {
  const { currentUser } = useSelector(
    (state: { user: { currentUser: any } }) => state.user
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

  const dispatch = useDispatch()

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
      (error: any) => {
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


  const handleSubmit = async (e:any) =>{
    e.preventDefault()
    try{
      dispatch(updateUserStart())
      const res = await fetch(`api/user/update/${currentUser._id}`,{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json()
      if (data.success === false){
        dispatch(updateUserError(data.message))
        return
      }
      dispatch(updateUserSuccess(data))
    }catch(error:any){
      dispatch(updateUserError(error.message))
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form 
      className="flex flex-col gap-4"
      onSubmit={handleSubmit}
      >
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
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          Update
        </button>
        <div className="flex justify-between mt-5">
          <span className="text-red-700 cursor-pointer">Delete account</span>
          <span className="text-red-700 cursor-pointer">Sign out</span>
        </div>
      </form>
    </div>
  );
}
