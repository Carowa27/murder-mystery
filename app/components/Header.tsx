import Image from 'next/image';

export const Header = () => {
  return (
    <header className="w-full h-[64px] flex justify-between items-center  bg-background text-text-primary position-absolute top-0 sticky z-1000 ">
      <section>
        <Image
          src="/images/logotype/logo-minimal.png"
          height={60}
          width={60}
          alt="Nocturne logotype"
          className="ms-2"
        />
      </section>
      <section className="px-4 py-2">Menu/Profile</section>
    </header>
  );
};
