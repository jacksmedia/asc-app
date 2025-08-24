import { NextPage } from 'next';
import Layout from '@/layout';
import ClassicTitle from "@/components/ClassicTitle";

const Discord: NextPage = () => {
  return (
    <Layout>      
      <div className='discord-bg'>
        <ClassicTitle />
        <h1 className="">Discuss FF6 ASC</h1>
        <h2>#lightning-projects</h2>        
        <h2><a href="https://discord.gg/PGMASbSnD9" target='blank'>Join us in the FF4 Ultima Discord</a></h2>
      </div>
    </Layout>
  );
};

export default Discord;