'use client'

import { useState } from 'react'

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [formData, setFormData] = useState({
    width: '',
    height: '',
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
    cropX: '',
    cropY: '',
    cropWidth: '',
    cropHeight: '',
  })

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(URL.createObjectURL(file))
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData()
    const fileInput = document.getElementById('imageInput')
    if (fileInput.files[0]) {
      data.append('image', fileInput.files[0])
    }

    data.append('width', formData.width)
    data.append('height', formData.height)
    data.append('rotation', formData.rotation)
    data.append('flipHorizontal', formData.flipHorizontal)
    data.append('flipVertical', formData.flipVertical)
    data.append('cropX', formData.cropX)
    data.append('cropY', formData.cropY)
    data.append('cropWidth', formData.cropWidth)
    data.append('cropHeight', formData.cropHeight)

    const response = await fetch('http://127.0.0.1:5000/process-image', {
      method: 'POST',
      body: data,
    })    

    if (response.ok) {
      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      setSelectedImage(imageUrl)
    }
  }

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Resim Yükle ve Düzenle</h1>
      <form onSubmit={handleSubmit}>
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4"
        />

        {selectedImage && (
          <div className="mb-4">
            <img
              src={selectedImage}
              alt="Yüklenen"
              className="max-w-full h-auto border rounded shadow"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-1">Boyut</label>
          <input
            type="number"
            name="width"
            placeholder="Genişlik"
            value={formData.width}
            onChange={handleChange}
            className="border p-2 mr-2"
          />
          <input
            type="number"
            name="height"
            placeholder="Yükseklik"
            value={formData.height}
            onChange={handleChange}
            className="border p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Döndürme (derece)</label>
          <input
            type="number"
            name="rotation"
            value={formData.rotation}
            onChange={handleChange}
            className="border p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Çevirme</label>
          <label className="mr-2">
            <input
              type="checkbox"
              name="flipHorizontal"
              checked={formData.flipHorizontal}
              onChange={handleChange}
            />{' '}
            Yatay
          </label>
          <label>
            <input
              type="checkbox"
              name="flipVertical"
              checked={formData.flipVertical}
              onChange={handleChange}
            />{' '}
            Dikey
          </label>
        </div>

        <div className="mb-4">
          <label className="block mb-1">Kırpma</label>
          <input
            type="number"
            name="cropX"
            placeholder="X"
            value={formData.cropX}
            onChange={handleChange}
            className="border p-2 mr-2"
          />
          <input
            type="number"
            name="cropY"
            placeholder="Y"
            value={formData.cropY}
            onChange={handleChange}
            className="border p-2 mr-2"
          />
          <input
            type="number"
            name="cropWidth"
            placeholder="Genişlik"
            value={formData.cropWidth}
            onChange={handleChange}
            className="border p-2 mr-2"
          />
          <input
            type="number"
            name="cropHeight"
            placeholder="Yükseklik"
            value={formData.cropHeight}
            onChange={handleChange}
            className="border p-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
        >
          İşlemleri Uygula
        </button>
      </form>
    </main>
  )
}
