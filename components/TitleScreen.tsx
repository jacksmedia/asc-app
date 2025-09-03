import Image from "next/image";

const TitleScreen = () => {
  return(
    <Image
        className=""
        src="/img/Title.png"
        alt="FF6 ASC logo"
        width={256}
        height={224}
        priority
    />
  );
};
export default TitleScreen;