import '../styles/globals.css'
import { Provider } from 'react-redux'
import store from 'modules/store'
import Layout from 'components/Frame/Layout'
import { AuthProvider } from 'modules/context/AuthProvider'



function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Layout>
          <div >
            <Component {...pageProps} />
          </div>
        </Layout>
        </AuthProvider>
    </Provider>
  )
  
}

export default App;