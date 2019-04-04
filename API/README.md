<p align="center">
  <img
    src="https://www.bitconf.com.br/portal/wp-content/uploads/2018/12/cropped-logo-BITCONF-fundo-claro-e1546221496393.png"
    width="125px;">
</p>

<h1 align="center">SORTEIO BITCONF </h1>

<p align="center"> Api for the Leaxcoin Wallet </p>

# Getting Started

```
npm install 
npm start

```

# Routes

## **`/api/seed/:point`**
```
add entropy to the wallet seed security phrase generation
```

__Inputs__

- `point:`

__Outputs__
- `data:[isError,Seed]`

<br>

## **`/api/wallet`**
```
function responsible for the generation of wallet.json where the seed is received from '/seed/:point'
```

__Inputs__

- `seed:`
- `password:`

__Outputs__
- `data:[wallet]`

<br>


## **`/api/wallet/seed`**
```
function responsible for return wallet for seed
```

__Inputs__ 

- `password:`
- `seed:`

__Outputs__
- `data:[wallet]`


<br>

## **`/api/wallet/validate`**
```
function responsible for validate if password is compatible with wallet
```

__Inputs__ 

- `wallet:`
- `password:`

__Outputs__
- `data:[isError,Msg]`

<br>


## **`/api/seed`**
```
function responsible for show seed
```

__Inputs__ 

- `wallet:`
- `password:`

__Outputs__
- `data:[isError,Seed]`

<br>



## **`/api/eth/balance`**
```
Function responsible for returning account balance in ETH 
```

__Inputs__ 

- `wallet:`
- `password:`

__Outputs__
- `data:[address,balance]`

<br>



## **`/api/token/balance`**
```
Function responsible for returning account balance in token contract ERC20
```

__Inputs__ 

- `wallet:`
- `password:`

__Outputs__
- `data:[address,balance]`

<br>

## **`/api/eth/send`**
```
Function responsible for send ETH
```

__Inputs__ 

- `wallet:`
- `password:`
- `to:`
- `from:`
- `gasLimit:`
- `gasPrice:`
- `value:`

__Outputs__
- `data:[isError,hash]`

<br>

## **`/api/token/send`**
```
Function responsible for send Token Contract
```

__Inputs__ 

- `wallet:`
- `password:`
- `to:`
- `from:`
- `gasLimit:`
- `gasPrice:`
- `value:`

__Outputs__
- `data:[isError,hash]`

<br>


## **`/api/transaction/:address`**
```
Function responsible for return list all transaction 
```
__Inputs__ 
- `address:`

__Outputs__
- `JSON all transaction`

<br>
