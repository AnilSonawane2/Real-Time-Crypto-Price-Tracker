import { Provider } from 'react-redux';
import { store } from './store/store';
import Layout from './components/Layout';
import CryptoTable from './components/CryptoTable';

function App() {
  return (
    <Provider store={store}>
      <Layout>
        <CryptoTable />
      </Layout>
    </Provider>
  )
}

export default App
