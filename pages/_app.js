import "../styles/globals.css";
// import the Provider from Self.ID
import { Provider } from "@self.id/react";

const MyApp = ({ Component, pageProps }) => {
  return (
    //  wrap every component of ours with the Self.ID provider.
    // we want the Provider to connect to the Clay Test Network for Ceramic.
    <Provider client={{ ceramic: "testnet-clay" }}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default MyApp;
