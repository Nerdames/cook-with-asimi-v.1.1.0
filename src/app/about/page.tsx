import Image from "next/image"
import 'boxicons/css/boxicons.min.css' // Import Boxicons CSS

export default function AboutPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">About Cook With Asimi</h1>
        <p className="text-lg text-gray-700">
          Sharing delicious recipes and culinary inspiration with everyone.
        </p>
        <div className="mt-8">
          <Image
            src="https://picsum.photos/1200/400?random=1"
            alt="Cooking hero"
            width={1200}
            height={400}
            className="rounded-lg object-cover"
          />
        </div>
      </section>

      {/* Our Mission */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed">
          At Cook With Asimi, our mission is to make cooking accessible, fun, and healthy for everyone. 
          We believe in sharing recipes that are easy to follow, flavorful, and nourishing.
        </p>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Asimi James", role: "Founder & Chef", img: "https://picsum.photos/300/300?random=2", icon: "bxs-chef" },
            { name: "Chibu Okoye", role: "Content Creator", img: "https://picsum.photos/300/300?random=3", icon: "bxs-pencil" },
            { name: "Ada Nwosu", role: "Marketing Lead", img: "https://picsum.photos/300/300?random=4", icon: "bxs-bullhorn" },
          ].map((member) => (
            <div key={member.name} className="text-center">
              <Image
                src={member.img}
                alt={member.name}
                width={300}
                height={300}
                className="rounded-full mx-auto object-cover"
              />
              <h3 className="mt-4 text-xl font-medium flex items-center justify-center gap-2">
                <i className={`bx ${member.icon}`}></i> {member.name}
              </h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
