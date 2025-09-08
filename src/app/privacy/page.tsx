import Image from "next/image"

export default function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-700 mb-4">
        This is a sample Privacy Policy page. We value your privacy and ensure that any data collected
        is handled securely.
      </p>
      <p className="text-gray-700 mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut 
        labore et dolore magna aliqua.
      </p>
      <div className="mt-6">
        <Image
          src="https://picsum.photos/800/300?random=5"
          alt="Privacy illustration"
          width={800}
          height={300}
          className="rounded-lg"
        />
      </div>
    </main>
  )
}
