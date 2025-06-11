"use client";

import Image from 'next/image';
import Link from 'next/link';

export default function MainPage() {
  const teamMembers = [
    {
      name: "Arthur Schurhaus",
      image: "https://media.licdn.com/dms/image/v2/D4D03AQGTmz1npe4ADA/profile-displayphoto-shrink_100_100/B4DZRYe5vcHcAY-/0/1736651284140?e=1755129600&v=beta&t=g2ieZqviSHR_pMn6jvIbQUUqQQCa86th4aLp7GfbmU4",
      linkedin: "https://www.linkedin.com/in/arthurschur/"
    },
    {
      name: "Estefano Tuyama",
      image: "https://media.licdn.com/dms/image/v2/D4D03AQEnZEVOe73c5g/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1730758020994?e=1755129600&v=beta&t=3aX2vonNqANSSsZ8QlpwAhLPPF1qF_QiSoTRpspKTek",
      linkedin: "https://www.linkedin.com/in/estefano-tuyama-gerassi/"
    },
    {
      name: "Gean Pereira",
      image: "https://media.licdn.com/dms/image/v2/D4D03AQHt-JizpaRPkg/profile-displayphoto-shrink_200_200/B4DZZ_2SGTHwAY-/0/1745901659029?e=1755129600&v=beta&t=ELxKprZJ_kucrTksHKUljQU9vUpqb7oIYuSYccyq1J0",
      linkedin: "https://www.linkedin.com/in/gean-pereira/"
    },
    {
      name: "Rafael Vieira",
      image: "https://media.licdn.com/dms/image/v2/D4E03AQEYN4XKskLeQQ/profile-displayphoto-shrink_200_200/B4EZcl_3aTHkAY-/0/1748689189569?e=1755129600&v=beta&t=a0GlxOwi06fpKwMhDrMDjixEUgSqurzRZy-fbB8EBRM",
      linkedin: "https://www.linkedin.com/in/rafael-vieira-ferreira-973546304/"
    },
    {
      name: "Tom Sales",
      image: "https://media.licdn.com/dms/image/v2/D4D03AQFSSvtzbff3Aw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1728685019939?e=1755129600&v=beta&t=crr9oC51rtbHFFMYzgA1Kcv1MWzgWYHj8sEFrDow978",
      linkedin: "https://www.linkedin.com/in/tom-sales-camargo/"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          ThinkNetwork
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Conectando mentes, compartilhando ideias, construindo o futuro juntos.
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/home"
            className="px-8 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            Começar Agora
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">O que oferecemos</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <h3 className="text-xl font-semibold mb-3">Compartilhamento</h3>
            <p className="text-muted-foreground">Compartilhe seus momentos, histórias e conhecimentos com uma comunidade engajada.</p>
          </div>
          <div className="p-6 rounded-lg bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <h3 className="text-xl font-semibold mb-3">Conexões</h3>
            <p className="text-muted-foreground">Faça conexões significativas com pessoas que compartilham seus interesses.</p>
          </div>
          <div className="p-6 rounded-lg bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <h3 className="text-xl font-semibold mb-3">Aprendizado</h3>
            <p className="text-muted-foreground">Aprenda com a experiência de outros e contribua com seu conhecimento.</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Nossa Equipe</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <a
              key={member.name}
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-lg bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">{member.name}</h3>
              <p className="text-center text-primary">Ver perfil no LinkedIn</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
