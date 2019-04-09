const Lightwallet = require('eth-lightwallet');
const isNullOrUndefined = require('util');
const Web3 = require('web3');
const HookedWeb3Provider = require('hooked-web3-provider');
const wallet = require('../wallet/wallet.json');

let web3 = new Web3();
let contractAddr = 'YOUR_CONTRACT_ADDRESS';
let contractAbi = JSON.parse('[{"constant":true,"inputs":[{"name":"_indexPerson","type":"uint256"}],"name":"_searchPerson","outputs":[{"name":"_name","type":"string"},{"name":"_email","type":"string"},{"name":"_id","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_email","type":"string"},{"name":"_id","type":"uint256"}],"name":"_recorder","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ganhador","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"_winners","outputs":[{"name":"_index","type":"uint256"},{"name":"_name","type":"string"},{"name":"_email","type":"string"},{"name":"_id","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_name","type":"string"},{"indexed":false,"name":"_email","type":"string"},{"indexed":false,"name":"_id","type":"uint256"}],"name":"NewPerson","type":"event"}]');
let txutils = Lightwallet.txutils;
let signing = Lightwallet.signing;

class Erc20Controller {
    constructor(){}

    _recorder(req, res){
        console.log(req.data);	

        //Setar Dados
        let walletJson = JSON.stringify(wallet);
        let password = "";

        //ks é no final uma WalletHD, sendo assim possui infinitos enderecos derivada de um unico arquivo.
        //Estudem WalletHD para se informar melhor.
        let ks = Lightwallet.keystore.deserialize(walletJson);       

        //Descriptografa a wallet.json com o password.
        ks.keyFromPassword(password, function(err, pwDerivedKey) {	

            //Verifica se a chave é a correta
            if(ks.isDerivedKeyCorrect(pwDerivedKey))
            {
                //Seta Web3Provider, ele é responsavel pela conexao ao nó remoto da Infura
                //Com isso nao precisamos carregar um no completo em nossa maquina ou em um servidor.
                let web3Provider = new HookedWeb3Provider({
                    host: "https://rinkeby.infura.io/7xNw0DpR7VrQxYmSs303 ",
                    transaction_signer: ks
                });		  
                web3.setProvider(web3Provider); 
                
                //Nonce é o nome da fila de transacoes que o usuario possui. sempre acrecenta +1 a cada transacao do usuario
                //se o nonce anterior foi 0, o proxima transacao sera com nonce 1, podemos representar ele da seguinte forma matematica 
                //NONCE = N + 1, onde N = Numero de transacoes concluidas.
                let nonceNumber = parseInt(web3.eth.getTransactionCount(ks.getAddresses()[0], "pending"));

                //GasPrice é o valor que voce deseja pagar pela transacao, aqui representada em Gwai
                let gasprices = 21000000000;

                //GasLimit é o limite maximo que voce deseja pagar por uma transacao
                let gasLimit = 200000;	
                
                //OBS: a taxa paga ao minerador por transacao é representada pela seguinte funcao matematica
                //TxFee = gasprices * gasLimit.
                //Agora vamos supor que o minerado gastou um gas de 120000, entao colocamos na funcao TxFee = 21000000000 * 120000
                //TxFee = 2520000000000000 / 1 ETH (1000000000000000000)
                //TxFee = 0,00252 ETH

                //Pega o endereco da wallet, podemos observar que o indexador é zero, na computacao o indexador 0 é o primerio de uma lista.
                //sendo assim estamos pegando o primeiro endereco do nosso objeto ks.
                let sendingAddr = ks.getAddresses()[0];

                //Setando os TxOptions todas as transacoes possuem argumentos opcionais, e nessa parte estamos setando eles e convertendendo em Hexadecimal.
                let txOptions = {
                    nonce: web3.toHex(nonceNumber),
                    gasLimit: web3.toHex(gasLimit),
                    gasPrice: web3.toHex(gasprices),
                    to: contractAddr
                }

                //Cria um objeto com os parametos da nossa funcao do smart contract, eles devem respeitar a mesma ordem definica no smart contract
                //que voce desenvolveu.
                let arg = Array.prototype.slice.call([req.body.name, req.body.email, req.body.id]);   
                
                //gera o Bytecode para ser enviado a blockchain da ethereum, pois a EVM(ETHEREUM VIRTUAL MACHINE) compreeende codigos ByteCode.
                //deve-se passar 4 argumentos, functionTx(ABI, FUNCTION_NAME,PARAMETROS,TX_OPTIONS)
                //ABI = codigo abi do seu contrato
                //FUNCTION_NAME = Nome da funcao no seu contrato.
                //PARAMETROS = Parametros da sua funcao
                //TX_OPTIONS = TxOption definido anteriormente
                let rawTx = txutils.functionTx(contractAbi, '_recorder', arg, txOptions)

                //Assina rawTx com a chave privada da wallet obtiva do pwDerivedKey, ele possui 4 argumentos.
                //ks = Objetvo da wallet
                //pwDerivedKey = chave privada 
                //rawTx = objeto bytecode assinado pela chave privada
                //sendingAddr = endereco publico da wallet
                let signedSetValueTx = signing.signTx(ks, pwDerivedKey, rawTx, sendingAddr) 
                
                //Cria a transacao e envia para a blockchain da ethereum 
                web3.eth.sendRawTransaction('0x' + signedSetValueTx, function(err, hash) { 
                    //retorna erro ao enviar a para blockchain
                    if(!isNullOrUndefined.isNullOrUndefined(err)){
                        let error =  { 
                            isError: true,
                            msg: err
                        };
                        res.status(400).json(error);							
                    }   
                    //retorna Hash da transaction
                    if(!isNullOrUndefined.isNullOrUndefined(hash)){
                        let data = {
                            isError: false,
                            hash: hash						
                        };				
                        res.status(200).json(data);							
                    }
                    //Retorna erros que foi enviada mas por algum motivo nao foi aceita.
                    else
                    {							
                        let error = { 
                            isError: true,
                            msg: 'return hash is null'
                        };
                        res.status(400).json(error);
                    }	           
                }); 
            }
            else{	
                let error = {
                    isError: true,
                    msg: 'Password incorret'						
                };			
                res.status(400).json(error);
            }
        });
    }
}

module.exports =  Erc20Controller;