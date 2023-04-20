import { Component, OnInit } from '@angular/core';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/html';
import { configureChains, createClient, Chain } from '@wagmi/core';
import { arbitrum, mainnet, polygon } from '@wagmi/core/chains';
import { sendTransaction, prepareSendTransaction, signMessage } from '@wagmi/core'
import { BigNumber } from 'ethers';
import { connect } from '@wagmi/core'
import { InjectedConnector } from '@wagmi/core/connectors/injected'


@Component({
  selector: 'app-web3modal',
  templateUrl: './web3-modal.component.html',
  styleUrls: ['./web3-modal.component.css']
})
export class Web3ModalComponent implements OnInit {
  chains: Chain[] = [arbitrum, mainnet, polygon];
  projectId = "eb9917773f68f127976a4d73670ba762";
  web3modal: any;
  ethereumClient: any;
  tokenContracts: any;

  constructor() { }

  ngOnInit(): void {
    
    const { provider } = configureChains(this.chains, [w3mProvider({ projectId: this.projectId })]);
    const wagmiClient = createClient({
      autoConnect: true,
      connectors: w3mConnectors({ projectId: this.projectId, version: 1, chains: this.chains }),
      provider
    });
    this.ethereumClient = new EthereumClient(wagmiClient, this.chains);
    this.web3modal = new Web3Modal({ 
      projectId: this.projectId, 
      tokenContracts: {
      1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
      },
      themeVariables: {
        '--w3m-font-family': 'Outfit, sans-serif',
        '--w3m-background-image-url': 'https://web3modal.com/images/wc-v2-illustration-bg.jpg',
        '--w3m-logo-image-url': '../assets/images/usd-sc-logo.svg'
      },
      tokenImages: {
        USDC: "../assets/images/USDC_1.svg"
      },
      themeMode: 'dark'
     }, 
    this.ethereumClient);
  }



  async send(){
    const config = await prepareSendTransaction({
      request: { 
        to: '0xa63c50EB3789571ae031333D4848BcEd9b919e1a', 
        value: BigNumber.from('10000000000000') 
      },
    })
    const { hash } = await sendTransaction(config)
  }

  async signMessage(){
    const signature = await signMessage({
      message: 'HOWZIT!',
    })

  }

  async checkConnection(){
    const result = await connect({
      connector: new InjectedConnector(),
    })
    console.log(result);
  }
}
