import { Component, Injector, OnInit, } from '@angular/core';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { configureChains, createClient } from '@wagmi/core';
import { arbitrum, mainnet, polygon } from '@wagmi/core/chains';
import { SignClient } from "@walletconnect/sign-client";
import { Web3Modal } from "@web3modal/standalone";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent   implements OnInit {
  connectButton = document.getElementById("connect-button");
  
  projectId = "eb9917773f68f127976a4d73670ba762";
  namespaces = {
    eip155: {
      methods: ["eth_sign"],
      chains: ["eip155:1"],
      events: ["accountsChanged"],
    },
  };
  public web3Modal = new Web3Modal({
    projectId: this.projectId,
    walletConnectVersion: 2,
    standaloneChains: this.namespaces.eip155.chains,
  });
  signClient: any;

  constructor() { }

  title = 'angular-web3';
  
    async ngOnInit(){
      try {
        this.signClient = await SignClient.init({ projectId: this.projectId });
      } catch (err) {
        console.error(err);
      }
    }

    public async connectWallet(): Promise<void> {
      try {
        if (this.signClient) {
          const { uri, approval } = await this.signClient.connect({
            requiredNamespaces: this.namespaces,
          });
          if (uri) {
            await this.web3Modal.openModal({ uri });
            await approval();
            this.web3Modal.closeModal();
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
}
