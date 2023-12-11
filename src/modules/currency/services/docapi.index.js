const CurrencyModel = require('../currency.model');


const listCurrency = async () => {
  var filterQuery = {
    active: true
  };

  const listResult = await CurrencyModel.find(filterQuery).sort({ _id: -1 }
        )
  return listResult
}

const currencyDetails = async ()=>{
  var filterQuery = {
    active: true
  };
  const listResult = await CurrencyModel.find(filterQuery).sort({ _id: -1 }
        )
  return listResult
}

const getCurrencyById = async (id)=>{
  console.log("getCurrencyById ::", id);
 let currency = await CurrencyModel.findById(id)
 return currency
}

module.exports = {
    listCurrency,
    currencyDetails,
    getCurrencyById
}