import React from 'react'
import Link from 'next/link'
import { FaShoppingCart, FaHeart } from 'react-icons/fa'

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            Handmade Store
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link href="/products" className="text-gray-600 hover:text-gray-900">
              Товары
            </Link>
            <Link href="/categories" className="text-gray-600 hover:text-gray-900">
              Категории
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              О нас
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900">
              {FaHeart({ className: "text-xl" })}
            </button>
            <button className="text-gray-600 hover:text-gray-900">
              {FaShoppingCart({ className: "text-xl" })}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
} 