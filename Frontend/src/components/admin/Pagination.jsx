import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-10 h-10 rounded-md bg-white border border-gray-300 hover:bg-blue-50 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <FaChevronLeft className="text-blue-600" />
        </button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-md border transition-all duration-200 ${
                currentPage === page
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-blue-50'
              }`}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : null}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center justify-center w-10 h-10 rounded-md bg-white border border-gray-300 hover:bg-blue-50 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <FaChevronRight className="text-blue-600" />
        </button>
      </div>
      
      <span className="text-sm font-medium text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};

export default Pagination;