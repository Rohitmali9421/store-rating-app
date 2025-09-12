import { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import RatingModal from './RatingModal';

const StoreCard = ({ store }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="border p-5 rounded-2xl shadow-md hover:shadow-2xl hover:scale-[1.02] transition-all bg-white flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold mb-1 text-gray-900">{store.name}</h3>
          <p className="text-gray-500 mb-3 text-sm">{store.address}</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 text-base">
              <FaStar className="text-yellow-400" />
              <span className="font-semibold text-gray-800">{store.overallRating}</span>
              <span className="text-xs text-gray-500">(Overall)</span>
            </div>
            
            {store.userSubmittedRating !== null ? (
              <div className="flex items-center gap-2 bg-blue-50 px-2 py-1 rounded-full text-blue-600 text-sm font-medium">
                <FaRegStar className="text-blue-500" />
                <span>{store.userSubmittedRating}</span>
              </div>
            ) : (
              <span className="text-xs text-gray-400 italic">Not rated yet</span>
            )}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-blue-400 text-white p-2.5 rounded-lg font-medium hover:bg-blue-500 transition-all shadow-sm"
          >
            {store.userSubmittedRating ? 'Update Your Rating' : 'Rate This Store'}
          </button>
        </div>
      </div>
      
      {isModalOpen && (
        <RatingModal 
          storeId={store.id} 
          currentRating={store.userSubmittedRating || 0}
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
};

export default StoreCard;
