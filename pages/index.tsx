import { NextPage } from 'next';
import Image from "next/image";
import Layout from '@/layout';
import PlusPatcher from '@/components/PlusPatcher';
import Attribution from '@/components/Attribution';

const HomePage: NextPage = () => {
  return (
    <Layout>
      <div className='plus-patcher-bg container'>
        <div className='flex-row justify-content-around'>
          <p className='col-10 justify-content-center app-title'>

            <Image src='https://ff6asc.vercel.app/img/favicon.png'
            width={20}
            height={20}
            className='col-1 justify-content-center align-items-center image-sizing' />
          
              FF6 "A Soldier's Contingency" Patcher
              
            <Image src='https://ff6asc.vercel.app/img/favicon.png'
            width={20}
            height={20}
            className='col-1 justify-content-center align-items-center image-sizing' />
          
          </p>
          
        </div>
        <PlusPatcher />
        {/* row styling exists in above component*/}
        <Attribution />
      </div>
    </Layout>
  );
};
export default HomePage;
