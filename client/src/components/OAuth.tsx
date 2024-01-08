// import React from 'react'

export default function OAuth() {
    const handleGoogleClick = async () =>{
        try{
            
        }catch(err){
            console.log('could not login with Google' , err)
        }
    }
  return (
    <button onClick={handleGoogleClick} type='button' className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95">Continue with Google</button>
  )
}
