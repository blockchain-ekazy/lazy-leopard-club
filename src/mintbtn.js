import React, { useState, useEffect } from "react";
import abi from "./abi.json";
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider';
require("dotenv").config();
 
const { REACT_APP_CONTRACT_ADDRESS } = process.env; 
const SELECTEDNETWORK = "4";
const SELECTEDNETWORKNAME = "Rinkeby TESTNET";
const nftquantity = 10000;

function Mintbtn() {
  const [errormsg, setErrorMsg] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [totalSupply, settotalSupply] = useState(0);

  useEffect(async () => {
    if (await detectEthereumProvider()) {
      // setProvider(true);
      window.web3 = new Web3(window.ethereum);
      const web3 = window.web3;
      if(await web3.eth.net.getId() == SELECTEDNETWORK){
      
        const contractaddress = REACT_APP_CONTRACT_ADDRESS;
        const ct = new web3.eth.Contract(abi, contractaddress);
        settotalSupply(await ct.methods.totalSupply().call());

        if (nftquantity-await ct.methods.totalSupply().call() == 0) {
          setErrorMsg("All NFTs minted, Sale has ended");
        }
      }
      else {
        // setProvider(false);
        setErrorMsg("Select \"" + SELECTEDNETWORKNAME + "\" network in your wallet to buy the nft");
      }
    }
    else {
      setErrorMsg("Non-Ethereum browser detected. You should consider trying MetaMask!");
      // setProvider(false);
    }
    if (window.ethereum) {
      handleEthereum();
    } 
    else {
      window.addEventListener('ethereum#initialized', handleEthereum, {once: true,});
      setTimeout(handleEthereum, 10000);
    }

function handleEthereum() {
  const { ethereum } = window;
  if (ethereum && ethereum.isMetaMask) {
    console.log('Ethereum successfully detected!');
    // setProvider(true);
  } else {
    setErrorMsg('Please install MetaMask!');
    // setProvider(false);
  }
}


  }, []);

  async function loadWeb3() {

    if (await detectEthereumProvider()) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const web3 = window.web3;
      // Meta Mask Connected Account Address
      let metaMaskAccount = await web3.eth.getAccounts();
      metaMaskAccount = metaMaskAccount[0];

      if(await web3.eth.net.getId() == SELECTEDNETWORK){
        // // creating contract instance
        const contractaddress = REACT_APP_CONTRACT_ADDRESS;
        const ct = new web3.eth.Contract(abi, contractaddress);
        let current = await ct.methods.totalSupply().call();
        if (Number(current) === nftquantity) {
          console.log("Sold out");
          return;
        }
        await ct.methods.mint(quantity).send({ from: metaMaskAccount });
        settotalSupply(await ct.methods.totalSupply().call());
        setQuantity(1);
      }else { setErrorMsg("Select \"" + SELECTEDNETWORKNAME + "\" network in your wallet to buy the nft") };
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      // window.alert(
      //   "Non-Ethereum browser detected. You should consider trying MetaMask!"
      // );
      { setErrorMsg("Non-Ethereum browser detected. You should consider trying MetaMask!") }
    }
  }

  return (
    <div>
      { !errormsg ? (
        <div className="row mintingsection py-5">
          <div className="col-sm-12">
            <div className="yellow">
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", margin: "auto", width: "320px"}} className="mt-2">
                <h3 className="text-white">Quantity</h3>
                <div style={{ marginLeft: "10px" }}>
                  <button className="minus back-button px-3 mx-1" 
                  onClick={() => {
                      if (quantity > 1) {
                        setQuantity(quantity - 1);
                      }
                    }}
                  >-</button>
                  <span style={{ fontSize: 30, margin: "0 15px", color: '#fff' }}>
                    {quantity}
                  </span>
                  <button
                    className="plus back-button px-3 mx-1"
                    onClick={() => {
                      if (quantity < 2) {
                        setQuantity(quantity + 1);
                      }
                    }}
                  >+</button>
                </div>
              </div>
            </div>
            <button
              className="mt-3 mint-btn mx-auto d-block"
              onClick={() => {
                loadWeb3();
              }}
            >Mint a Lazy Leopard!</button>
            <h5 className="mt-2 supplytext">{nftquantity-totalSupply}/{nftquantity} Available</h5>
          </div>
      </div> ) : <h5 className="mt-2 supplytext"><b>{ errormsg }</b></h5> }
    </div>
  );
}

export default Mintbtn;