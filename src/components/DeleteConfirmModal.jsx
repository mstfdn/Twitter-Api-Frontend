import React from 'react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, postContent }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Tweet'i Sil</h2>
        
        <p className="text-gray-600 mb-6">
          Bu tweet'i silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
        </p>
        
        {postContent && (
          <div className="bg-gray-100 p-3 rounded-lg mb-6 text-gray-700 text-sm">
            <p className="line-clamp-3">{postContent}</p>
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;