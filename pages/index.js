import Head from 'next/head'
import { useState , useEffect } from 'react'
import Web3 from 'web3'
import '../node_modules/bulma/css/bulma.css'
import styles from '../styles/FirstDapp.module.css'
import vendingMachineContract from '@/blockchain/vending'


const FirstDapp = () => {

    const [error, setError] = useState('')
    const [inventory, setInventory] = useState('')
    const [successMsg, setsuccessMsg] = useState('')
    const [myDonutCount, setmyDonutCount] = useState('')
    const [buyCount, setBuyCount] = useState('')
    const [weeb3, setWeb3] = useState(null)
    const [address, setAddress] = useState(null)
    const [vmContract, setvmContract] = useState(null)
    const [purchases, setPurchases] = useState(0)

    useEffect(() => {
        if (vmContract) getInventoryHandler()
        if (vmContract && address) getmyDonutCountHandler()
    }, [vmContract,address,purchases]) 

    const getInventoryHandler = async () => {
        const inventory = await vmContract.methods.getVendingMachineBalance().call()
        setInventory(inventory)
    }

    const getmyDonutCountHandler = async () => {
        const count = await vmContract.methods.donutBalances(address).call()
        setmyDonutCount(count)
    }

    const updateDonutQty = event => {
        setBuyCount(event.target.value)
    }

    const buyDonutHandler = async () => {
        try {
            await vmContract.methods.purchase(buyCount).send({
                from: address,
                value: web3.utils.toWei('0.001', 'ether') * buyCount
            })
            setPurchases(purchases+buyCount)   
            setsuccessMsg(`${buyCount} Donut purchased!!`)
        } catch(err) {
            setError(err.message)
        }
    }

    const connnectWalletHandler = async () => {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined"){
            try {
                await window.ethereum.request({ method: "eth_requestAccounts" })
                web3 = new Web3(window.ethereum)
                setWeb3(weeb3)
                const accounts = await web3.eth.getAccounts()
                setAddress(accounts[0])
                const vm = vendingMachineContract(web3)
                setvmContract(vm)
            } catch(err) {
                setError(err.message)
            }
        } else {
            console.log("Please Install Metamask")
        }
    }

   // Styles
   const centerContainer = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#191D88'
};
const boxStyle = {
    backgroundColor: '#1450A3',
    borderRadius: '8px',
    padding: '3rem',
    minWidth: '300px',  // Minimum width
    minHeight: '200px',
    width: '500px',  // Increase this as needed
    height: '400px',
    fontSize:'25px',
    fontFamily: 'Bebas Neue, sans-serif',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
};

const buttonStyle = {
    padding: '0.5rem 1rem',
    color: '#fff',
    backgroundColor: '#337CCF',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'Bebas Neue, sans-serif',
    fontSize:'20px'
};
const footerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1450A3',
    color: '#FFC436',
    padding: '1rem 0',
    marginTop: '2rem',
    position: 'fixed',
    bottom: 0,
    width: '100%'
};

const labelStyle = {
    marginBottom: '0.5rem',
    display: 'block',
    marginLeft:'150px',
    color: '#ca5c00'
};

const inputStyle = {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
    marginBottom: '0.5rem',
    width: '100%'
};

const topNavbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#1450A3',
    padding: '1rem 10%', // 10% horizontal padding to match the box width
    position: 'fixed',
    top: 0,
    zIndex: 10 // to ensure it stays on top of other content
};


const mainContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#191D88'
};
const text = {
    fontSize:'40px',
    color:'#FFC436',
    fontFamily: 'Bebas Neue, sans-serif'
}
    return (
        <div style={centerContainer}>
            <Head>
                <title>First Dapp</title>
                <meta name="description" content="Created First Dapp" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" />
            </Head>

            <div style={topNavbarStyle}>
            <h1 style={text}>Vending Machine</h1>
            <button onClick={connnectWalletHandler} style={buttonStyle}>Connect Wallet</button>
            </div>

            <div style={mainContainerStyle}>
            <div style={boxStyle}>
                <section>
                    <h2 style={{ color: '#FFC436' }}>Vending Machine Inventory : {inventory}</h2>
                </section>
                <section>
                    <h2 style={{ color: '#FFC436' }}>My Donut : {myDonutCount}</h2>
                </section>
                <section style={{ marginTop: '2rem' }}>
                    <label style={labelStyle}>Buy Donuts</label>
                    <input onChange={updateDonutQty} style={inputStyle} type='number' placeholder='Enter amount of donuts to buy'></input>
                    <button onClick={buyDonutHandler} style={{ ...buttonStyle, marginTop: '0.5rem', width: '100%' }}>Buy</button>
                </section>
                <section>
                    <div style={{ color: 'red' }}>
                        <p>{error}</p>
                    </div>
                    <div style={{ color: 'green' }}>
                        <p>{successMsg}</p>
                    </div>
                </section>
            </div>
            <div style={footerStyle}>
              © {new Date().getFullYear()} Alan Joshy. All rights reserved.
            </div>

        </div>
        </div>
    )
}

export default FirstDapp