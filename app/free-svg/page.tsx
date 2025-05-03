import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function FreeSVGPage() {
  const collections = [
    {
      name: 'Japanese Culture',
      path: '/category/japanese-culture',
      description: 'A beautiful collection of free SVG icons representing Japanese culture, including traditional symbols, food, and landmarks.'
    },
    {
      name: 'Bitcoin Logo',
      path: '/category/btc-logo',
      description: 'A set of free SVG Bitcoin logos in various styles and formats, perfect for cryptocurrency projects.'
    },
    {
      name: 'Hello Kitty',
      path: '/category/hello-kitty',
      description: 'Cute and adorable free SVG Hello Kitty designs for your projects.'
    },
    {
      name: 'Heart',
      path: '/category/heart',
      description: 'A collection of free SVG heart designs in different styles and colors.'
    },
    {
      name: 'Flower',
      path: '/category/flower',
      description: 'A collection of free SVG flower designs in different styles and colors.'
    }
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Free SVG Collections</h1>
          <p className="text-lg mb-6">
            Welcome to our collection of free SVG resources! Here you'll find high-quality, 
            free SVG files for your projects. All these free SVG collections are carefully 
            curated and ready to use.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collections.map((collection) => (
              <div key={collection.path} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-2xl font-semibold mb-3">{collection.name}</h2>
                <p className="text-gray-600 mb-4">{collection.description}</p>
                <Link 
                  href={collection.path}
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  View Free SVG Collection
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Why Choose Our Free SVG Collections?</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All our free SVG files are optimized for web use</li>
              <li>Free SVG collections are regularly updated with new designs</li>
              <li>High-quality free SVG files that scale perfectly</li>
              <li>Free SVG resources for both personal and commercial use</li>
              <li>Easy to download and implement free SVG icons</li>
            </ul>
          </div>

          <div className="mt-12 bg-gray-100 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">How to Use Free SVG Files</h2>
            <p className="mb-4">
              Our free SVG collections are designed to be easy to use. Simply download the 
              free SVG files you need and implement them in your projects. These free SVG 
              resources are perfect for web design, mobile apps, and print materials.
            </p>
            <p>
              Remember to check the license terms for each free SVG collection. While most 
              of our free SVG files are available for commercial use, some may have specific 
              requirements.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 