import React, { useState ,useEffect} from 'react';
import './CSS/Wardrobe.css';
import { ref, uploadBytes, getDownloadURL,listAll } from 'firebase/storage';
import { storage, auth } from '../firebase'; 
import { v4 as uuidv4 } from 'uuid';
import outfit1 from '../components/Assets/outfit1.webp';
import outfit2 from '../components/Assets/outfit2.webp';
import outfit3 from '../components/Assets/outfit3.webp';
import outfit4 from '../components/Assets/pastPick1.webp';
import outfit5 from '../components/Assets/pastPick2.webp';

const Wardrobe = ({ isAuthenticated, setImages,images }) => {
  //const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  
  const items = [
    { title: 'Cotton black shirt and shorts', image: outfit1 },
    { title: 'Cotton Brown top, black pants', image: outfit2 },
    { title: 'Nylon Grey top, brown pants', image: outfit3 },
    { title: 'Black top and pant', image: outfit4 },
    { title: 'Cotton Brown top, brown pants', image: outfit5 },
    { title: 'Cotton black shirt and shorts', image: outfit1 },
    { title: 'Cotton Brown top, black pants', image: outfit2 },
    { title: 'Black top and pant', image: outfit4 },
    { title: 'Grey top, brown pants', image: outfit3 },
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchImages(user.uid); // Fetch images if the user is authenticated
      } else {
        setLoading(false); // Stop loading if no user is authenticated
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchImages = async (userId) => {
    const imagesRef = ref(storage, `images/${userId}/`);
    try {
        const listResponse = await listAll(imagesRef);
        const urls = await Promise.all(
            listResponse.items.map((item) => getDownloadURL(item))
        );
        setImages(urls); // Set the URLs in state
    } catch (error) {
        console.error('Error fetching images:', error.message);
    } finally {
        setLoading(false); // Stop loading once images are fetched
    }
};



  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      alert('Please select an image to upload.');
      return;
    }
    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const imageRef = ref(storage, `images/${userId}/${uuidv4()}`);
        const snapshot = await uploadBytes(imageRef, selectedImage);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        setUploadedImageUrl(downloadUrl);
        alert('Image uploaded successfully!');
        setSelectedImage(null); // Reset selected image after upload
        fetchImages(userId); // Refresh images after upload
      } else {
        alert('No user is signed in.');
      }
    } catch (error) {
      console.error('Error uploading image:', error.message);
      alert('Failed to upload image.');
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading indicator while fetching images
}

  return (
    <div className='wardrobe-container'>
      <div className='container'>
      {isAuthenticated ? (
        <div className='uploading'>
          <label className="file-upload-label">
            Select Image
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
          <button className="ward-button" onClick={handleUpload}>Upload Image</button>
          {selectedImage && (
            <div>
              <h3>Selected Image Preview:</h3>
              <img src={URL.createObjectURL(selectedImage)} alt="Preview" width="200" />
            </div>
          )}
        
        
        <h1>My Wardrobe </h1>
        <div className="image-gallery">
            {images.length > 0 ? (
                images.map((url, index) => (
                    <img key={index} src={url} alt={`Outfit ${index + 1}`} width="150" />
                ))
            ) : (
                <p>No images uploaded yet.</p>
            )}
        </div>
        </div>
      ) : (
        <div>
          <h3>Please sign in to upload images.</h3>
        </div>
      )}
    </div>
      

      <div className="wardrobe">
        <h3>Sample Wardrobe Items</h3>
        <div className="image-grid">
          {items.map((item, index) => (
            <div className="image-box" key={index}>
              <h4>{item.title}</h4>
              <div className="image-hover">
                <img src={item.image} alt={item.title} className="item-image" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wardrobe;



