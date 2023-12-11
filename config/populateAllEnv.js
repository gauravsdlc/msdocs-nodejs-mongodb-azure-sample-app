require("dotenv").config();
const mongoose = require("mongoose");
const { getSecret } = require("./keyvault");



async function populate() {
    
  if (!process.env.MONGODB_URL) {

    const keyVaultName = process.env.KEY_VAULT_NAME || "fils-api-key-vault";

    process.env.PORT = await getSecret("PORT", keyVaultName)
    process.env.MONGODB_URL = await getSecret("MONGODB_URL", keyVaultName)
    process.env.DB_NAME = await getSecret("DB_NAME", keyVaultName)
    process.env.JWT_SECRET = await getSecret("JWT_SECRET", keyVaultName)
    process.env.JWT_ACCESS_EXPIRATION_MINUTES = await getSecret("JWT_ACCESS_EXPIRATION_MINUTES", keyVaultName)
    process.env.JWT_REFRESH_EXPIRATION_DAYS = await getSecret("JWT_REFRESH_EXPIRATION_DAYS", keyVaultName)
    process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES = await getSecret("JWT_RESET_PASSWORD_EXPIRATION_MINUTES", keyVaultName)
    process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES = await getSecret("JWT_VERIFY_EMAIL_EXPIRATION_MINUTES", keyVaultName)
    process.env.NODE_ENV = await getSecret("NODE_ENV", keyVaultName)
    process.env.s3AccessKeyId = await getSecret("s3AccessKeyId", keyVaultName)
    process.env.s3AccessSecret = await getSecret("s3AccessSecret", keyVaultName)
    process.env.s3Region = await getSecret("s3Region", keyVaultName)
    process.env.s3Bucket = await getSecret("s3Bucket", keyVaultName)
    process.env.IMGIX_URL = await getSecret("IMGIX_URL", keyVaultName)
    process.env.POLYGONSCAN_API_KEY = await getSecret("POLYGONSCAN_API_KEY", keyVaultName)
    process.env.SENDGRID_API_KEY = await getSecret("SENDGRID_API_KEY", keyVaultName)
    process.env.SENDGRID_FROM = await getSecret("SENDGRID_FROM", keyVaultName)
    process.env.POLYGON_RPC_URL = await getSecret("POLYGON_RPC_URL", keyVaultName) 
    process.env.BASE_URL = await getSecret("BASE_URL", keyVaultName)
    process.env.POLYGONSCAN_API_KEY = await getSecret("POLYGONSCAN_API_KEY", keyVaultName)
    process.env.maticvigilID = await getSecret("maticvigilID", keyVaultName)
    process.env.defaultNetwork = await getSecret("defaultNetwork", keyVaultName)
    process.env.TOKEN_CONTRACT = await getSecret("TOKEN_CONTRACT", keyVaultName) 
    process.env.PLATFORM_CONTRACT = await getSecret("PLATFORM_CONTRACT", keyVaultName) 
    process.env.PRIVATE_KEY = await getSecret("PRIVATE_KEY", keyVaultName)
    process.env.ADMIN_WALLET = await getSecret("ADMIN_WALLET", keyVaultName)
    process.env.ENABLE_WEBHOOK_CHECK = await getSecret("ENABLE_WEBHOOK_CHECK", keyVaultName)
    process.env.TOKEN_CONTRACT = await getSecret("TOKEN_CONTRACT", keyVaultName) 
    process.env.PLATFORM_CONTRACT = await getSecret("PLATFORM_CONTRACT", keyVaultName) 
    process.env.PRIVATE_KEY = await getSecret("PRIVATE_KEY", keyVaultName)
    process.env.ADMIN_WALLET = await getSecret("ADMIN_WALLET", keyVaultName)
    process.env.POLYGON_API_KEY = await getSecret("POLYGON_API_KEY", keyVaultName)
    process.env.POLYGON_RPC_URL = await getSecret("POLYGON_RPC_URL", keyVaultName)

    // still don't have a database url?
    if(!process.env.MONGODB_URL){
      throw new Error("No value in DATABASE_URL in env var");
    }
  }
}


module.exports = {
  populate
}