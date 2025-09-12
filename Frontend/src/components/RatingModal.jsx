import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { rateStore } from '../features/stores/storeSlice';
import { FaStar, FaTimes, FaCheck, FaSpinner } from 'react-icons/fa';

const RatingModal = ({ storeId, storeName, currentRating = 0, onClose }) => {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(currentRating);
  const [hover, setHover] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    dispatch(rateStore({ storeId, value: rating }))
      .unwrap()
      .then(() => {
        setIsLoading(false);
        onClose();
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message || 'Failed to submit rating. Please try again.');
      });
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    if (error) setError(null);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Rate this Store</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
        
        {storeName && (
          <p className="text-lg text-gray-700 mb-2 text-center font-medium">{storeName}</p>
        )}
        
        <div className="flex justify-center text-4xl mb-6">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <label key={ratingValue} className="mx-1">
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onClick={() => handleRatingChange(ratingValue)}
                  className="hidden"
                  disabled={isLoading}
                />
                <FaStar
                  className={`cursor-pointer transition-all duration-150 transform ${isLoading ? 'opacity-50' : 'hover:scale-110'}`}
                  color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                  onMouseEnter={() => !isLoading && setHover(ratingValue)}
                  onMouseLeave={() => !isLoading && setHover(0)}
                />
              </label>
            );
          })}
        </div>
        
        <div className="text-center mb-6">
          <p className="text-gray-600">
            {rating === 0 ? 'Select your rating' : `You rated: ${rating} star${rating !== 1 ? 's' : ''}`}
          </p>
          {error && (
            <p className="text-red-500 mt-2 text-sm font-medium">{error}</p>
          )}
        </div>
        
        <div className="flex gap-4">
          
          <button
            onClick={handleSubmit}
            disabled={isLoading || rating === 0}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:from-blue-300 disabled:to-indigo-300 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" /> Submitting...
              </>
            ) : (
              <>
                 Submit Rating
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;