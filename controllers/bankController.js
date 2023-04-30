const mysql = require ('mysql/promise');
const crypto = require ('crypto');
const sdk = require('api')('@raven-atlas/v1.0#q6geo3gl7pdtgoz');
sdk.auth('Bearer RVPUB-19239cc56ef568e677c90b80ea879455d266fecd50081ca8540138175b09-1682685347830');
sdk.makeANewTransfer({
  amount: 100,
  bank: 'Access Bank',
  bank_code: '044',
  currency: 'NGN',
  account_number: '9982345678',
  account_name: 'mathew',
  narration: 'transfer',
  reference: '202207111524IIGEEHC'
})
  .then(({ data }) => console.log(data))
  .catch(err => console.error(err));

// requiring knex and connecting to the database
const knex = require ('knex') ({
  client: 'mysql',
  connection: {
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'Raven',
  },
});

// const connection = await mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'password',
//   database: 'bank_accounts'
// });

exports.createBankAccount = async (req, res) => {
  try {
    const accountNumber = crypto.randomBytes (16).toString ('hex');
    const result = await knex ('bank_accounts').insert ({
      account_number: accountNumber,
    });
    const accountId = result[0];
    res.status (201).json ({id: accountId, account_number: accountNumber});
  } catch (err) {
    console.error (err);
    res.status (500).send ('Server error');
  }
};

exports.getBankAccountById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await knex ('bank_accounts').where ({id}).select ();
    if (result.length === 0) {
      res
        .status (404)
        .send ({message: 'Account was not found', status: 'not found'});
    } else {
      const account = result[0];
      res.json ({
        id: account.id,
        account_number: account.account_number,
        balance: account.balance,
      });
    }
  } catch (err) {
    console.error (err);
    res
      .status (500)
      .send ({message: 'There was a Server error', status: 'Server error'});
  }
};
sdk.makeANewTransfer({
    amount: 100,
    bank: 'Access Bank',
    bank_code: '044',
    currency: 'NGN',
    account_number: '9982345678',
    account_name: 'mathew',
    narration: 'transfer',
    reference: '202207111524IIGEEHC'
  })

exports.transferToBank = async(req, res) => {   
    const { id } = req.param
    const {bank, bank_code, amount, currency, acct_name, acct_number, naration, reference} = req.body

    try{
        const transfer = sdk.makeANewTransfer({
            amount: amount,
            bank: bank,
            bank_code: bank_code,
            currency: currency,
            account_number: acct_number,
            account_name: acct_name,
            narration: naration,
            reference: '202207111524IIGEEHC'
          }).then(data => {
            console.log(data)
          }) 
        const raven = await knex("").insert({bank, bank_code, acct_name, acct_number, amount, currency, naration, reference})
    }
    catch (error) {

    }
}

exports.depositIntoBankAccount = async (req, res) => {
  try {
    const id = req.params.id;
    const amount = parseFloat (req.body.amount);
    const result = await knex ('bank_accounts')
      .where ({id})
      .increment ('balance', amount);
    if (result === 0) {
      res.status (404).send ('Account not found');
    } 
    else {
      const accountResult = await knex ('bank_accounts')
        .where ({id: req.params.id})
        .select ();
      const account = accountResult[0];
      const webhookUrl = 'https://webhook.site/650d4b14-a112-4e58-8fb9-2d2b256066c2';
      const webhookPayload = {
        account_number: account.account_number,
        amount: amount,
      };
      await axios.post (webhookUrl, webhookPayload);
      res.send ({message: 'Deposit successful', status: "success"});
      console.log
    }
  } 
  catch (err) {
    console.error (err);
    res.status (500).send ('Server error');
  }
};

// exports.depositIntoBankAccount = async (req, res) => {
//     try {
//         const id = req.params.id
//         const amount = parseFloat(req.body.amount);
//         const result = await knex('bank_accounts').where({ id }).increment('balance', amount);
//         if (result === 0) {
//           res.status(404).send({message: 'Account not found', status: "failed"});
//           console.log("Account not found")
//         } else {
//           res.send({message: 'Deposit to account was successful', result});
//           console.log("Deposit was successful")
//         }
//       } catch (err) {
//         console.error(err);
//         res.status(500).send({message: 'There was a server error', status: "Server error"});
//       }
// };

exports.getTransactions = async (req, res) => {
  try {
    const { id } = req.query;
    if(!id || id == 0) {
        res.status(400).send({message: 'A query valued is required', status: "failed"});
    }
    const result = await knex ('transactions').where ({ id }).select ();
    if(!result || result === 0) {
        res.status(404).send({message: 'User not found', status: "failed"});
    }
  } 
  catch (error) {
    console.log (error);
    res
      .status (500)
      .send ({message: 'There was a server error', status: 'Server error'});
  }
};


exports.getDeposits = async (req, res) => {
    const { userId } = req.query
    if(!userId || userId == 0) {
        res.status(400).send({message: 'A query valued is required', status: "failed"});
    }

    try {
        const deposits = await knex('deposits').where({ userId });
        if(!deposits || deposits == 0) {
            res.status(404).send({message: 'User not found', status: "failed"});
        }
        else{
            res.status(200).send({message: "Deposit history recieved successfully", status: "success", deposits})
            console.log("Successfully recieved deposit history")
        }
      } 
      catch (error) {
        console.error(error);
        res.status(500).send({message: "There was a server error", status: "server error", error})
      }
}

exports.getAllHistory = async (req, res) => {

}