import { NextPage } from 'next';
import Layout from '@/layout';
import PlusPatcher from '@/components/PlusPatcher';
import Attribution from '@/components/Attribution';

const HomePage: NextPage = () => {
  return (
    <Layout>
      <div className='plus-patcher-bg container-fluid'>
        <div className='row'>
          <h1 className='d-flex col-12 justify-content-center app-title'>FF6 "A Soldier's Contingency" Patcher</h1>
        </div>
        <PlusPatcher />
        {/* row styling exists in above component*/}
        <Attribution />
      </div>
    </Layout>
  );
};
export default HomePage;
