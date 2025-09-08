import Image from "next/image"

export default function Disclaimer() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">Disclaimer</h1>
      <p className="text-gray-700 mb-4">
        The information on this site is for educational purposes only. We do not guarantee accuracy 
        and disclaim liability for any outcomes from using the content.
      </p>
      <p className="text-gray-700 mb-4">
        Always follow safety guidelines when cooking and consult professionals if needed.
      </p>
      <div className="mt-6">
        <Image
          src="https://picsum.photos/800/300?random=6"
          alt="Disclaimer illustration"
          width={800}
          height={300}
          className="rounded-lg"
        />
      </div>
    </main>
  )
}
