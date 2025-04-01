let web3;
let account;
const contractABI = [
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "checkBalance",
    outputs: [{ internalType: "uint256", name: "balance", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

const contractAddress = "0x238ef77E87b55f867e221F4992AA1d356ec9cd1d";

async function init() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts();
    account = accounts[0];
    document.getElementById("account").innerText = account;

    console.log("Connected Account:", account);
    console.log("Contract Address:", contractAddress);

    const contract = new web3.eth.Contract(contractABI, contractAddress);
    console.log("Contract ABI:", contractABI);

    try {
      const balance = await contract.methods
        .checkBalance()
        .call({ from: account });
      console.log("Balance from contract:", balance);
      document.getElementById("balance").innerText = web3.utils.fromWei(
        balance.toString(),
        "ether"
      );
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  } else {
    alert("Please install MetaMask!");
  }
}

async function deposit() {
  const amount = document.getElementById("amount").value;
  if (!amount || amount <= 0) return;
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  await contract.methods
    .deposit()
    .send({ from: account, value: web3.utils.toWei(amount, "ether") });
  location.reload();
}

async function withdraw() {
  const amount = document.getElementById("amount").value;
  if (!amount || amount <= 0) return;
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  await contract.methods
    .withdraw(web3.utils.toWei(amount, "ether"))
    .send({ from: account });
  location.reload();
}

window.onload = init;
