import styles from "../styles/Home.module.css";
import { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
// allows storing and retrieving profile information on Ceramic Network.
import { useViewerRecord } from "@self.id/react";
// import Web3Provider from ethers.
import { Web3Provider } from "@ethersproject/providers";
// setup a React Hook provided to us by the Self.ID SDK. Self.ID provides a hook called useViewerConnection which gives us an easy way to connect and disconnect to the Ceramic Network.
import { useViewerConnection } from "@self.id/react";
// EthereumAuthProvider is a class exported by the Self.ID SDK which takes an Ethereum provider and an address as an argument, and uses it to connect your Ethereum wallet to your 3ID.
import { EthereumAuthProvider } from "@self.id/web";

const Home = () => {
  const [connection, connect, disconnect] = useViewerConnection();
  const web3ModalRef = useRef();

  // connectToSelfID takes this Ethereum Auth Provider, and calls the connect function that we got from the useViewerConnection hook which takes care of everything else for us.
  const connectToSelfID = async () => {
    const ethereumAuthProvider = await getEthereumAuthProvider();
    connect(ethereumAuthProvider);
  };

  // getEthereumAuthProvider creates an instance of the EthereumAuthProvider.
  const getEthereumAuthProvider = async () => {
    // access the actual provider instance through the provider property on wrappedProvider
    const wrappedProvider = await getProvider();
    const signer = wrappedProvider.getSigner();
    const address = await signer.getAddress();
    return new EthereumAuthProvider(wrappedProvider.provider, address);
  };

  // This function will prompt the user to connect their Ethereum wallet, if not already connected, and then return a Web3Provider.
  const getProvider = async () => {
    const provider = await web3ModalRef.current.connect();
    const wrappedProvider = new Web3Provider(provider);
    return wrappedProvider;
  };

  useEffect(() => {
    // checking that if the user has not yet been connected to Ceramic,
    if (connection.status !== "connected") {
      // initialize the web3Modal.
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }
  }, [connection.status]);
  return (
    <div className={styles.main}>
      <div className={styles.navbar}>
        <span className={styles.title}>Ceramic Demo</span>
        {connection.status === "connected" ? (
          // if you are already connected, it  says 'Connected'
          <span className={styles.subtitle}>Connected</span>
        ) : (
          // connects you to SelfID
          <button
            onClick={connectToSelfID}
            className={styles.button}
            disabled={connection.status === "connecting"}
            style={{ color: "gray" }}
          >
            Connect
          </button>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.connection}>
          {connection.status === "connected" ? (
            <div>
              <span className={styles.subtitle}>
                Your 3ID is {connection.selfID.id}
              </span>
              <RecordSetter />
            </div>
          ) : (
            <span className={styles.subtitle}>
              Connect with your wallet to access your 3ID
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

///////////////////////////////////////////
const RecordSetter = () => {
  // create a state variable for name that you can type out to update your record
  const [name, setName] = useState("");
  const record = useViewerRecord("basicProfile");
  console.log(record);

  // helper function to update the name stored in our record (data on Ceramic).
  const updateRecordName = async (name) => {
    await record.merge({
      name: name,
    });
  };
  return (
    <div className={styles.content}>
      <div className={styles.mt2}>
        {record.content ? (
          <div className={styles.flexCol}>
            <span className={styles.subtitle}>
              Hello {record.content.name}!
            </span>

            <span>
              The above name was loaded from Ceramic Network. Try updating it
              below.
            </span>
          </div>
        ) : (
          <span>
            You do not have a profile record attached to your 3ID. Create a
            basic profile by setting a name below.
          </span>
        )}
      </div>

      <input
        type='text'
        placeholder='Name'
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={styles.mt2}
      />
      <button onClick={() => updateRecordName(name)}>Update</button>
    </div>
  );
};

///////////////////////////////////////////
export default Home;
